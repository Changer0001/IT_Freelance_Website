/* ============================================================
   THE FILM BEHIND THE SMALL PAGES  (film.js, with story.css)
   ============================================================
   The product pages tell one call as the visitor scrolls, over a film
   (story.js). The other pages have no story to tell, but the same film
   plays behind them as they are scrolled: it fills the window behind the
   page, the page's own headline stands over it at the top, and the text
   lies on a solid panel in front of it.

   The film moves only with the scroll: the whole of it (198 frames, four
   shots, img/story/) goes by in two and a half screens of scrolling, then
   starts again. One shot dissolves into the next.

   data-film on <html> says what stands over the film at the top:
     "band"  the page's headline, lifted into a band of its own
     "hero"  the page's own top section, as it is written

   The page is complete without this file. With no script, or for a visitor
   who has asked for less motion, nothing here runs.
   ============================================================ */
(function(){
  var root=document.documentElement,me=document.currentScript,main=document.querySelector('main');
  function show(){root.classList.remove('st-wait')}
  var cv=document.createElement('canvas');
  if(!main||!cv.getContext||matchMedia('(prefers-reduced-motion: reduce)').matches){show();return}
  var cx=cv.getContext('2d'),header=document.getElementById('site-header');
  var back=document.createElement('div');back.className='st-back';back.setAttribute('aria-hidden','true');back.appendChild(cv);
  document.body.insertBefore(back,document.body.firstChild);
  // what stands over the film at the top of the page
  var top=main.querySelector('.hero'),h=main.querySelector('h1');
  if(root.getAttribute('data-film')!=='hero'&&h){
    top=document.createElement('div');top.className='st-open';main.parentNode.insertBefore(top,main);top.appendChild(h);
  }
  root.classList.add('st-filmed');show();

  var SHOTS=[[1,36],[37,108],[109,156],[157,198]],TOTAL=198,RUN=2.5,MIX=7;   // MIX: the frames a shot takes to dissolve into the next
  var dir=(me&&me.src?me.src.replace(/[^\/]*$/,''):'')+'img/story/',img=[],last='',goal=0,now=0,running=false;
  function got(im){im.ok=true;last='';wake()}
  // the first shot at once; the rest when the page itself has loaded
  function load(a,b){for(var n=a;n<=b;n++)(function(n){var im=new Image();if(n>36)im.fetchPriority='low';im.onload=function(){got(im)};im.src=dir+('00'+n).slice(-3)+'.webp';img[n]=im})(n)}
  load(1,36);
  if(document.readyState==='complete')load(37,TOTAL);else addEventListener('load',function(){load(37,TOTAL)});
  function ease(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)}
  function near(n){for(var k=0;k<TOTAL;k++){if(img[n-k]&&img[n-k].ok)return img[n-k];if(img[n+k]&&img[n+k].ok)return img[n+k]}return null}
  function paint(im,a){
    if(!im||a<=0)return;var W=cv.width,H=cv.height,z=Math.max(W/im.naturalWidth,H/im.naturalHeight)*1.04,w=im.naturalWidth*z,h=im.naturalHeight*z;
    cx.globalAlpha=a;cx.drawImage(im,(W-w)/2,(H-h)*.35,w,h);cx.globalAlpha=1;
  }
  function size(){var d=Math.min(1.5,devicePixelRatio||1);cv.width=Math.round(innerWidth*d);cv.height=Math.round(innerHeight*d);last='';wake()}
  function draw(y){
    var p=y/(innerHeight*RUN);p-=Math.floor(p);
    var pos=1+p*TOTAL,lo=Math.min(TOTAL,Math.floor(pos)),t=pos-lo,k=0;while(lo>SHOTS[k][1])k++;
    var end=SHOTS[k][1],hi=Math.min(end,lo+1),next=SHOTS[(k+1)%SHOTS.length][0],mix=ease((pos-(end+1-MIX))/MIX);
    var key=pos.toFixed(2)+'|'+cv.width+'x'+cv.height;if(key===last)return;last=key;
    // this shot, a frame laid over the one before it; and over its end, the first of the next shot
    paint(near(lo),1);if(hi>lo)paint(near(hi),t);if(mix>0)paint(near(next),mix);
  }
  // the page glides toward where the scroll is, so a mouse wheel's jumps become one movement
  function tick(){var d=goal-now,gliding=Math.abs(d)>=.4;now=gliding?now+d*.14:goal;draw(now);if(gliding)requestAnimationFrame(tick);else running=false}
  function wake(){
    goal=scrollY;
    // the page's bar is dark for as long as the top of the page is under it
    if(header&&top)header.classList.toggle('st-over',top.getBoundingClientRect().bottom>header.offsetHeight/2);
    if(!running){running=true;requestAnimationFrame(tick)}
  }
  addEventListener('scroll',wake,{passive:true});addEventListener('resize',size);
  now=scrollY;size();
})();
