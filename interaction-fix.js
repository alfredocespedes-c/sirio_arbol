(()=>{
const viewport=document.getElementById('treeViewport'),familyView=document.getElementById('familyView'),back=document.getElementById('backBtn'),add=document.querySelector('.addCenter'),input=document.getElementById('surname');
const css=document.createElement('style');css.textContent=`
.addCenter{white-space:nowrap!important;overflow:hidden!important}
.addCenter::after{content:"";font-size:0;opacity:0;transition:opacity .2s}
.addCenter:hover,.addCenter:focus-visible{width:220px!important;border-radius:999px!important;background:#ce1126!important;color:#fff!important;opacity:1!important}
.addCenter:hover .sirioPlus,.addCenter:focus-visible .sirioPlus{display:none!important}
.addCenter:hover::after,.addCenter:focus-visible::after{content:"Agregar familia";font-size:17px;font-weight:750;opacity:1}
.treeViewport.liveFiltering .addCenter:hover,.treeViewport.liveFiltering .addCenter:focus-visible{background:#ce1126!important}
`;document.head.appendChild(css);
function cancelDrag(){[viewport,familyView?.querySelector('.kinGraph')].filter(Boolean).forEach(el=>{try{el.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:1}))}catch(_){try{el.dispatchEvent(new Event('pointercancel',{bubbles:true}))}catch(__){}}});document.body.style.cursor=''}
window.addEventListener('mouseup',cancelDrag,true);window.addEventListener('pointerup',cancelDrag,true);window.addEventListener('blur',cancelDrag,true);document.addEventListener('mouseleave',cancelDrag,true);document.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&e.buttons===0)cancelDrag()},true);
if(back){back.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();cancelDrag();familyView?.classList.remove('open');setTimeout(()=>{if(input?.value)input.dispatchEvent(new Event('input',{bubbles:true}))},50)},true)}
})();