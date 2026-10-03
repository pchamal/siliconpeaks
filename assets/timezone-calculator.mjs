import {cities,searchCities,normalize,workingOverlap} from './timezones.mjs';

export function initCalculator(){
 const input=document.getElementById('tz-input'), list=document.getElementById('tz-results'), feedback=document.getElementById('tz-feedback');
 const date=document.getElementById('tz-date'), grid=document.getElementById('tz-grid');
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kathmandu',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 date.value=today;
 let selected=['Bangalore','London'].map(name=>cities.find(c=>c.name===name)), matches=[],active=-1;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function close(){list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');active=-1;}
 function suggestions(){
  const all=searchCities(input.value).filter(c=>c.name!=='Kathmandu'&&!selected.some(s=>s.id===c.id));
  matches=all.slice(0,8);active=-1;
  list.innerHTML=matches.map((c,i)=>`<div class="tz-result" id="tz-result-${i}" role="option" aria-selected="false" data-index="${i}"><span><strong>${esc(c.name)}</strong><small>${esc(c.country)} · ${esc(c.zone.replaceAll('_',' '))}</small></span><span aria-hidden="true">+</span></div>`).join('') || '<p class="tz-no-results">No matching city. Try a nearby city or a country.</p>';
  list.hidden=false;input.setAttribute('aria-expanded','true');input.removeAttribute('aria-activedescendant');
  feedback.textContent=all.length>8?`${all.length} matches. Type more to narrow your search.`:all.length?`${all.length} ${all.length===1?'city':'cities'} found.`:'No cities found, or already added.';
 }
 function highlight(index){
  if(!matches.length)return;
  active=(index+matches.length)%matches.length;
  list.querySelectorAll('[role="option"]').forEach((el,i)=>el.setAttribute('aria-selected',String(i===active)));
  const el=list.children[active];input.setAttribute('aria-activedescendant',el.id);el.scrollIntoView({block:'nearest'});
 }
 function add(city){
  if(!city)return;
  selected.push(city);input.value='';close();render();feedback.textContent=`${city.name} added. ${selected.length} cities compared with Kathmandu.`;input.focus();
 }
 function row(city,home=false){
  const data=workingOverlap(city.zone,date.value), colors=['#e8eef4','#799ab8','#277460'];
  const stops=data.slots.map((s,i)=>`${colors[home&&s===2?1:s]} ${i/96*100}% ${(i+1)/96*100}%`).join(',');
  const summary=home?'09:00–18:00 working hours':data.ranges.length?data.ranges.map(r=>`${r.kathmandu} Kathmandu · ${r.local} local`).join('; '):'No shared hours within the 09:00–18:00 workday.';
  return `<article class="tz-compare-row${home?' tz-home-row':''}"><div class="tz-city-heading"><div><h3>${esc(city.name)}</h3><p>${esc(city.country)} · ${esc(data.offset)}</p></div>${home?'<span class="tz-home-label">Home base</span>':`<div class="tz-row-actions"><span class="tz-shared${data.minutes?'':' tz-none'}">${data.label}</span><button type="button" class="tz-remove" data-remove="${city.id}" aria-label="Remove ${esc(city.name)}">×</button></div>`}</div><div class="tz-timeline" style="background:linear-gradient(to right,${stops})" role="img" aria-label="${esc(city.name+': '+summary)}"></div><p class="tz-overlap-detail">${esc(summary)}</p></article>`;
 }
 function render(){
  if(!date.value||!date.validity.valid){feedback.textContent='Choose a valid date to compare working hours.';return;}
  grid.innerHTML=row({name:'Kathmandu',country:'Nepal',zone:'Asia/Kathmandu'},true)+selected.map(c=>row(c)).join('');
 }
 input.addEventListener('input',suggestions);
 input.addEventListener('focus',()=>{if(input.value)suggestions()});
 input.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!list.hidden){e.preventDefault();e.stopPropagation();close();return;}
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(list.hidden)suggestions();highlight(active<0?(e.key==='ArrowDown'?0:matches.length-1):active+(e.key==='ArrowDown'?1:-1));}
  if(e.key==='Enter'){e.preventDefault();const exact=matches.find(c=>normalize(c.name)===normalize(input.value));if(active>=0)add(matches[active]);else if(exact||matches.length===1)add(exact||matches[0]);else {suggestions();feedback.textContent='Choose a city from the results using the arrow keys or a tap.';}}
 });
 list.addEventListener('pointerdown',e=>e.preventDefault());
 list.addEventListener('click',e=>{const option=e.target.closest('[data-index]');if(option)add(matches[Number(option.dataset.index)])});
 input.addEventListener('blur',close);
 grid.addEventListener('click',e=>{const button=e.target.closest('[data-remove]');if(!button)return;const city=selected.find(c=>c.id===Number(button.dataset.remove));selected=selected.filter(c=>c!==city);render();feedback.textContent=`${city.name} removed.`;input.focus()});
 date.addEventListener('change',()=>{render();feedback.textContent='Working hours updated for '+date.value+'.'});
 document.getElementById('tz-today').addEventListener('click',()=>{date.value=today;render()});
 document.getElementById('tz-city-count').textContent=`Search ${cities.length}+ cities by name, country or timezone.`;
 render();feedback.textContent='';if(input.value)suggestions();
}
