import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gzipSync} from 'node:zlib';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html');
const baseline=JSON.parse(read('data/preservation.json'));
const directory=JSON.parse(read('data/directory.json'));
const normalize=s=>s.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#39;|&apos;/g,"'").replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const text=normalize(html);
test('current directory entries, airlines and clocks render completely',()=>{
 for(const [selector,count] of Object.entries(baseline).filter(([k])=>k.startsWith('.')&&k!=='.press-card')){
  const actual=[...html.matchAll(/\bclass="([^"]+)"/g)].filter(m=>m[1].split(/\s+/).includes(selector.slice(1))).length;
  const expected=selector==='.co-card'?directory.companies.length+1:selector==='.inv-name'?directory.investors.length:count;
  assert.equal(actual,expected,selector); // Company grid includes one "and more" card.
 }
 // Published records must remain available after requested directory corrections.
 for(const group of ['companies','investors','press'])for(const item of directory[group])assert.ok(html.includes(item.url.replaceAll('&','&amp;')),item.url);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.ok(!html.includes('{{'));
});
test('original sections keep their order and community contact links remain',()=>{
 const sections=[...html.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(sections,baseline.sections.filter(id=>!['relief','final-cta'].includes(id)));
 assert.ok(!/relief|zeffy|campaign-update/i.test(html));
 // The founder requested shorter copy. Original essays remain in the preservation
 // fixture for provenance; the current contract preserves structure and useful links.
 for(const url of ['https://discord.gg/Z7y3ZhvNCC','mailto:scale@siliconpeaks.com','mailto:contribute@siliconpeaks.com','https://github.com/pchamal/siliconpeaks'])assert.ok(html.includes(url),url);
 assert.ok(!html.includes('/cdn-cgi/'));
});
test('every internal anchor, image, stylesheet and CSS logo resolves locally',()=>{
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,'duplicate IDs');
 for(const m of html.matchAll(/href="#([^"]+)"/g))assert.ok(ids.includes(m[1]),m[1]);
 const assetPaths=[...html.matchAll(/(?:src|href)="((?:\/?assets|\/?logos)\/[^"#]+)"/g)].map(m=>m[1]);
 for(const m of html.matchAll(/url\(['"]?(\/logos\/[^)'"\s]+)/g))assetPaths.push(m[1]);
 for(const p of assetPaths)assert.ok(fs.existsSync(new URL('../'+p.replace(/^\//,''),import.meta.url)),p);
 assert.ok(!/src="https?:/.test(html),'third-party runtime asset');
 assert.ok(!html.includes("url('logos/"),'relative inline mask URLs resolve against external CSS');
});
test('SEO credits, licensing and sourced capital context are consistent',()=>{
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 const people=schema['@graph'].filter(e=>e['@type']==='Person');
 for(const name of ['Pukar Hamal','Jonathan Clarke','Aarjan Chaudhary']){
  assert.ok(people.some(e=>e.name===name));
  for(const f of ['llms.txt','llms-full.txt','lms.txt','humans.txt'])assert.ok(read(f).includes(name),f);
 }
 assert.equal(schema['@graph'].find(e=>e['@type']==='ItemList').numberOfItems,directory.companies.length);
 for(const term of ['$24M','Entrepreneurs First','Together Fund portfolio','Frank Schulenburg','Rdevany'])assert.ok(text.includes(term),term);
 assert.ok(html.includes('creativecommons.org/licenses/by-sa/4.0/'));
 assert.ok(html.includes('creativecommons.org/licenses/by-sa/3.0/'));
 assert.ok(html.includes('/assets/logos/mit-wordmark.png'));
 assert.ok(html.includes('/assets/logos/alibaba-group.png'));
 assert.ok(html.includes('/assets/logos/y-combinator.svg'));
});
test('the static page stays within practical transfer budgets',()=>{
 assert.ok(gzipSync(html).length<40000);
 assert.ok(gzipSync(read('assets/site.js')).length<10240);
 assert.ok(gzipSync(read('assets/site.js')).length+gzipSync(read('assets/navigation.js')).length<11264,'combined homepage scripts');
 assert.ok(gzipSync(read('assets/site.css')+read('assets/original-layout.css')+read('assets/snow.css')).length<29000);
 for(const file of ['silicon-peaks-story.mp4'])assert.ok(fs.statSync(new URL('../assets/media/'+file,import.meta.url)).size<1200000);
 assert.ok(html.includes('data-theme="snow"'));
 const video=html.match(/<video\b[^>]*>/)[0];
 for(const attribute of ['muted','loop','playsinline'])assert.match(video,new RegExp('\\s'+attribute+'(?:[\\s=>])'));
 assert.match(video,/\bpreload="none"/);
 for(const file of ['llms.txt','llms-full.txt','lms.txt'])assert.ok(!/relief|zeffy/i.test(read(file)));
 assert.ok(!/googletagmanager|google-analytics|connect.facebook/.test(html));
});
