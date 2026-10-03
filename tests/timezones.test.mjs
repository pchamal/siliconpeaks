import test from 'node:test';
import assert from 'node:assert/strict';
import {cities,searchCities,workingOverlap} from '../assets/timezones.mjs';

test('city search covers aliases, accents, countries and supported IANA zones',()=>{
 assert.ok(cities.length>450);
 for(const [query,name] of [['bengaluru','Bangalore'],['katmandu','Kathmandu'],['nyc','New York'],['Sao Paulo','São Paulo'],['ireland','Dublin'],['palo alto','Palo Alto']])assert.ok(searchCities(query).some(c=>c.name===name),query);
 for(const city of cities)assert.doesNotThrow(()=>new Intl.DateTimeFormat('en',{timeZone:city.zone}),city.name);
 assert.deepEqual(searchCities('not-a-real-city-xyz'),[]);
});
test('overlap keeps quarter-hour precision and handles dates with different DST offsets',()=>{
 assert.deepEqual(workingOverlap('Asia/Kolkata','2026-09-28').ranges,[{kathmandu:'09:15–18:00',local:'09:00–17:45'}]);
 assert.equal(workingOverlap('Asia/Kolkata','2026-09-28').minutes,525);
 assert.equal(workingOverlap('Europe/London','2026-01-15').minutes,195);
 assert.equal(workingOverlap('Europe/London','2026-07-15').minutes,255);
 assert.equal(workingOverlap('America/Los_Angeles','2026-09-28').minutes,0);
 assert.equal(workingOverlap('Asia/Kathmandu','2026-09-28').minutes,540);
 assert.equal(workingOverlap('Australia/Adelaide','2026-01-15').minutes,255);
 assert.equal(workingOverlap('Australia/Adelaide','2026-07-15').minutes,315);
 assert.throws(()=>workingOverlap('Europe/London','invalid'),RangeError);
});
