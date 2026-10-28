import {Heedeo} from '@heedeo/sdk';

// Only /hd/* reaches this Worker (assets.run_worker_first); every page and asset is served
// straight from static assets. Heedeo fails open: without a secret or upstream, /hd answers 503
// and pages carry on without signals.
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
