import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildSearchPages,searchTopics} from './search-pages.mjs';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=JSON.parse(read('data/directory.json'));
const companies=data.companies;
const schema=JSON.stringify({'@context':'https://schema.org','@graph':[
 {'@type':'WebSite','@id':'https://siliconpeaks.com/#website',name:'Silicon Peaks',url:'https://siliconpeaks.com/',inLanguage:'en',creator:{'@id':'https://siliconpeaks.com/#pukar-hamal'},contributor:[{'@id':'https://siliconpeaks.com/#jonathan-clarke'},{'@id':'https://siliconpeaks.com/#aarjan-chaudhary'}]},
 {'@type':'Person','@id':'https://siliconpeaks.com/#pukar-hamal',name:'Pukar Hamal',url:'https://pukarhamal.com/',description:'Founder and CEO of SecurityPal; coined and named Silicon Peaks.',sameAs:['https://github.com/pchamal']},
 {'@type':'Person','@id':'https://siliconpeaks.com/#jonathan-clarke',name:'Jonathan Clarke',url:'https://www.jonathanclarke.ie/',sameAs:['https://github.com/jonathanclarke']},
 {'@type':'Person','@id':'https://siliconpeaks.com/#aarjan-chaudhary',name:'Aarjan Chaudhary',url:'https://arjanchaudharyy.lol/',sameAs:['https://github.com/arjanchaudharyy']},
 {'@type':'CollectionPage','@id':'https://siliconpeaks.com/#webpage',url:'https://siliconpeaks.com/',name:'Silicon Peaks | Nepal Startup & Technology Ecosystem',description:'Explore Nepal’s startup ecosystem: IT companies, Nepali founders, venture capital firms and universities. An open community directory from Silicon Peaks.',inLanguage:'en',isPartOf:{'@id':'https://siliconpeaks.com/#website'},mainEntity:{'@id':'https://siliconpeaks.com/#companies'},hasPart:searchTopics.map(t=>({'@type':'WebPage',url:'https://siliconpeaks.com/'+t.slug+'/',name:t.title}))},
 {'@type':'ItemList','@id':'https://siliconpeaks.com/#companies',name:'Silicon Peaks company directory',numberOfItems:companies.length,itemListElement:companies.map((e,i)=>({'@type':'ListItem',position:i+1,name:e.name,url:e.url}))}
 ]}).replaceAll('<','\\u003c');
let html=read('src/template.html');
html=html.replace('{{SCHEMA}}',schema);
if(/\{\{[A-Z_]+\}\}/.test(html))throw Error('Unresolved template placeholder');
fs.writeFileSync(path.join(root,'index.html'),html);
buildSearchPages(root,data,html.match(/<nav aria-label="Main navigation"[^>]*>[\s\S]*?<\/nav>/)[0]);
const overview=read('llms.txt');
fs.writeFileSync(path.join(root,'lms.txt'),overview);
fs.writeFileSync(path.join(root,'llms-full.txt'),overview+'\n## Full community directory\n\n'+Object.entries(data).filter(([k])=>k!=='press').map(([k,entries])=>'### '+k+'\n\n'+entries.map(e=>`- [${e.name}](${e.url})`).join('\n')).join('\n\n')+'\n');
fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['',...searchTopics.map(t=>t.slug+'/')].map(route=>'<url><loc>https://siliconpeaks.com/'+route+'</loc></url>').join('')+'</urlset>\n');
console.log('Built Silicon Peaks with the complete directory and current editorial sections.');
