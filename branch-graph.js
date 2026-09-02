(()=>{
const mode=document.getElementById('branchMode'),canvas=mode?.querySelector('.branchCanvas'),siblings=mode?.querySelector('.siblings'),children=mode?.querySelector('.children');if(!mode||!canvas)return;
const NS='http://www.w3.org/2000/svg';
const css=document.createElement('style');css.textContent=`
.branchMode{background:radial-gradient(circle at 50% 48%,#fff 0,#f6f4ee 54%,#ecebe4 100%)!important}
.branchMode .branchSvg{display:none!important}
.branchLiveGraph{position:absolute;inset:0;width:100%;height:100%;z-index:1;overflow:visible;pointer-events:none}
.branchLiveGraph path{fill:none;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.branchLiveGraph .rootLine{stroke:#111713;stroke-width:6}.branchLiveGraph .midLine{stroke:#007a3d;stroke-width:4}.branchLiveGraph .newLine{stroke:#ce1126;stroke-width:2.8}
.branchLiveGraph circle{fill:#fff;vector-effect:non-scaling-stroke;stroke-width:2.5}.branchLiveGraph .rootDot{stroke:#111713}.branchLiveGraph .midDot{stroke:#007a3d}.branchLiveGraph .newDot{stroke:#ce1126}
.branchMode .slot,.branchMode .addDynamic{z-index:3}
.branchMode .siblings{left:0!important;right:0!important;top:54%!important;height:0!important;display:block!important;pointer-events:none}
.branchMode .siblings .slot{position:absolute!important;top:0!important;transform:translate(-50%,-50%)!important;pointer-events:auto;transition:left .7s cubic-bezier(.16,.85,.2,1),opacity .45s,transform .45s}
.branchMode .addSibling{left:10%!important;top:54%!important}
@media(max-width:700px){.branchMode .addSibling{left:7%!important}.branchMode .siblings .slot{width:115px!important}}
`;document.head.appendChild(css);
const svg=document.createElementNS(NS,'svg');svg.setAttribute('class','branchLiveGraph');svg.setAttribute('aria-hidden','true');canvas.prepend(svg);
function cleanLabels(){mode.querySelectorAll('.siblings .slot small').forEach(x=>{if(/^herman[oa](?:\s*\d+)?$/i.test(x.textContent.trim()))x.textContent='Hermano'});mode.querySelectorAll('.children .slot small').forEach(x=>{if(/^hij[oa](?:\s*\d+)?$/i.test(x.textContent.trim()))x.textContent='Hijo'})}
function layoutSiblings(){if(!siblings)return;const slots=[...siblings.querySelectorAll('.slot')],gap=155;slots.forEach((s,i)=>{const step=Math.floor(i/2)+1,dir=i%2===0?-1:1;s.style.left=`calc(50% + ${dir*step*gap}px)`})}
function point(el){if(!el)return null;const cr=canvas.getBoundingClientRect(),r=el.getBoundingClientRect(),sx=canvas.offsetWidth/cr.width,sy=canvas.offsetHeight/cr.height;return{x:(r.left+r.width/2-cr.left)*sx,y:(r.top+r.height/2-cr.top)*sy}}
function makePath(a,b,cls,key,animate){if(!a||!b)return;const p=document.createElementNS(NS,'path'),bend=Math.max(28,Math.abs(b.y-a.y)*.42);p.setAttribute('d',`M ${a.x} ${a.y} C ${a.x} ${a.y-bend}, ${b.x} ${b.y+bend}, ${b.x} ${b.y}`);p.setAttribute('class',cls);p.dataset.key=key;svg.appendChild(p);if(animate){let len=300;try{len=p.getTotalLength()}catch(_){}p.style.strokeDasharray=len;p.style.strokeDashoffset=len;p.animate([{strokeDashoffset:len},{strokeDashoffset:0}],{duration:850,easing:'cubic-bezier(.16,.85,.2,1)',fill:'forwards'}).onfinish=()=>{p.style.strokeDasharray='none';p.style.strokeDashoffset='0'}}}
function dot(a,cls){if(!a)return;const c=document.createElementNS(NS,'circle');c.setAttribute('cx',a.x);c.setAttribute('cy',a.y);c.setAttribute('r','4');c.setAttribute('class',cls);svg.appendChild(c)}
let known=new Set(),first=true;
function draw(){cleanLabels();layoutSiblings();requestAnimationFrame(()=>{const old=known;known=new Set();svg.replaceChildren();const me=point(mode.querySelector('.me .slotBtn')),father=point(mode.querySelector('.father .slotBtn')),mother=point(mode.querySelector('.mother .slotBtn')),gf=point(mode.querySelector('.gf .slotBtn')),gm=point(mode.querySelector('.gm .slotBtn')),gf2=point(mode.querySelector('.gf2 .slotBtn')),gm2=point(mode.querySelector('.gm2 .slotBtn'));
const add=(a,b,cls,key)=>{known.add(key);makePath(a,b,cls,key,!first&&!old.has(key))};add(gf,father,'rootLine','gf-f');add(gm,father,'rootLine','gm-f');add(gf2,mother,'rootLine','gf2-m');add(gm2,mother,'rootLine','gm2-m');add(father,me,'midLine','f-me');add(mother,me,'midLine','m-me');
const sibEls=[...mode.querySelectorAll('.siblings .slot .slotBtn')],sibs=sibEls.map(point),junction=father&&mother?{x:(father.x+mother.x)/2,y:(father.y+mother.y)/2}:null;sibs.forEach((s,i)=>add(junction,s,'midLine',`sib-${i}`));
const childEls=[...mode.querySelectorAll('.children .slot .slotBtn')],chs=childEls.map(point);chs.forEach((ch,i)=>add(me,ch,'newLine',`child-${i}`));
[gf,gm,gf2,gm2].forEach(x=>dot(x,'rootDot'));[father,mother,me,...sibs].forEach(x=>dot(x,'midDot'));chs.forEach(x=>dot(x,'newDot'));first=false})}
let t;const redraw=()=>{clearTimeout(t);t=setTimeout(draw,70)};if(siblings)new MutationObserver(redraw).observe(siblings,{childList:true,subtree:true,characterData:true});if(children)new MutationObserver(redraw).observe(children,{childList:true,subtree:true,characterData:true});new MutationObserver(()=>{if(mode.classList.contains('open'))setTimeout(draw,150)}).observe(mode,{attributes:true,attributeFilter:['class']});window.addEventListener('resize',redraw);mode.addEventListener('click',e=>{if(e.target.closest('.addDynamic,.remove,.editorSave'))setTimeout(draw,120)});draw();
})();