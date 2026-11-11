import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createPreviewServer} from '../scripts/preview-server.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
test('preview serves video, range requests, and HEAD without exposing source files',async t=>{
 const server=createPreviewServer(root);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>server.close(resolve)));
 const base='http://127.0.0.1:'+server.address().port;
 const url=base+'/assets/media/silicon-peaks-story.mp4';
 const head=await fetch(url,{method:'HEAD'});
 assert.equal(head.status,200);assert.equal(head.headers.get('content-type'),'video/mp4');assert.equal(await head.text(),'');
 const size=Number(head.headers.get('content-length'));assert.ok(size>100000);
 const probe=await fetch(url,{headers:{Range:'bytes=0-1'}});
 assert.equal(probe.status,206);assert.equal(probe.headers.get('content-range'),`bytes 0-1/${size}`);assert.equal((await probe.arrayBuffer()).byteLength,2);
 const end=await fetch(url,{headers:{Range:'bytes=-16'}});
 assert.equal(end.status,206);assert.equal(end.headers.get('content-range'),`bytes ${size-16}-${size-1}/${size}`);assert.equal((await end.arrayBuffer()).byteLength,16);
 for(const range of ['bytes=99999999-','bytes=3-1','bytes=-0','bytes=0-1,3-4']){
  const res=await fetch(url,{headers:{Range:range}});assert.equal(res.status,416);assert.equal(res.headers.get('content-range'),`bytes */${size}`);await res.arrayBuffer();
 }
 const missing=await fetch(base+'/src/template.html');assert.equal(missing.status,404);await missing.text();
 for(const route of ['companies','startups','investors']){
  const redirect=await fetch(base+'/'+route,{redirect:'manual'});
  assert.equal(redirect.status,308);assert.equal(redirect.headers.get('location'),'/'+route+'/');
  const page=await fetch(base+'/'+route+'/');assert.equal(page.status,200);
  assert.ok(page.headers.get('content-type').includes('text/html'));
  assert.ok((await page.text()).includes('https://siliconpeaks.com/'+route+'/'));
 }
 const nonexistent=await fetch(base+'/companies/missing');assert.equal(nonexistent.status,404);await nonexistent.text();
 for(const junk of ['/?q={search_term_string}','/?q=%7Bsearch_term_string%7D','/companies/?q={search_term_string}']){
  const leaked=await fetch(base+junk,{redirect:'manual'});
  assert.equal(leaked.status,301,junk);
  const location=leaked.headers.get('location');
  assert.equal(location,junk.startsWith('/companies')?'/companies/':'/');
  assert.ok(!location.includes('search_term_string'));
  await leaked.text();
 }
 const ordinary=await fetch(base+'/?q=software');
 assert.equal(ordinary.status,200);
 assert.match(await ordinary.text(),/<link href="https:\/\/siliconpeaks.com\/" rel="canonical"\/>/);
});
