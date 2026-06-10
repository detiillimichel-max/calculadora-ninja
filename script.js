let score=0,lives=5,fase=1,mode='tabuada',tab=0,problems=[],run=false,timer,acertosFase=0;
const sky=document.getElementById('sky'),scoreEl=document.getElementById('score'),livesEl=document.getElementById('lives'),faseEl=document.getElementById('fase'),ans=document.getElementById('answer');

function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a}

function getConfig(){
  if(mode==='tabuada'){
    const configs=[
      {max:2, speed:0.35, spawn:3200},
      {max:3, speed:0.45, spawn:3000},
      {max:4, speed:0.55, spawn:2800},
      {max:5, speed:0.65, spawn:2600},
      {max:10,speed:0.8, spawn:2400},
    ];
    return configs[Math.min(fase-1, configs.length-1)];
  } else {
    return {max:12, speed:0.7 + fase*0.1, spawn: Math.max(1500, 2600 - fase*150)};
  }
}

function newProb(){
  const cfg=getConfig();
  let a,b,t;
  if(mode==='tabuada'){
    a = tab || rnd(1, cfg.max);
    b = rnd(1, cfg.max);
    t = `${a} x ${b}`;
    return {t, ans:a*b, x:rnd(10,75), y:-60, s:cfg.speed};
  } else {
    const ops=['+','-','x','/']; const op=ops[rnd(0,3)];
    if(op==='+'){a=rnd(1,20+fase*5);b=rnd(1,20+fase*5);t=`${a}+${b}`;return{t,ans:a+b,x:rnd(5,75),y:-60,s:cfg.speed}}
    if(op==='-'){a=rnd(10,30+fase*5);b=rnd(1,a);t=`${a}-${b}`;return{t,ans:a-b,x:rnd(5,75),y:-60,s:cfg.speed}}
    if(op==='x'){a=rnd(2,6+fase);b=rnd(2,6+fase);t=`${a}x${b}`;return{t,ans:a*b,x:rnd(5,75),y:-60,s:cfg.speed}}
    b=rnd(2,6+fase);a=b*rnd(2,6+fase);t=`${a}/${b}`;return{t,ans:a/b,x:rnd(5,75),y:-60,s:cfg.speed}
  }
}

function spawn(){ if(!run) return; const p=newProb(); const d=document.createElement('div'); d.className='problem'; d.textContent=p.t; d.style.left=p.x+'%'; sky.appendChild(d); p.el=d; problems.push(p); }

function loop(){ if(!run) return; const h = document.getElementById('game').clientHeight; problems.forEach((p,i)=>{ p.y+=p.s; p.el.style.top=p.y+'px'; if(p.y>h*0.6) p.el.classList.add('hot'); if(p.y>h-40){ perderVida(); problems.splice(i,1); p.el.remove(); } }); requestAnimationFrame(loop); }

function check(){ const v=parseInt(ans.value); if(isNaN(v)) return; const i=problems.findIndex(p=>p.ans===v); if(i>-1){ score+=10; acertosFase++; scoreEl.textContent=score; problems[i].el.remove(); problems.splice(i,1); ans.value=''; ans.focus(); if(acertosFase>=8){ passarFase(); } } else { perderVida(); ans.value=''; } }

function perderVida(){ lives--; livesEl.textContent=lives; if(lives<=0){ gameOver(); } else { const msg=document.createElement('div'); msg.textContent='Errou! -1 vida'; msg.style.cssText='position:absolute;top:20%;left:50%;transform:translateX(-50%);background:#ef4444;color:#fff;padding:10px 18px;border-radius:10px;font-weight:700;z-index:60'; document.body.appendChild(msg); setTimeout(()=>msg.remove(),900); }}

function passarFase(){ fase++; faseEl.textContent=fase; acertosFase=0; run=false; clearInterval(timer); problems.forEach(p=>p.el.remove()); problems=[]; const box=document.createElement('div'); box.className='modal'; box.innerHTML=`<div class="box"><h2>Fase ${fase-1} completa!</h2><p>Voce acertou 8 contas!</p><p>Proxima fase fica um pouquinho mais rapida.</p><button onclick="this.parentElement.parentElement.remove(); iniciar()">Continuar</button></div>`; document.body.appendChild(box); }

function gameOver(){ run=false; clearInterval(timer); document.getElementById('overText').textContent=`Voce fez ${score} pontos e chegou na fase ${fase}.`; document.getElementById('over').classList.remove('hidden'); }

function iniciar(){ run=true; const cfg=getConfig(); clearInterval(timer); timer=setInterval(spawn, cfg.spawn); loop(); ans.focus(); }

function start(m,t=0){ mode=m; tab=t; score=0; fase=1; acertosFase=0; lives=5; scoreEl.textContent=0; faseEl.textContent=1; livesEl.textContent=5; problems.forEach(p=>p.el.remove()); problems=[]; document.getElementById('start').classList.add('hidden'); document.getElementById('over').classList.add('hidden'); iniciar(); }

document.getElementById('hit').onclick=check;
document.getElementById('ent').onclick=check;
document.getElementById('clr').onclick=()=>{ans.value=ans.value.slice(0,-1); ans.focus();}
document.querySelectorAll('.keys button').forEach(b=>{ if(!b.id) b.onclick=()=>{ans.value+=b.textContent; ans.focus();} });
ans.addEventListener('keydown', e=>{ if(e.key==='Enter') check(); });

document.getElementById('normal').onclick=()=>start('normal');
document.getElementById('tabuada').onclick=()=>start('tabuada',0);
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>start('tabuada',parseInt(b.dataset.t)));
document.getElementById('modeBtn').onclick=()=>document.getElementById('start').classList.remove('hidden');
document.getElementById('retry').onclick=()=>start(mode,tab);

document.getElementById('shopBtn').onclick=()=>{ document.getElementById('shopPts').textContent=score; document.getElementById('shop').classList.remove('hidden'); run=false; };
document.getElementById('close').onclick=()=>{ document.getElementById('shop').classList.add('hidden'); run=true; loop(); };
document.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{ const t=b.dataset.b; if(t==='vida'&&score>=80){score-=80;lives++;livesEl.textContent=lives} else if(t==='slow'&&score>=40){score-=40;problems.forEach(p=>p.s*=0.5);setTimeout(()=>problems.forEach(p=>p.s*=2),8000)} else if(t==='dica'&&score>=20&&problems[0]){score-=20;ans.value=problems[0].ans} scoreEl.textContent=score; document.getElementById('shopPts').textContent=score; });
