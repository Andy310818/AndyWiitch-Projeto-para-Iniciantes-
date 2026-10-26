(()=>{
const root=document.querySelector('#quiz');if(!root)return;
const start=document.querySelector('#quiz-start'),result=document.querySelector('#quiz-result');
function draw(){
const level=document.querySelector('#quiz-level').value,side=document.querySelector('#quiz-side').value;
const qs=window.GDL_QUIZ.filter(q=>q.nivel===level&&(side==='todos'||q.lado===side));
root.innerHTML=qs.map((q,i)=>`<article class="quiz-card"><span class="section-kicker">${q.lado==='killer'?'KILLER':'SOBREVIVENTE'} · ${level.toUpperCase()} · ${i+1}/${qs.length}</span><h3>${q.pergunta}</h3>${q.opcoes.map((op,j)=>`<label class="quiz-option"><input type="radio" name="decisao${i}" value="${j}"> ${op}</label>`).join('')}<div class="quiz-feedback" id="feedback${i}" hidden></div></article>`).join('')+'<button class="btn btn-primary" id="quiz-check">Conferir decisões →</button>';
result.hidden=true;
document.querySelector('#quiz-check').addEventListener('click',()=>{
let score=0;qs.forEach((q,i)=>{
const chosen=root.querySelector(`input[name="decisao${i}"]:checked`),ok=chosen&&+chosen.value===q.correta;
if(ok)score++;
const feedback=document.querySelector(`#feedback${i}`);feedback.hidden=false;feedback.innerHTML=`<strong>${ok?'✓ Boa decisão!':'↪ Revise esta situação'}</strong><p>${q.explicacao}</p>`;
});result.hidden=false;result.textContent=`Você acertou ${score} de ${qs.length} decisões. Tente outro nível ou lado para continuar aprendendo.`;result.scrollIntoView({behavior:'smooth',block:'nearest'});
});
}
start.addEventListener('click',draw);draw();
})();