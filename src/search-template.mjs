// Google once crawled https://siliconpeaks.com/?q={search_term_string} because a
// SearchAction urlTemplate was published as if it were a real address. The token
// is not a search. Strip it so the request collapses onto the canonical path.
const TOKEN='{search_term_string}';

function containsTemplate(value){
 let current=String(value);
 for(let i=0;i<3;i++){
  if(current.toLowerCase().includes(TOKEN))return true;
  let next;
  try{next=decodeURIComponent(current.replace(/\+/g,' '))}catch{return false}
  if(next===current)return false;
  current=next;
 }
 return current.toLowerCase().includes(TOKEN);
}

// Absolute URL with the template query removed, or null when this request is not that leak.
export function searchTemplateTarget(requestUrl){
 const url=new URL(requestUrl);
 if(!url.search||!containsTemplate(url.search))return null;
 url.search='';
 url.hash='';
 return url.toString();
}
