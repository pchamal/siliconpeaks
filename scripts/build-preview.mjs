import './build.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

// Export only public assets. The upstream Cloudflare configuration is unchanged.
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const output=path.join(root,'dist');
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});
for(const file of ['index.html','companies','startups','investors','assets','logos','robots.txt','sitemap.xml','llms.txt','llms-full.txt','lms.txt','humans.txt']){
 fs.cpSync(path.join(root,file),path.join(output,file),{recursive:true});
}
// One compressed stylesheet removes four render-blocking round trips.
const styles=['fonts.css','original-layout.css','site.css','snow.css','timezone.css'];
fs.writeFileSync(path.join(output,'assets','home.css'),styles.map(file=>fs.readFileSync(path.join(root,'assets',file),'utf8')).join('\n'));
const homepage=path.join(output,'index.html');
let page=fs.readFileSync(homepage,'utf8');
for(const [index,file] of styles.entries())page=page.replace(`<link href="/assets/${file}" rel="stylesheet"/>`,index===0?'<link href="/assets/home.css" rel="stylesheet"/>':'');
fs.writeFileSync(homepage,page);
// Version asset URLs so a year-long cache cannot serve old styles or scripts.
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name)).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const hash=createHash('sha256');
for(const file of walk(path.join(output,'assets')))hash.update(path.relative(output,file)).update(fs.readFileSync(file));
const version=hash.digest('hex').slice(0,12);
const staging=path.join(output,'versioned-assets');
fs.renameSync(path.join(output,'assets'),staging);
fs.mkdirSync(path.join(output,'assets'));
fs.renameSync(staging,path.join(output,'assets',version));
for(const file of walk(output))if(/\.(html|css|js|mjs)$/.test(file)){
 const text=fs.readFileSync(file,'utf8').replaceAll('https://siliconpeaks.com/assets/','https://siliconpeaks-snow.vercel.app/assets/').replaceAll('/assets/','/assets/'+version+'/');
 fs.writeFileSync(file,text);
}
console.log('Built the public Vercel beta with versioned assets:',version);
