import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gzipSync} from 'node:zlib';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('sitemap pages have distinct search metadata, valid schema and crawlable internal links',()=>{
 const urls=[...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.equal(urls.length,4);
 const titles=new Set(),descriptions=new Set();
 for(const url of urls){
  const route=new URL(url).pathname,html=read(route==='/'?'index.html':route.slice(1)+'index.html');
  const title=html.match(/<title>([^<]+)<\/title>/)[1];assert.ok(!titles.has(title));titles.add(title);
  const meta=html.match(/<meta\b(?=[^>]*name="description")[^>]*>/)[0];
  const description=meta.match(/content="([^"]+)"/)[1];assert.ok(description.length>70&&description.length<180);assert.ok(!descriptions.has(description));descriptions.add(description);
  const canonical=html.match(/<link\b(?=[^>]*rel="canonical")[^>]*>/)[0].match(/href="([^"]+)"/)[1];assert.equal(canonical,url);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.ok(graph.some(e=>e.url===url&&/Page$/.test(e['@type'])));
  if(route!=='/'){
   const crumbs=graph.find(e=>e['@type']==='BreadcrumbList');assert.equal(crumbs.itemListElement.at(-1).item,url);
   const count=(html.match(/class="entry-arrow"/g)||[]).length,list=graph.find(e=>e['@type']==='ItemList');
   if(list){assert.equal(list.numberOfItems,count);assert.equal(list.itemListElement.length,count);}
   assert.ok(gzipSync(html).length<20000);assert.ok(!html.includes('/assets/site.js'));
  }
  for(const [,target] of html.matchAll(/href="(\/(?:companies|startups|investors)\/?)"/g))assert.ok(urls.includes('https://siliconpeaks.com'+target),target);
  for(const [,asset] of html.matchAll(/(?:src|href)="(\/(?:assets|logos)\/[^"]+)"/g))assert.ok(fs.existsSync(new URL('..'+asset,import.meta.url)),asset);
  assert.ok(!html.includes('{{'));
 }
 assert.ok(gzipSync(read('assets/search-pages.css')).length<5000);
});
