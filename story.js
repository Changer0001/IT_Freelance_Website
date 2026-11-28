/* ============================================================
   THE CALL, AS YOU SCROLL  (story.js, with story.css)
   ============================================================
   The top of the six product pages: the opening lifts like a cover, a phone
   rises from the foot of the screen and holds in the middle of the scene,
   and five steps of one call play on its screen as the visitor scrolls.

   The markup is complete without this file: with no script, or for a
   visitor who has asked for less motion, the section is the headline and
   the five steps as a list (story.css, first part). This file adds
   .is-live to the section and takes over from there.

   A page with data-film on the section plays the footage (198 frames at
   12 a second, four shots, in that folder). A page without it shows its
   own picture, held still.
   ============================================================ */
(function(){
  var story=document.querySelector('.story');
  if(!story||!story.querySelector('#st-film').getContext)return;
  // Less motion asked for: leave the page as the plain section it already is.
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  story.classList.add('is-live');document.documentElement.classList.add('st-go','st-ready');
  // a page that asks for it (data-open="slow": the home page and every trade's) opens slowly
  var SLOW=story.dataset.open==='slow';if(SLOW)story.classList.add('st-slow');

  // Each of the five steps plays a run of frames. `x`,`y` say where the
  // subject sits in the frame (0 to 1); `side` is which side of the phone to
  // stand them on. `cut` marks a step whose next step is a different shot.
  // `pose` is how the phone is turned at that step: around its upright, its
  // level, and flat.
  // `call` marks the steps during which the call is on: that is when the voice is heard.
  //
  // Two ways the story ends, so two ways the film is cut (data-flow on the section):
  //   "booked"  the visit is booked on the call, and nobody calls back: the caller stays on
  //             screen through steps two to four, and the last shot is the owner's phone.
  //             The film's fourth shot, a man making a call, is left out: it was the call back.
  //   (none)    a request the owner confirms afterwards (a restaurant): all four shots.
  var FLOWS={
    booked:[
      {from:1,  to:36, x:.72,y:.3, side:1, cut:true,            pose:[-5,2,-1]},
      {from:37, to:60, x:.47,y:.4, side:-1,          call:true, pose:[5,1.5,.9]},
      {from:61, to:84, x:.47,y:.4, side:-1,          call:true, pose:[-4,1.5,-.7]},
      {from:85, to:108,x:.47,y:.4, side:-1,cut:true, call:true, pose:[4,1.5,.8]},
      {from:109,to:156,x:.72,y:.66,side:1,                      pose:[0,0,0]}],
    request:[
      {from:1,  to:36, x:.72,y:.3, side:1, cut:true,            pose:[-5,2,-1]},
      {from:37, to:72, x:.47,y:.4, side:-1,          call:true, pose:[5,1.5,.9]},
      {from:73, to:108,x:.47,y:.4, side:-1,cut:true, call:true, pose:[-4,1.5,-.7]},
      {from:109,to:156,x:.72,y:.66,side:1, cut:true,            pose:[4,1.5,.8]},
      {from:157,to:198,x:.42,y:.36,side:-1,                     pose:[0,0,0]}]};
  var STEPS=FLOWS[story.dataset.flow]||FLOWS.request;
  var FILM=story.dataset.film||'',TOTAL=FILM?STEPS[STEPS.length-1].to:0,N=STEPS.length;
  var SHOT=.24;    // how much of a step's end the next shot takes to dissolve in
  var WORDS=.13;   // how much of a step its words take to arrive, and to leave
  var SCREEN=.2;   // how much of a step's end the phone's next screen takes to dissolve in
  var LEAD=.3;     // the phone's top reaches the foot of the screen when this much of the scene has been uncovered
  var TURN=.34;    // how much of a step's end the phone takes to turn to its next pose
  var RUN=2.5;     // how many screens of scrolling the five steps take
  function $(id){return document.getElementById(id)}
  var stage=$('st-stage'),film=stage.querySelector('.st-film'),cv=$('st-film'),cx=cv.getContext('2d'),panel=story.querySelector('.st-panel');
  var copyBox=$('st-copy'),copy=[].slice.call(copyBox.children),views=[].slice.call(story.querySelectorAll('.st-view'));
  var rig=$('st-rig'),handset=$('st-handset'),glass=$('st-glass');
  var shine=$('st-shine'),rim=$('st-rim'),waves=$('st-waves'),pivot=$('st-pivot');
  var vc=$('st-voice'),vx=vc.getContext('2d'),tv=0,then=0,calling=0;
  var bar=$('st-load'),line=$('st-line'),cta=$('st-cta'),skip=$('st-skip'),lift=$('st-lift'),floor=$('st-floor'),mark=$('how'),header=$('site-header');
  // The voice is four lines laid over each other, each its own length, speed and height:
  // k is how tight the wave is, w how fast it runs, a how tall, t how thick, g how much it glows.
  var LINES=[{k:.021,w:5.2,a:1,p:0,t:2.3,g:16,c:'rgba(236,244,255,.95)'},{k:.030,w:6.6,a:.7,p:1.9,t:1.5,g:11,c:'rgba(150,196,255,.8)'},{k:.015,w:3.8,a:.55,p:3.7,t:1.3,g:9,c:'rgba(92,152,255,.72)'},{k:.043,w:8.3,a:.33,p:.8,t:1,g:6,c:'rgba(255,255,255,.55)'}];
  // the parts of each screen that arrive, or leave, part-way through its step
  var parts=views.map(function(v){return [].slice.call(v.querySelectorAll('[data-at],[data-until]')).map(function(el){return {el:el,at:el.dataset.at?+el.dataset.at:-1,until:el.dataset.until?+el.dataset.until:2}})});
  var clocks=views.map(function(v){return [].slice.call(v.querySelectorAll('[data-clock]')).map(function(el){var n=el.dataset.clock.split(',');return {el:el,a:+n[0],b:+n[1]}})});
  // the phone's pose from the scroll; where the mouse is; and four springs that follow it
  var pose={rx:0,ry:0,rz:0},ptr={x:0,y:0,on:false,over:false},sp={tx:0,ty:0,sc:1,gl:0},sp2=0,vel={tx:0,ty:0,sc:0,gl:0},alive=0;
  // H is the scene's height; lead is how far the page has scrolled when the phone gets home
  var img=[],ready=0,last='',goal=0,now=0,running=false,begun=false,arrived=false,home={x:0,y:0},H=1,lead=1,seam=300,box={l:0,r:0,w:1,cx:0,cy:0,pw:1},zoom=1.3;
  var vis={t:0,h:0};

  // each screen gets the phone's status row and its home bar
  views.forEach(function(v){
    var st=$('st-status').content.firstElementChild.cloneNode(true);
    st.querySelector('b').textContent=v.dataset.time;v.insertBefore(st,v.firstChild);
    var h=document.createElement('div');h.className='st-home';v.appendChild(h);
  });

  function got(im){im.ok=true;ready++;bar.style.width=(ready/TOTAL*100)+'%';if(ready===TOTAL)bar.style.opacity=0;last='';wake()}
  if(!FILM){film.classList.add('st-film--still');bar.style.display='none'}
  for(var n=1;n<=TOTAL;n++)(function(n){
    var im=new Image();if(n>36)im.fetchPriority='low';im.src=FILM+('00'+n).slice(-3)+'.webp';img[n]=im;
    // decoded ahead of time, so the first time a frame is drawn costs nothing
    if(im.decode)im.decode().then(function(){got(im)},function(){im.onload=function(){got(im)};if(im.complete&&im.naturalWidth)got(im)});
    else im.onload=function(){got(im)};
  })(n);

  function ease(t){t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)}

  // Where everything goes. The words are measured first; the phone takes
  // the height that is left; the scene and the page's length follow from the phone.
  function layout(){
    var W=stage.clientWidth,small=W<=860,hh=header?header.offsetHeight:0;H=stage.clientHeight;
    // `vt`..`vt+vh` is the part of the scene that can be seen. On a desktop that is all of it. On a
    // phone whose browser bars are showing it is less (the window is shorter than the scene), and
    // inside a preview frame taller than its window it is only the part of the frame in view.
    var vt=0,vh=Math.min(H,Math.max(240,innerHeight));
    if(vis.h>240&&vis.h<H-2){vt=Math.max(0,Math.min(vis.t,H-240));vh=Math.max(240,Math.min(vh,vis.t+vis.h)-vt)}
    // the page's bar lies over the top of the scene, so the words start under it
    var vb=H-vt-vh,under0=vt>4?44:hh,top=under0+(small?22:20),gap=small?20:28;
    story.style.setProperty('--vt',vt.toFixed(1)+'px');story.style.setProperty('--vb',vb.toFixed(1)+'px');story.style.setProperty('--st-top',(under0+(small?8:14))+'px');
    var tall=0;copy.forEach(function(c){tall=Math.max(tall,c.firstElementChild.offsetHeight)});
    // The phone floats in the middle of the scene, all of it in view, with clear room under it:
    // it touches no edge. It is as tall as the room under the words allows, less that margin,
    // but no wider than suits the screen. The words and the phone are centred together.
    var under=Math.max(36,vh*.085),widest=small?W*.8:Math.min(W*.34,430),ph=Math.min(vh-top-tall-gap-under,widest*57/27);
    ph=Math.max(Math.min(300,vh*.5),ph);var em=ph/57,pw=27*em,free=Math.max(0,vh-tall-gap-ph);
    var above=Math.max(top,Math.min(free/2,free-under)),wordsTop=vt+above,phoneTop=wordsTop+tall+gap,foot=phoneTop+ph;
    rig.style.fontSize=em.toFixed(3)+'px';
    home={x:(W-pw)/2,y:phoneTop};rig.style.left=home.x.toFixed(1)+'px';rig.style.top=home.y.toFixed(1)+'px';
    // The cover's solid part is one screen tall, or as tall as the opening's words need. The
    // phone's layer starts far enough down the story to arrive `LEAD` of a screen after the cover
    // begins to lift; then the five steps take `RUN` screens.
    var C=panel.offsetHeight;lead=C+H*LEAD-home.y;
    lift.style.height=H+'px';lift.style.marginTop=(lead-H).toFixed(1)+'px';
    story.style.height=(lead+H*(RUN+1)).toFixed(1)+'px';
    // "How it works" in the menu lands on the first step (script.js lands a target so many pixels under the bar)
    if(mark)mark.style.top=(lead+H*RUN*.03+hh+(matchMedia('(max-width: 860px)').matches?32:68)).toFixed(1)+'px';
    copyBox.style.top=wordsTop.toFixed(1)+'px';copyBox.style.height=tall+'px';
    stage.style.setProperty('--st-shade',(phoneTop+ph*.16).toFixed(1)+'px');
    // the people in the footage stand level with the upper part of the phone
    seam=phoneTop+(foot-phoneTop)*.42;
    box={l:(W-pw)/2,r:(W+pw)/2,w:W,cx:W/2,cy:phoneTop+(foot-phoneTop)*.4,pw:pw};zoom=small?1:1.3;
    var d=Math.min(1.5,devicePixelRatio||1);cv.width=Math.round(cv.clientWidth*d);cv.height=Math.round(cv.clientHeight*d);
    vc.width=Math.round(W*d);vc.height=Math.round(H*d);
    last='';wake();
  }
  // the nearest frame that has arrived, so a slow connection shows a still, never a gap
  function near(n){for(var k=0;k<TOTAL;k++){if(img[n-k]&&img[n-k].ok)return img[n-k];if(img[n+k]&&img[n+k].ok)return img[n+k]}return null}
  function paint(im,s,a){
    if(!im||a<=0)return;var W=cv.width,h0=cv.height,z=Math.max(W/im.naturalWidth,h0/im.naturalHeight)*zoom,w=im.naturalWidth*z,h=im.naturalHeight*z;
    // the subject stands in the middle of the open space on their side of the phone
    var mid=(s.side<0?box.l/2:(box.r+box.w)/2)/box.w;
    var dx=Math.min(0,Math.max(W-w,W*mid-w*s.x)),dy=Math.min(0,Math.max(h0-h,seam*(W/box.w)-h*s.y));
    cx.globalAlpha=a;cx.drawImage(im,dx,dy,w,h);cx.globalAlpha=1;
  }
  // one shot at a moment between two frames: the earlier frame, with the later one laid over it
  function shot(s,f,a){
    var pos=s.from+f*(s.to-s.from),lo=Math.floor(pos),hi=Math.min(s.to,lo+1),t=pos-lo;
    if(a>=1){paint(near(lo),s,1);paint(near(hi),s,t)}
    else{paint(near(t<.5?lo:hi),s,a)}
  }
  // Where the visitor is, in pixels scrolled since the story reached the top of the screen.
  function read(){
    var r=story.getBoundingClientRect();
    // the page's bar is dark for as long as the story is under it
    if(header)header.classList.toggle('st-over',r.bottom>header.offsetHeight/2);
    goal=Math.max(-H,Math.min(r.height-H,-r.top));
    if(!begun){begun=true;now=goal}
  }
  function draw(y){
    var span=story.offsetHeight-H;
    // How far the phone has come: 0 while it is still under the foot of the screen, 1 when it is
    // home. The browser moves it; this only tells the words when to arrive.
    var e=Math.max(0,Math.min(1,1-(lead-y)/(H-home.y)));arrived=e>=.999;
    var whole=Math.max(0,Math.min(1,(y-lead)/(span-lead))),q=y<lead?-1:whole;
    floor.style.opacity=ease((e-.45)/.5).toFixed(3);
    skip.style.opacity=(ease((e-.8)/.2)*(1-ease((whole-.9)/.08))).toFixed(3);skip.style.pointerEvents=e>.9&&whole<.94?'auto':'none';
    var p=Math.min(.99999,whole)*N,i=Math.floor(p),f=p-i,s=STEPS[i],nx=STEPS[i+1];
    if(FILM){
      var mix=s.cut&&nx?ease((f-(1-SHOT))/SHOT):0;
      var key=p.toFixed(4)+'|'+e.toFixed(4)+'|'+cv.width+'x'+cv.height+'|'+ready;
      // the first shot is already running, slowly, while the phone comes up
      if(key!==last){last=key;shot(s,i===0?e*.3+f*.7:f,1);if(mix>0)shot(nx,0,mix)}
    }else{
      // no film on this page: its picture comes closer by a hair as the story goes
      film.style.transform='scale('+(1+(e*.2+whole*.8)*.07).toFixed(4)+')';
    }
    // the phone's screen: the next one dissolves in over the end of this step
    var turn=nx?ease((f-(1-SCREEN))/SCREEN):0;
    for(var k=0;k<N;k++){views[k].style.opacity=k===i?1:(k===i+1?turn:0);views[k].style.zIndex=k===i+1?2:(k===i?1:0);
      views[k].style.pointerEvents=(k===i&&turn<.5)||(k===i+1&&turn>=.5)?'auto':'none'}
    // each screen fills in as its step is scrolled; the one arriving shows as it will at its start
    fill(i,f);if(nx)fill(i+1,0);
    // the call is on during steps two and three: that is when the voice is heard
    calling=q<0?0:(s.call?1:(i===0?ease((f-.5)/.4)*.55:0));
    // the phone turns from this step's pose to the next, and drifts a little while it waits
    var t=nx?ease((f-(1-TURN))/TURN):0,a=s.pose,b=nx?nx.pose:a,sway=Math.sin(p*Math.PI*2)*.8;
    pose.ry=a[0]+(b[0]-a[0])*t+sway;pose.rx=a[1]+(b[1]-a[1])*t;pose.rz=a[2]+(b[2]-a[2])*t;apply();
    // the words: in over the start of a step, out over its end, eased
    for(k=0;k<N;k++){
      var o=0,dy=0;
      if(k===i){var c=i===0?ease((e-.72)/.28):ease(f/WORDS),g=i===N-1?1:ease((1-f)/WORDS);o=Math.min(c,g);dy=f<.5?(1-c)*16:-(1-g)*16}
      copy[k].style.opacity=o;copy[k].style.transform='translate3d(0,'+dy.toFixed(2)+'px,0)';
      copy[k].classList.toggle('is-on',o>.5);
    }
    line.style.width=(whole*100)+'%';
  }
  function fill(k,f){
    // a call's clock runs as its step is scrolled: data-clock="3,21" is the seconds at its start and end
    clocks[k].forEach(function(c){var s=Math.round(c.a+(c.b-c.a)*Math.max(0,Math.min(1,f)));c.el.textContent=Math.floor(s/60)+':'+('0'+s%60).slice(-2)});
    parts[k].forEach(function(q){
      var o=(q.at<0?1:ease((f-q.at)/.13))*(1-ease((f-q.until)/.1));
      q.el.style.opacity=o.toFixed(3);q.el.style.translate='0 '+((1-o)*(q.until<2&&f>q.until?-.9:.9)).toFixed(3)+'em';
    });
  }
  // The voice. From each side of the phone a line runs outward: tall beside the phone and
  // dying away with distance, as sound does, and swelling and falling the way speech does.
  function voice(dt){
    var W=vc.width,h0=vc.height;vx.clearRect(0,0,W,h0);
    // The voice's lines start at the phone's sides. So nothing is drawn until the phone is in its
    // place (a finger on it while it rises must not light them up where it is not yet), nor on a
    // screen too narrow to have room beside the phone, where they would be two stubs.
    if(sp2<.004||!arrived||(box.w-box.pw)/2<110)return;
    tv+=dt;
    var d=W/box.w,mx=box.cx*d,my=box.cy*d,start=box.pw*.42*d,reach=W*.3,A=Math.min(h0*.085,78*d)*sp2;
    var talk=.42+.58*Math.abs(Math.sin(tv*2.3)*Math.sin(tv*1.07+.8))+.12*Math.sin(tv*7.3);
    // the lines fade as the voice dies away, so a line gone flat is never left on the scene
    vx.globalCompositeOperation='lighter';vx.lineCap='round';vx.lineJoin='round';vx.globalAlpha=Math.min(1,sp2*3);
    for(var n=0;n<LINES.length;n++){var l=LINES[n];
      for(var side=-1;side<=1;side+=2){
        vx.beginPath();
        for(var r=start,first=true;r<W;r+=3*d){
          var x=mx+side*r;if(x<-12||x>W+12)break;
          var u=r-start,env=Math.exp(-Math.pow(u/reach,1.25))*Math.min(1,u/(46*d));
          var ph=l.k*r/d-l.w*tv+l.p+(side<0?1.3:0);
          var y=my+A*l.a*talk*env*(Math.sin(ph)+.38*Math.sin(2.31*ph+1.7)+.2*Math.sin(.47*ph+.6));
          if(first){vx.moveTo(x,y);first=false}else vx.lineTo(x,y);
        }
        var g=vx.createLinearGradient(mx+side*start,0,mx+side*(start+reach*1.7),0);g.addColorStop(0,l.c);g.addColorStop(1,'rgba(120,170,255,0)');
        vx.strokeStyle=g;vx.lineWidth=l.t*d;vx.shadowColor='rgba(90,150,255,.9)';vx.shadowBlur=l.g*d;vx.stroke();
      }
    }
    vx.globalCompositeOperation='source-over';vx.shadowBlur=0;vx.globalAlpha=1;
  }
  // the phone as it stands: the scroll's pose, leaned toward the mouse, swollen by the touch
  function apply(){
    var ry=pose.ry+sp.tx,rx=pose.rx+sp.ty;
    pivot.style.transform='scale('+sp.sc.toFixed(4)+') rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) rotateZ('+pose.rz.toFixed(2)+'deg)';
    // the light across the glass moves the other way to the turn, as a reflection does
    glass.style.transform='translate3d('+(-ry*.9).toFixed(2)+'%,0,0)';glass.style.opacity=(.7+Math.abs(ry)*.03).toFixed(3);
    shine.style.opacity=Math.max(0,Math.min(1,sp.gl)).toFixed(3);rim.style.opacity=Math.max(0,Math.min(1,sp.gl*.9)).toFixed(3);
  }
  // Springs, a little under-damped, so the phone overshoots and settles: that is the bounce.
  function springs(){
    var want={tx:ptr.on?ptr.x*(ptr.over?12:6):0,ty:ptr.on?-ptr.y*(ptr.over?9:4):0,sc:ptr.over?1.05:1,gl:ptr.over?1:0},moving=false;
    for(var k in want){vel[k]=(vel[k]+(want[k]-sp[k])*.13)*.8;sp[k]+=vel[k];if(Math.abs(vel[k])>.0004||Math.abs(want[k]-sp[k])>.0006)moving=true}
    // the voice rises quickly and dies away slowly; a touch brings it to full
    var loud=arrived?Math.max(calling*.5,ptr.over?1:0):0;sp2+=(loud-sp2)*(loud>sp2?.1:(arrived?.04:.5));
    return moving||sp2>.004;
  }
  // the mark of a touch: one ring from the phone's edge
  function wave(){
    if(alive>3)return;
    var d=document.createElement('i');alive++;
    d.addEventListener('animationend',function(){alive--;d.remove()});waves.appendChild(d);
  }
  function touch(e,down){
    var r=handset.getBoundingClientRect(),x=e.clientX,y=e.clientY;
    var over=x>r.left&&x<r.right&&y>r.top&&y<r.bottom;
    ptr.on=true;ptr.x=Math.max(-1,Math.min(1,(x-(r.left+r.width/2))/(r.width*1.6)));ptr.y=Math.max(-1,Math.min(1,(y-(r.top+r.height/2))/(r.height*1.1)));
    if(over){
      shine.style.setProperty('--gx',((x-r.left)/r.width*100).toFixed(1)+'%');shine.style.setProperty('--gy',((y-r.top)/r.height*100).toFixed(1)+'%');
      if(!ptr.over||down){vel.sc+=down?.022:.012;wave()}
    }
    ptr.over=over;wake();
  }
  function away(){ptr.on=ptr.over=false;wake()}
  story.addEventListener('pointermove',function(e){touch(e,false)});
  story.addEventListener('pointerdown',function(e){touch(e,true)});
  story.addEventListener('pointerleave',away);
  // a finger has no hover: when it lifts, the phone lets go
  story.addEventListener('pointerup',function(e){if(e.pointerType!=='mouse')away()});
  story.addEventListener('pointercancel',away);

  // The page glides toward where the scroll is, a little each frame, so a
  // mouse wheel's jumps become one continuous movement. The same loop runs
  // the springs, and stops when the scroll and the springs have both settled.
  function tick(t){
    var d=goal-now,gliding=Math.abs(d)>=.4,dt=then?Math.min(.05,(t-then)/1000):.016;then=t;
    now=gliding?now+d*.14:goal;
    var live=springs();draw(now);voice(dt);
    // the voice only keeps the page working while the story is on screen
    var r=story.getBoundingClientRect(),seen=r.bottom>0&&r.top<innerHeight;
    if(gliding||(live&&seen))requestAnimationFrame(tick);else{running=false;then=0}
  }
  function wake(){read();if(!running){running=true;requestAnimationFrame(tick)}}
  // Which part of the screen can be seen. A page inside a frame cannot ask how far the page around
  // it has scrolled, but the browser will say how much of each strip is in view; together the
  // strips give the top and bottom of the visible part, and the layout follows it. On the site
  // itself every strip is always in view, and this changes nothing.
  (function look(){
    if(!('IntersectionObserver' in window))return;
    var M=24,seen=[],due=false,steps=[];for(var k=0;k<=12;k++)steps.push(k/12);
    var io=new IntersectionObserver(function(list){
      list.forEach(function(en){seen[en.target._n]=en.isIntersecting&&en.intersectionRect.height>0?[en.intersectionRect.top,en.intersectionRect.bottom]:null});
      var t=1e9,b=-1e9;seen.forEach(function(r){if(r){t=Math.min(t,r[0]);b=Math.max(b,r[1])}});
      if(b<=t)return;
      if(Math.abs(t-vis.t)<2.5&&Math.abs(b-t-vis.h)<2.5)return;
      vis={t:t,h:b-t};if(!due){due=true;requestAnimationFrame(function(){due=false;layout()})}
    },{threshold:steps});
    for(var n=0;n<M;n++){var s=document.createElement('div');s.className='st-eye';s._n=n;s.style.top=(n*100/M)+'%';s.style.height=(100/M)+'%';document.body.appendChild(s);io.observe(s)}
  })();
  addEventListener('scroll',wake,{passive:true});addEventListener('resize',layout);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(layout);
  // on a touch screen there is no hover: the first tap opens the number, the second dials
  cta.addEventListener('click',function(e){if(!cta.classList.contains('open')&&matchMedia('(hover: none)').matches){e.preventDefault();cta.classList.add('open')}});
  // "Skip the story" lands the next section under the page's bar
  skip.addEventListener('click',function(){scrollTo({top:Math.round(story.getBoundingClientRect().bottom+scrollY-(header?header.offsetHeight:0)),behavior:'smooth'})});
  // The headline, one element to a letter, so each can come out of the dark in its own time
  // (the times are scattered, not left to right) and light up by itself. Words stay whole, so a
  // line never breaks inside one; a reader of the page still gets the sentence.
  (function(){
    var h=$('hero-title');if(!h||!SLOW)return;
    var text=h.textContent.trim(),n=0;
    h.setAttribute('aria-label',text);h.textContent='';
    text.split(' ').forEach(function(w,k,all){
      var word=document.createElement('span');word.className='st-word';word.setAttribute('aria-hidden','true');
      w.split('').forEach(function(c){var s=document.createElement('span');s.className='st-ch';s.style.setProperty('--d',((n++*37)%13*70)+'ms');s.textContent=c;word.appendChild(s)});
      h.appendChild(word);if(k<all.length-1)h.appendChild(document.createTextNode(' '));
    });
  })();
  layout();
})();
