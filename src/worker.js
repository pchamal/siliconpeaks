import {Heedeo} from '@heedeo/sdk';
import {searchTemplateTarget} from './search-template.mjs';

// /hd/* is the Heedeo beacon. The HTML routes also run here first so a leaked
// SearchAction template (?q={search_term_string}) 301s to that path with no query,
// instead of being served as a second copy of the page. Assets and every other
// path stay on static assets. Heedeo fails open: without a secret or upstream,
// /hd answers 503 and pages carry on without signals.
const VISIT='/hd/visit';

// Cloudflare sets cf-connecting-ip at its edge and overwrites any client-sent value. A Worker
// route has no origin that could be reached around Cloudflare, so this source is trusted.
const clientIp=request=>request.headers.get('cf-connecting-ip');

const unavailable=()=>new Response(null,{status:503,headers:{'cache-control':'no-store'}});

async function recordVisit(heedeo,request){
 let token=null;
 try{({token}=await request.json())}catch{}
 if(typeof token!=='string'||!token||token.length>4096)return new Response(null,{status:400});
 const {data,error}=await heedeo.event({request,token,action:'visit'});
 if(data)console.info('heedeo visit',data.event_id,data.visitor?`visitor ${data.visitor.id}`:'unmatched');
 if(error)console.warn('heedeo visit',error.code);
 // Signals stay on the server; the browser learns only that the beacon was received.
 return new Response(null,{status:204,headers:{'cache-control':'no-store'}});
}

export default {
 async fetch(request,env){
  try{
   const target=searchTemplateTarget(request.url);
   if(target)return Response.redirect(target,301);
  }catch(err){
   console.warn('search template',err?.message);
  }
  const {pathname}=new URL(request.url);
  if(!pathname.startsWith('/hd/'))return env.ASSETS.fetch(request);
  let heedeo;
  try{
   heedeo=new Heedeo({secretKey:env.HEEDEO_SECRET_KEY,clientIp,baseUrl:'https://app.heedeo.com'});
  }catch{
   console.warn('heedeo: HEEDEO_SECRET_KEY is not set');
   return unavailable();
  }
  try{
   if(pathname===VISIT)return request.method==='POST'?await recordVisit(heedeo,request):new Response(null,{status:405});
   const response=await heedeo.proxy(request);
   if(response.status>=500)console.warn('heedeo proxy',pathname,response.status,(await response.clone().text()).slice(0,200));
   return response;
  }catch(err){
   console.warn('heedeo',err?.message);
   return unavailable();
  }
 },
};
