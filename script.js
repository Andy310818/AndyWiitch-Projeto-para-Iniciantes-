const nav=document.querySelector("nav");const menu=document.querySelector(".menu-toggle");if(menu&&nav){menu.addEventListener("click",()=>nav.classList.toggle("open"))}
const modal=document.querySelector(".modal");const title=document.querySelector("#modal-title");const text=document.querySelector("#modal-text");const link=document.querySelector("#modal-link");
const guidance={
"survivor-gen":["No gerador","Mantenha o progresso enquanto houver segurança. Observe o ambiente e tenha uma rota de saída antes de continuar. Se a situação ficar perigosa, priorize uma fuga planejada em vez de permanecer parado." ,"sobrevivente.html#gens"],
"survivor-chase":["O Killer está vindo","Não corra sem direção. Procure uma estrutura, janela ou pallet e pense na próxima rota antes de ser alcançado.","sobrevivente.html#chase"],
"survivor-hook":["Seu companheiro está no Hook","Antes de resgatar, observe a posição do Killer e o estado do restante da equipe. Um resgate seguro vale mais do que correr diretamente para o Hook.","sobrevivente.html#resgate"],
"killer-chase":["Você está em Chase","Pense em tempo. Se a perseguição está consumindo muito tempo sem progresso, considere mudar de alvo. Se a rota do Survivor está previsível, tente antecipar a próxima decisão.","killer.html#chase"],
"killer-gen":["Os geradores estão avançando","Não tente defender tudo ao mesmo tempo. Procure uma área onde sua presença consiga criar pressão e escolha perseguições que tenham valor para o mapa.","killer.html#pressao"],
"endgame":["O último gerador terminou","A partida mudou de fase. Reavalie rapidamente posições, portas, companheiros e oportunidades de conversão antes de tomar a próxima decisão.","comece-aqui.html"]
};
function openModal(key){if(!modal||!guidance[key])return;const g=guidance[key];title.textContent=g[0];text.textContent=g[1];link.href=g[2];modal.classList.add("show");modal.setAttribute("aria-hidden","false")}
document.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>openModal(b.dataset.open)));
document.querySelector(".modal-close")?.addEventListener("click",()=>{modal.classList.remove("show");modal.setAttribute("aria-hidden","true")});
modal?.addEventListener("click",e=>{if(e.target===modal){modal.classList.remove("show");modal.setAttribute("aria-hidden","true")}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal?.classList.contains("show"))modal.classList.remove("show")});

const search=document.querySelector("#dictionary-search");const terms=[...document.querySelectorAll(".term")];const noResults=document.querySelector("#no-results");search?.addEventListener("input",()=>{const q=search.value.toLowerCase().trim();let visible=0;terms.forEach(t=>{const ok=t.dataset.term.includes(q)||t.textContent.toLowerCase().includes(q);t.style.display=ok?"":"none";if(ok)visible++});if(noResults)noResults.hidden=visible!==0});

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");const f=btn.dataset.filter;document.querySelectorAll(".build-card").forEach(card=>{card.style.display=f==="all"||card.dataset.type.includes(f)?"":"none"})}));



// V6.6: menu acessível, fechamento ao selecionar, tecla Escape e página ativa.
(function(){
 const header=document.querySelector('.site-header');if(!header)return;
 const nav=header.querySelector('nav'),toggle=header.querySelector('.menu-toggle');if(!nav||!toggle)return;
 if(!nav.id)nav.id='menu-da-nevoa';
 toggle.setAttribute('aria-controls',nav.id);toggle.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false');
 const close=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');};
 toggle.addEventListener('click',()=>{toggle.setAttribute('aria-expanded',nav.classList.contains('open')?'true':'false');});
 nav.querySelectorAll('a').forEach(a=>{if(a.classList.contains('active'))a.setAttribute('aria-current','page');a.addEventListener('click',close);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){close();toggle.focus();}});
 document.addEventListener('click',e=>{if(!header.contains(e.target)&&nav.classList.contains('open'))close();});
})();
