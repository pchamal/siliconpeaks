// Heedeo visitor identification, once per page view. Served through /hd on this domain so the
// visitor cookie stays first-party. Failures are silent: the page never depends on it.
import {createHeedeo} from './vendor/heedeo-sdk/browser.js';

// Honour Global Privacy Control and Do Not Track: no identification for those browsers.
const optedOut=navigator.globalPrivacyControl===true||navigator.doNotTrack==='1'||window.doNotTrack==='1';

if(!optedOut){
 const heedeo=createHeedeo({publishableKey:'pk_Kc-ayASPzAyV0DmFee2InQECP6pnkcuJHmX9C52KWFA'});
 heedeo.identify().then(({data})=>{
  if(!data)return;
  return fetch('/hd/visit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({token:data.token}),keepalive:true});
 }).catch(()=>{});
}
