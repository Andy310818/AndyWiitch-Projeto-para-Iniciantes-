(()=>{
const root=document.querySelector('#perk-library-grid');if(!root)return;
const side=document.querySelector('#perk-side'),search=document.querySelector('#perk-search'),cat=document.querySelector('#perk-category');
const slots=document.querySelector('#build-slots'),status=document.querySelector('#build-status');
let perks=[...window.GDL_PERKS],chosen={survivor:[],killer:[]};
try{const saved=JSON.parse(localStorage.getItem('gdl-builds-v1'));if(saved&&Array.isArray(saved.survivor)&&Array.isArray(saved.killer))chosen=saved}catch(e){}
try{const stored=JSON.parse(localStorage.getItem('gdl-perks-import-v2'));if(Array.isArray(stored)&&stored.length<=500)perks=stored}catch(e){}
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key=p=>p.nome.toLocaleLowerCase('pt-BR');
const save=()=>{try{localStorage.setItem('gdl-builds-v1',JSON.stringify(chosen))}catch(e){}};
function renderSlots(){
const list=chosen[side.value];slots.innerHTML=Array.from({length:4},(_,i)=>{
const perk=perks.find(p=>p.lado===side.value&&key(p)===list[i]);
return `<div class="build-slot ${perk?'filled':''}"><span class="build-slot-num">0${i+1}</span>${perk?`${perk.icone?`<img src="${esc(perk.icone)}" alt="">`:`<span class="perk-placeholder">${esc(perk.nome.slice(0,2).toUpperCase())}</span>`}<div><strong>${esc(perk.nome)}</strong><small>${esc(perk.categoria)}</small></div><button type="button" class="build-remove" data-remove="${i}" aria-label="Remover ${esc(perk.nome)}">×</button>`:'<span class="build-empty">Escolha uma vantagem ↓</span>'}</div>`}).join('');
slots.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{chosen[side.value].splice(+b.dataset.remove,1);save();render()}));
status.textContent=`${list.length}/4 vantagens selecionadas para ${side.value==='killer'?'Killer':'Sobrevivente'}.`;
}
function render(){
const list=perks.filter(p=>p.lado===side.value),categories=[...new Set(list.map(p=>p.categoria))].sort();
const old=cat.value;cat.innerHTML='<option value="all">Todas</option>'+categories.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');cat.value=categories.includes(old)?old:'all';
const q=search.value.trim().toLocaleLowerCase('pt-BR');
const matches=list.filter(p=>(cat.value==='all'||p.categoria===cat.value)&&[p.nome,p.categoria,p.origem,p.descricao].join(' ').toLocaleLowerCase('pt-BR').includes(q));
root.innerHTML=matches.map(p=>{const selected=chosen[side.value].includes(key(p));return `<article class="perk-library-card"><div class="perk-pick-heading">${p.icone?`<img src="${esc(p.icone)}" alt="Ícone de ${esc(p.nome)}" loading="lazy">`:`<span class="perk-placeholder">${esc(p.nome.slice(0,2).toUpperCase())}</span>`}<div class="perk-library-name"><strong>${esc(p.nome)}</strong><small>${esc(p.categoria)} · ${esc(p.origem)}</small></div></div><div class="perk-library-info"><p>${esc(p.descricao)}</p><button type="button" class="btn perk-add ${selected?'selected':''}" data-name="${esc(key(p))}">${selected?'✓ Remover da build':'+ Adicionar à build'}</button></div></article>`}).join('')||'<p>Nenhuma vantagem encontrada.</p>';
root.querySelectorAll('[data-name]').forEach(b=>b.addEventListener('click',()=>{
const name=b.dataset.name,list=chosen[side.value];if(list.includes(name)){list.splice(list.indexOf(name),1)}else if(list.length<4){list.push(name)}else{status.textContent='Sua build já tem 4 vantagens. Remova uma antes de adicionar outra.';return}save();render();
}));renderSlots();
}
side.addEventListener('change',()=>{cat.value='all';render()});search.addEventListener('input',render);cat.addEventListener('change',render);
document.querySelector('#build-clear').addEventListener('click',()=>{chosen[side.value]=[];save();render()});
document.querySelector('#build-copy').addEventListener('click',async()=>{const names=chosen[side.value].map(n=>perks.find(p=>p.lado===side.value&&key(p)===n)?.nome||n);if(!names.length){status.textContent='Selecione ao menos uma vantagem para copiar.';return}const txt=`Guia da Loucura — ${side.value==='killer'?'Killer':'Sobrevivente'}\n${names.map((n,i)=>`${i+1}. ${n}`).join('\n')}`;try{await navigator.clipboard.writeText(txt);status.textContent='Build copiada!'}catch(e){status.textContent='Não foi possível copiar automaticamente. '+names.join(' • ')}});
document.querySelector('#perk-import-file').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;const msg=document.querySelector('#perk-import-status');try{const data=JSON.parse(await f.text());if(!Array.isArray(data)||data.length>1000||!data.every(p=>p&&['survivor','killer'].includes(p.lado)&&typeof p.nome==='string'&&p.nome.length<120&&typeof p.descricao==='string'))throw Error('Formato inválido. Use uma lista JSON com lado, nome e descricao.');const safe=data.map(p=>({lado:p.lado,nome:p.nome,descricao:p.descricao.slice(0,1200),origem:String(p.origem||'Não informado'),categoria:String(p.categoria||'Outras'),icone:typeof p.icone==='string'&&/^[a-zA-Z0-9_./-]+\.(png|webp|jpg|jpeg)$/.test(p.icone)&&!p.icone.includes('..')?p.icone:''}));const map=new Map([...perks,...safe].map(p=>[p.lado+':'+key(p),p]));perks=[...map.values()];try{localStorage.setItem('gdl-perks-import-v2',JSON.stringify(perks))}catch(e){};msg.textContent=`Catálogo carregado nesta sessão: ${perks.length} vantagens. Selecione e monte sua build.`;render()}catch(err){msg.textContent='Não foi possível importar: '+err.message}});
document.querySelector('#perk-export-template').addEventListener('click',()=>{
const sample=[{lado:'survivor',nome:'Nome da vantagem',origem:'Personagem de origem',categoria:'Informação',descricao:'Descrição conferida na fonte, em português.',icone:''}];
const blob=new Blob([JSON.stringify(sample,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='modelo-vantagens-guia-da-loucura.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
document.querySelector('#perk-reset-catalog').addEventListener('click',()=>{if(!confirm('Restaurar as 20 vantagens iniciais? O catálogo importado será descartado deste navegador.'))return;localStorage.removeItem('gdl-perks-import-v2');perks=[...window.GDL_PERKS];document.querySelector('#perk-import-status').textContent='Catálogo inicial restaurado.';render()});
render();
})();