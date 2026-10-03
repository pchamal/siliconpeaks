import http from 'node:http';
import fs from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.txt':'text/plain; charset=utf-8','.xml':'application/xml','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.avif':'image/avif','.webp':'image/webp','.woff2':'font/woff2','.mp4':'video/mp4'};
types['.mjs']='text/javascript; charset=utf-8';
const publicFile=p=>p==='/index.html'||/^\/(?:companies|startups|investors)\/index\.html$/.test(p)||/^\/(?:robots\.txt|sitemap\.xml|llms\.txt|llms-full\.txt|lms\.txt|humans\.txt)$/.test(p)||/^\/(?:assets|logos)\//.test(p);
export function createPreviewServer(root){
 return http.createServer(async(req,res)=>{
  try{
   const route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   if(/^\/(?:companies|startups|investors)$/.test(route)){res.writeHead(308,{'Location':route+'/'});res.end();return;}
   const url=route==='/'?'/index.html':/^\/(?:companies|startups|investors)\/$/.test(route)?route+'index.html':route;
   const file=path.resolve(root,'.'+url);
   if(!file.startsWith(root+path.sep)||!publicFile(url)||!['GET','HEAD'].includes(req.method)){res.writeHead(404);res.end('Not found');return;}
   const info=await fs.stat(file);
   if(!info.isFile()){res.writeHead(404);res.end('Not found');return;}
   const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Silicon-Peaks':'local-preview','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
   let start=0,end=info.size-1,status=200;
   // Single byte ranges support native media seeking, including Safari's probe.
   if(req.headers.range){
    const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
    let valid=Boolean(match&&(match[1]||match[2])&&info.size);
    if(valid){
     if(!match[1]){const suffix=Number(match[2]);start=Math.max(0,info.size-suffix);valid=Number.isSafeInteger(suffix)&&suffix>0;}
     else{start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),end):end;}
     valid=valid&&Number.isSafeInteger(start)&&Number.isSafeInteger(end)&&start<=end&&start<info.size;
    }
    if(!valid){res.writeHead(416,{...headers,'Content-Range':`bytes */${info.size}`,'Content-Length':0});res.end();return;}
    status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
   }
   headers['Content-Length']=Math.max(0,end-start+1);
   res.writeHead(status,headers);
   if(req.method==='HEAD'||info.size===0){res.end();return;}
   const stream=createReadStream(file,{start,end});
   stream.on('error',()=>res.destroy());
   res.on('close',()=>stream.destroy());
   stream.pipe(res);
  }catch{res.writeHead(404);res.end('Not found');}
 });
}
