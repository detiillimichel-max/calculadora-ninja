let score=0,lives=3,level=1,mode='normal',tab=0,problems=[],run=false,timer;
const sky=document.getElementById('sky'),scoreEl=document.getElementById('score'),livesEl=document.getElementById('lives'),levelEl=document.getElementById('level'),ans=document.getElementById('answer');

function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a}

function newProb(){
  let t,a,b;
  // MODO TABUADA MAIS FÁCIL
  if(mode==='tabuada'){
    a = tab || rnd(1,5); // só até 5 no início
    b = rnd(1,5); // respostas pequenas
    t = `${a} × ${b}`;
    return {t,ans:a*b,x:rnd(10,70),y:-50,s:0.6 + level*0.08}; // bem mais lento
  }
  // MODO NORMAL
  const ops=['+','-','×','÷']; const op=ops[rnd(0,3)];
  if(op==='+'){a=rnd(1,30);b=rnd(1,30);t=`${a}+${b}`;return{t,ans:a+b,x:rnd(5,75),y:-50,s:1+level*0.15}}
  if(op==='-'){a=rnd(10,50);b=rnd(1,a);t=`${a}-${b}`;return{t,ans:a-b,x:rnd(5,75),y:-50,s:1+level*0.15}}
  if(op==='×'){a=rnd(2,9);b=rnd(2,9);t=`${a}×${b}`;return{t,ans:a*b,x:rnd(5,75),y:-50,s:1+level*0.15}}
  b=rnd(2,9);a=b*rnd(2,9);t=`${a}÷${b}`;return{t,ans:a/b,x:rnd(5,75),y:-50,s:1+level*0.15}
}

function spawn(){ if(!run) return; const p=newProb(); const d=document.createElement('div'); d.className='problem'; d.textContent=p.t; d.style.left=p.x+'%'; sky.appendChild(d); p.el=d; problems.push(p); }

function loop(){ if(!run) return; problems.forEach((p,i)=>{ p.y+=p.s; p.el.style.top=p.y+'px'; if(p.y>280) p.el.classList.add('hot'); if(p.y>480){ lose(); problems.splice(i,1); p.el.remove(); } }); requestAnimationFrame(loop); }

function check(){ const v=parseInt(ans.value); if(isNaN(v)) return; const i=problems.findIndex(p=>p.ans===v); if(i>-1){ score+=10*level; scoreEl.textContent=score; if(score>level*100){level++;levelEl.textContent=level} problems[i].el.remove(); problems.splice(i,1); ans.value=''; } else { lose(); ans.value=''; } }

function lose(){ lives--; livesEl.textContent=lives; if(lives<=0){ run=false; alert('Fim! Pontos: '+score); document.getElementById('start').classList.remove('hidden'); } }

function start(m,t=0){
  mode=m; tab=t;
  score=0; level=1;
  lives = (mode==='tabuada')? 5 : 3; // 5 vidas na tabuada
  livesEl.textContent=lives;
  problems.forEach(p=>p.el.remove()); problems=[];
  scoreEl.textContent=0; levelEl.textContent=1;
  run=true; document.getElementById('start').classList.add('hidden');
  clearInterval(timer);
  const speed = (mode==='tabuada')? 2500 : 1800; // mais lento
  timer=setInterval(spawn,speed);
  loop();
}

// CONTROLES
document.getElementById('hit').onclick=check;
document.getElementById('ent').onclick=check;
document.getElementById('clr').onclick=()=>ans.value=ans.value.slice(0,-1);
document.querySelectorAll('.keys button').forEach(b=>{ if(!b.id) b.onclick=()=>ans.value+=b.textContent; });

// BOTÕES INICIAIS - AGORA 1 CLIQUE
document.getElementById('normal').onclick=()=>start('normal');
// TABUADA ABRE DIRETO EM "TODAS" (mais fácil)
document.getElementById('tabuada').onclick=()=>start('tabuada',0);
// se quiser escolher tabuada específica, ainda funciona
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>start('tabuada',parseInt(b.dataset.t)));

// LOJA
document.getElementById('shopBtn').onclick=()=>{ document.getElementById('shopPts').textContent=score; document.getElementById('shop').classList.remove('hidden'); run=false; };
document.getElementById('close').onclick=()=>{ document.getElementById('shop').classList.add('hidden'); run=true; loop(); };
document.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{
  const t=b.dataset.b;
  if(t==='vida'&&score>=100){score-=100;lives++;livesEl.textContent=lives}
  else if(t==='slow'&&score>=50){score-=50;problems.forEach(p=>p.s/=2);setTimeout(()=>problems.forEach(p=>p.s*=2),5000)}
  else if(t==='dica'&&score>=30&&problems[0]){score-=30;ans.value=problems[0].ans}
  else return;
  scoreEl.textContent=score; document.getElementById('shopPts').textContent=score;
});
