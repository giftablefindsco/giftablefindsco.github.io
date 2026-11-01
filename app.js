(function(){
  var d=document, GF=window.GF||{};
  // Christmas countdown
  var c=d.querySelector('[data-countdown]');
  if(c){var now=new Date(), y=now.getMonth()===11&&now.getDate()>25?now.getFullYear()+1:now.getFullYear();
    var days=Math.ceil((new Date(y,11,25)-now)/864e5);
    c.textContent=days>0?days+' days until Christmas':'Merry Christmas!';}
  // mobile menu
  var mb=d.querySelector('[data-menu]'), nav=d.querySelector('[data-nav]');
  if(mb&&nav){mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'✕':'☰';});}
  // reveal on scroll
  var els=[].slice.call(d.querySelectorAll('.reveal'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    els.forEach(function(e,i){if(!e.style.getPropertyValue('--d'))e.style.setProperty('--d',i%4);io.observe(e);});
  } else els.forEach(function(e){e.classList.add('in');});
  // rotating word
  var r=d.querySelector('[data-rotate]');
  if(r&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    var words=['Dad','Mom','Him','Her','Teens','Coworkers','Everyone'],k=0;
    setInterval(function(){r.className='out';setTimeout(function(){k=(k+1)%words.length;r.textContent=words[k];r.className='in';},330);},2200);
  }
  // budget filters on guide pages
  var chips=[].slice.call(d.querySelectorAll('[data-filter]')), grid=d.querySelector('[data-grid]'), empty=d.querySelector('[data-empty]');
  chips.forEach(function(ch){ch.addEventListener('click',function(){
    chips.forEach(function(x){x.classList.toggle('on',x===ch);});
    var max=+ch.dataset.filter, shown=0;
    [].forEach.call(grid.querySelectorAll('.card'),function(card){var ok=+card.dataset.budget<=max;card.classList.toggle('hide',!ok);if(ok){shown++;card.classList.add('in');}});
    if(empty)empty.hidden=shown>0;
  });});
  // gift finder quiz
  var qc=d.querySelector('.quiz-card'), res=d.querySelector('[data-results]'), sel={};
  function esc(s){return String(s).replace(/[&<>"]/g,function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m];});}
  function card(id,p,i){return '<article class="card" style="--i:'+i+'"><a class="ph" href="'+p.u+'" target="_blank" rel="sponsored noopener"><img src="'+p.i+'" alt="'+esc(p.n)+' (illustration)" width="720" height="720" loading="lazy">'+(i===0?'<span class="badge">★ Best match</span>':'')+'<span class="tier">'+esc(p.t)+'</span></a><div class="body"><h3>'+esc(p.n)+'</h3><p class="who"><span>Best for</span> '+esc(p.w)+'</p><p class="blurb">'+esc(p.d)+'</p><a class="btn" href="'+p.u+'" target="_blank" rel="sponsored noopener">See it on Amazon <span class="arr">→</span></a></div></article>';}
  function show(){
    var who=sel.who, max=+sel.budget, ids=Object.keys(GF).filter(function(id){var p=GF[id];return p.r.indexOf(who)>-1&&p.b<=max;});
    if(!ids.length&&max<50){ids=Object.keys(GF).filter(function(id){return GF[id].r.indexOf(who)>-1;}).sort(function(a,b){return GF[a].b-GF[b].b;}).slice(0,3);}
    var label={him:'him',her:'her',teen:'a teen or student',anyone:'anyone'}[who];
    res.innerHTML='<div class="results-head"><h3>🎉 '+ids.length+' gifts for '+label+' under $'+max+'</h3><button class="link-btn" data-reset>Start over ↺</button></div><div class="grid">'+ids.slice(0,8).map(function(id,i){return card(id,GF[id],i);}).join('')+'</div>';
    res.querySelector('[data-reset]').addEventListener('click',function(){sel={};qc.classList.remove('step2');[].forEach.call(qc.querySelectorAll('.opts button'),function(b){b.classList.remove('on');});res.innerHTML='';qc.scrollIntoView({behavior:'smooth',block:'start'});});
    setTimeout(function(){res.scrollIntoView({behavior:'smooth',block:'start'});},60);
  }
  if(qc){[].forEach.call(qc.querySelectorAll('.opts'),function(g){g.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    [].forEach.call(g.querySelectorAll('button'),function(x){x.classList.toggle('on',x===b);});
    sel[g.dataset.q]=b.dataset.v;
    if(g.dataset.q==='who'){qc.classList.add('step2');}
    if(sel.who&&sel.budget)show();
  });});}
  // sticky CTA appears after scrolling a bit
  var st=d.querySelector('[data-sticky]');
  if(st){var on=false;addEventListener('scroll',function(){var s=scrollY>600&&(innerHeight+scrollY)<d.body.scrollHeight-260;if(s!==on){on=s;st.classList.toggle('show',s);}},{passive:true});}
})();
