/* ============================================================
   THE OPENING ON THE SMALL PAGES  (opening.js, with story.css)
   ============================================================
   The product pages open on a dark screen with the headline coming out of
   a glow, letter by letter (story.js). This gives the other pages the same
   opening, without the phone story: the page's own headline is lifted into
   a dark block under the page's bar, and arrives the same way.

   data-open on <html> says how tall the block is:
     "screen"  a whole first screen, with the scroll hint (a page that sells)
     "band"    about half a screen, so the page's text starts on the first
               screen (pages people come to read: policies, billing, 404)

   The page is complete without this file. With no script, or for a visitor
   who has asked for less motion, nothing here runs and the headline stays
   where it was written.
   ============================================================ */
(function(){
  var root=document.documentElement,main=document.querySelector('main'),h=main&&main.querySelector('h1');
  function show(){root.classList.remove('st-wait')}
  if(!h||matchMedia('(prefers-reduced-motion: reduce)').matches){show();return}
  var header=document.getElementById('site-header'),band=root.getAttribute('data-open')!=='screen';
  var open=document.createElement('div');open.className='st-open'+(band?' st-open--band':'');
  main.parentNode.insertBefore(open,main);open.appendChild(h);
  if(!band){var hint=document.createElement('div');hint.className='st-hint';hint.setAttribute('aria-hidden','true');hint.innerHTML='Scroll<i></i>';open.appendChild(hint)}
  // The headline, one element to a letter, each arriving in its own time (story.css, .st-ch).
  // Words stay whole, so a line never breaks inside one; a reader of the page still gets the sentence.
  var text=h.textContent.trim(),n=0;
  h.setAttribute('aria-label',text);h.textContent='';
  text.split(' ').forEach(function(w,k,all){
    var word=document.createElement('span');word.className='st-word';word.setAttribute('aria-hidden','true');
    w.split('').forEach(function(c){var s=document.createElement('span');s.className='st-ch';s.style.setProperty('--d',((n++*37)%13*70)+'ms');s.textContent=c;word.appendChild(s)});
    h.appendChild(word);if(k<all.length-1)h.appendChild(document.createTextNode(' '));
  });
  // the page's bar is dark for as long as the opening is under it
  function over(){if(header)header.classList.toggle('st-over',open.getBoundingClientRect().bottom>header.offsetHeight/2)}
  addEventListener('scroll',over,{passive:true});addEventListener('resize',over);over();
  show();
})();
