import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gzipSync} from 'node:zlib';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const directoryCompanies=category=>JSON.parse(read('data/directory.json')).companies.filter(e=>e.category===category).length;
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
  assert.equal(html.match(/<meta\b(?=[^>]*property="og:url")[^>]*>/)[0].match(/content="([^"]+)"/)[1],url);
  assert.equal(new URL(url).origin,'https://siliconpeaks.com');
  assert.equal(new URL(url).search,'');assert.equal(new URL(url).hash,'');
  assert.ok(!html.includes('search_term_string')&&!html.includes('SearchAction'),url);
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.ok(graph.some(e=>e.url===url&&/Page$/.test(e['@type'])));
  if(route!=='/'){
   const crumbs=graph.find(e=>e['@type']==='BreadcrumbList');assert.equal(crumbs.itemListElement.at(-1).item,url);
   const count=(html.match(/class="entry-arrow"/g)||[]).length,lists=graph.filter(e=>e['@type']==='ItemList');
   if(lists.length){assert.equal(lists.reduce((n,list)=>n+list.numberOfItems,0),count);for(const list of lists)assert.equal(list.itemListElement.length,list.numberOfItems);}
   if(route==='/companies/'){
    const h1=html.match(/<h1>([^<]+)<\/h1>/)[1];
    assert.equal(h1,'IT companies in Nepal');
    assert.equal(title,'IT Companies in Nepal | Silicon Peaks');
    assert.match(description,/IT companies in Nepal/);
    assert.ok(description.includes(directoryCompanies('Technology & business')+' technology'));
    assert.match(html,new RegExp(directoryCompanies('Public companies')+' public companies are listed separately'));
    assert.match(html,/identifies them as having operations in Nepal/);
    const page=graph.find(e=>e['@type']==='CollectionPage');
    assert.equal(page.name,h1);assert.equal(page.mainEntity['@id'],url+'#technology');
    assert.deepEqual(lists.map(e=>e['@id']),[url+'#technology',url+'#listed']);
    assert.equal(lists[0].numberOfItems,directoryCompanies('Technology & business'));
    assert.equal(lists[1].numberOfItems,directoryCompanies('Public companies'));
    assert.ok(lists[1].name.includes('operations in Nepal'));
    assert.match(html,/not a ranking or an endorsement/);
    assert.ok(!/best IT|reviewCount|aggregateRating/i.test(html));
   }
   assert.ok(gzipSync(html).length<20000);assert.ok(!html.includes('/assets/site.js'));
  }
  for(const [,target] of html.matchAll(/href="(\/(?:companies|startups|investors)\/?)"/g))assert.ok(urls.includes('https://siliconpeaks.com'+target),target);
  for(const [,asset] of html.matchAll(/(?:src|href)="(\/(?:assets|logos)\/[^"]+)"/g))assert.ok(fs.existsSync(new URL('..'+asset,import.meta.url)),asset);
  assert.ok(!html.includes('{{'));
 }
 assert.ok(gzipSync(read('assets/search-pages.css')).length<5000);
 assert.deepEqual(urls,['https://siliconpeaks.com/','https://siliconpeaks.com/companies/','https://siliconpeaks.com/startups/','https://siliconpeaks.com/investors/']);
 for(const file of ['src/template.html','robots.txt','sitemap.xml'])assert.ok(!/search_term_string|SearchAction/.test(read(file)),file);
 const wrangler=JSON.parse(read('wrangler.jsonc').replace(/^\s*\/\/.*$/gm,''));
 assert.equal(wrangler.name,'lively-moon-c53b');
 for(const route of ['/hd/*','/','/companies/','/startups/','/investors/'])assert.ok(wrangler.assets.run_worker_first.includes(route),route);
});
