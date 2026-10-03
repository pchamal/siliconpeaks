// IANA zones come from the browser. Curated aliases cover cities that share a zone.
const groups = [
 ['Asia/Kathmandu','Nepal','Kathmandu|Katmandu, KTM','Pokhara','Lalitpur|Patan','Biratnagar','Chitwan|Bharatpur','Butwal','Dharan','Janakpur','Bhaktapur','Hetauda','Dhangadhi','Nepalgunj','Itahari','Damak'],
 ['Asia/Kolkata','India','Bangalore|Bengaluru','New Delhi|Delhi','Mumbai|Bombay','Hyderabad','Chennai|Madras','Pune','Kolkata|Calcutta','Ahmedabad','Gurugram|Gurgaon','Noida','Kochi|Cochin'],
 ['America/New_York','United States','New York|NYC','Boston','Washington, DC|Washington DC','Miami','Atlanta','Philadelphia','Detroit'],
 ['America/Los_Angeles','United States','San Francisco|SF, Bay Area','Los Angeles|LA','Seattle','San Jose','San Diego','Portland','Las Vegas','Mountain View','Palo Alto','Cupertino','Sunnyvale','Redwood City','Oakland'],
 ['America/Chicago','United States','Chicago','Austin','Dallas','Houston','Minneapolis','Nashville'],
 ['America/Denver','United States','Denver','Salt Lake City'],
 ['America/Phoenix','United States','Phoenix'], ['Pacific/Honolulu','United States','Honolulu'],
 ['America/Toronto','Canada','Toronto','Montreal|Montréal','Ottawa','Waterloo'],
 ['America/Vancouver','Canada','Vancouver'], ['America/Edmonton','Canada','Calgary','Edmonton'],
 ['Europe/London','United Kingdom','London','Manchester','Edinburgh','Birmingham','Cambridge','Oxford','Bristol','Leeds','Liverpool','Sheffield','Glasgow','Belfast'],
 ['Europe/Dublin','Ireland','Dublin','Cork'], ['Europe/Berlin','Germany','Berlin','Munich|München','Frankfurt','Hamburg'],
 ['Europe/Paris','France','Paris','Lyon'], ['Europe/Amsterdam','Netherlands','Amsterdam','Rotterdam'],
 ['Europe/Zurich','Switzerland','Zurich|Zürich','Geneva'], ['Europe/Madrid','Spain','Madrid','Barcelona'],
 ['Europe/Lisbon','Portugal','Lisbon','Porto'], ['Europe/Rome','Italy','Rome','Milan'],
 ['Europe/Stockholm','Sweden','Stockholm'], ['Europe/Oslo','Norway','Oslo'], ['Europe/Copenhagen','Denmark','Copenhagen'],
 ['Europe/Helsinki','Finland','Helsinki'], ['Europe/Tallinn','Estonia','Tallinn'], ['Europe/Warsaw','Poland','Warsaw','Krakow|Kraków'],
 ['Europe/Prague','Czechia','Prague'], ['Europe/Vienna','Austria','Vienna'], ['Europe/Athens','Greece','Athens'],
 ['Europe/Istanbul','Türkiye','Istanbul|Turkey'], ['Asia/Dubai','United Arab Emirates','Dubai|UAE','Abu Dhabi'],
 ['Asia/Qatar','Qatar','Doha'], ['Asia/Riyadh','Saudi Arabia','Riyadh','Jeddah'], ['Asia/Muscat','Oman','Muscat'],
 ['Asia/Singapore','Singapore','Singapore'], ['Asia/Kuala_Lumpur','Malaysia','Kuala Lumpur|KL'],
 ['Asia/Bangkok','Thailand','Bangkok'], ['Asia/Ho_Chi_Minh','Vietnam','Ho Chi Minh City|Saigon','Hanoi'],
 ['Asia/Jakarta','Indonesia','Jakarta'], ['Asia/Makassar','Indonesia','Bali|Denpasar'], ['Asia/Manila','Philippines','Manila','Cebu'],
 ['Asia/Shanghai','China','Shanghai','Beijing|Peking','Shenzhen','Guangzhou','Hangzhou'], ['Asia/Hong_Kong','Hong Kong','Hong Kong'],
 ['Asia/Taipei','Taiwan','Taipei'], ['Asia/Tokyo','Japan','Tokyo','Osaka','Kyoto'], ['Asia/Seoul','South Korea','Seoul','Busan'],
 ['Asia/Dhaka','Bangladesh','Dhaka'], ['Asia/Karachi','Pakistan','Karachi','Lahore','Islamabad'], ['Asia/Colombo','Sri Lanka','Colombo'],
 ['Australia/Sydney','Australia','Sydney','Canberra'], ['Australia/Melbourne','Australia','Melbourne'],
 ['Australia/Brisbane','Australia','Brisbane','Gold Coast'], ['Australia/Perth','Australia','Perth'], ['Australia/Adelaide','Australia','Adelaide'],
 ['Pacific/Auckland','New Zealand','Auckland','Wellington'], ['Africa/Cairo','Egypt','Cairo'],
 ['Africa/Nairobi','Kenya','Nairobi'], ['Africa/Lagos','Nigeria','Lagos','Abuja'],
 ['Africa/Johannesburg','South Africa','Johannesburg','Cape Town'], ['Africa/Accra','Ghana','Accra'],
 ['Africa/Kigali','Rwanda','Kigali'], ['America/Sao_Paulo','Brazil','São Paulo|Sao Paulo','Rio de Janeiro'],
 ['America/Mexico_City','Mexico','Mexico City'], ['America/Argentina/Buenos_Aires','Argentina','Buenos Aires'],
 ['America/Bogota','Colombia','Bogotá|Bogota'], ['America/Lima','Peru','Lima'], ['America/Santiago','Chile','Santiago']
];
export const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[_/,]+/g,' ').replace(/\s+/g,' ').trim();
const curated = groups.flatMap(([zone,country,...names])=>names.map(value=>{const [name,aliases='']=value.split('|');return {name,country,zone,aliases};}));
const seen = new Set(curated.map(c=>normalize(c.name)));
const system = (Intl.supportedValuesOf?.('timeZone') || []).flatMap(zone=>{
 const name=zone.split('/').at(-1).replaceAll('_',' ');
 if(seen.has(normalize(name)) || ['Calcutta','Katmandu','Saigon','Kiev','Uzhgorod','Zaporozhye','Godthab','Truk','Ponape','Enderbury'].includes(name))return [];
 seen.add(normalize(name));return [{name,zone,country:zone.split('/')[0],aliases:''}];
});
export const cities = [...curated,...system].map((c,id)=>({...c,id,search:normalize(`${c.name} ${c.country} ${c.aliases} ${c.zone}`)})).sort((a,b)=>a.name.localeCompare(b.name));
export function searchCities(query){
 const q=normalize(query), words=q.split(' ');
 return cities.filter(c=>words.every(w=>c.search.includes(w))).sort((a,b)=>Number(normalize(b.name).startsWith(q))-Number(normalize(a.name).startsWith(q)) || a.name.localeCompare(b.name));
}
const clock = minutes => `${String(Math.floor(minutes/60)%24).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
export function workingOverlap(zone,day){
 const start=Date.parse(day+'T00:00:00Z')-345*60000;
 if(!Number.isFinite(start))throw new RangeError('Choose a valid date.');
 const formatter=new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
 const local=m=>{const parts=formatter.formatToParts(new Date(start+m*60000));return Number(parts.find(p=>p.type==='hour').value)*60+Number(parts.find(p=>p.type==='minute').value)};
 const slots=Array.from({length:96},(_,i)=>{const m=i*15,l=local(m);return l>=540&&l<1080 ? (m>=540&&m<1080 ? 2:1):0});
 const shared=[];
 slots.forEach((value,i)=>{if(value!==2)return;const last=shared.at(-1);if(last&&last.end===i*15)last.end+=15;else shared.push({start:i*15,end:(i+1)*15})});
 const minutes=shared.reduce((sum,s)=>sum+s.end-s.start,0);
 const hours=minutes?`${Math.floor(minutes/60)}h${minutes%60?' '+minutes%60+'m':''}`:'No';
 return {slots,minutes,label:hours+' shared',ranges:shared.map(s=>({kathmandu:`${clock(s.start)}–${clock(s.end)}`,local:`${clock(local(s.start))}–${clock(local(s.end))}`})),offset:new Intl.DateTimeFormat('en',{timeZone:zone,timeZoneName:'shortOffset'}).formatToParts(new Date(start+720*60000)).find(p=>p.type==='timeZoneName').value};
}
