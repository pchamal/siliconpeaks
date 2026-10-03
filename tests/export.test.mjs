import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));

test('public export is crawlable and versioned asset references resolve, including lazy imports',t=>{
 // The exporter regenerates HTML. Keep it away from the working tree while
 // parallel preview tests and the local development server are reading pages.
 const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'siliconpeaks-export-'));
 t.after(()=>fs.rmSync(fixture,{recursive:true,force:true}));
 for(const entry of ['scripts','src','data','assets','logos','llms.txt','humans.txt','robots.txt']){
  fs.cpSync(path.join(root,entry),path.join(fixture,entry),{recursive:true});
 }
 execFileSync(process.execPath,['scripts/build-preview.mjs'],{cwd:fixture});
 const dist=path.join(fixture,'dist'),read=file=>fs.readFileSync(path.join(dist,file),'utf8');
 assert.doesNotMatch(read('robots.txt'),/Disallow:\s*\/\s*$/m);
 const headers=JSON.parse(fs.readFileSync(path.join(root,'deploy/vercel.json'),'utf8')).headers;
 assert.ok(!headers.flatMap(h=>h.headers).some(h=>h.key.toLowerCase()==='x-robots-tag'&&/noindex/.test(h.value)));
 for(const page of ['index.html','companies/index.html','startups/index.html','investors/index.html']){
  const html=read(page);
  const urls=[...html.matchAll(/(?:src|href|poster)="(\/assets\/[^"#]+)"/g)].map(m=>m[1]);
  for(const url of urls){assert.match(url,/^\/assets\/[a-f0-9]{12}\//);assert.ok(fs.existsSync(path.join(dist,url)),url)}
  const social=html.match(/(?:property="og:image" content|content)="(https:\/\/siliconpeaks-snow.vercel.app\/assets\/[^" ]+)"/);
  assert.ok(social,'Social image uses the deployed beta origin');assert.ok(fs.existsSync(path.join(dist,new URL(social[1]).pathname)));
 }
 const version=fs.readdirSync(path.join(dist,'assets'))[0];
 const script=read(`assets/${version}/site.js`);
 assert.ok(script.includes(`/assets/${version}/timezone-calculator.mjs`));
 assert.ok(fs.existsSync(path.join(dist,`assets/${version}/timezones.mjs`)));
 assert.equal((read('index.html').match(/rel="stylesheet"/g)||[]).length,1);
 assert.ok(!fs.existsSync(path.join(dist,'src')));
});
