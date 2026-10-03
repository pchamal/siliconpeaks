// Reserve the measured navigation height without a synchronous layout read.
const measuredNav=document.getElementById('nav');
if(measuredNav&&window.ResizeObserver)new ResizeObserver(([entry])=>{
 const height=(entry.borderBoxSize?.[0]?.blockSize??entry.contentRect.height)+16;
 const value=height+'px';
 if(document.documentElement.style.getPropertyValue('--chrome-h')===value)return;
 document.documentElement.style.setProperty('--chrome-h',value);
 document.querySelector('.peaks-sticky')?.style.setProperty('--chrome-h',value);
}).observe(measuredNav);

// Mobile / tablet nav — real collapse, keep menu state accessible.
(function(){
  const nav=document.getElementById('nav');
  const toggle=document.getElementById('nav-toggle');
  const panel=document.getElementById('nav-panel');
  if(!nav||!toggle||!panel)return;
  function setOpen(open){
    nav.classList.toggle('nav-open',open);
    toggle.setAttribute('aria-expanded',open?'true':'false');
    toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
  }
  toggle.addEventListener('click',()=>setOpen(!nav.classList.contains('nav-open')));
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  window.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
})();
// Reveal the navigation when scrolling up, at the top, or during keyboard use.
(function(){
 const nav=document.getElementById('nav');let previous=0,distance=0,frame=0;
 function reveal(){nav.classList.remove('nav-hidden');}
 nav.addEventListener('focusin',reveal);
 nav.addEventListener('click',()=>{if(nav.classList.contains('nav-open'))reveal();});
 addEventListener('scroll',()=>{
  if(frame)return;
  frame=requestAnimationFrame(()=>{
   frame=0;const y=Math.max(0,scrollY),delta=y-previous;previous=y;
   if(y<100||nav.classList.contains('nav-open')||nav.querySelector(':focus-visible')){distance=0;reveal();return;}
   if(Math.sign(delta)!==Math.sign(distance))distance=0;
   distance+=delta;
   if(Math.abs(distance)>12){nav.classList.toggle('nav-hidden',distance>0);distance=0;}
  });
 },{passive:true});
})();
