(()=>{
const viewport=document.getElementById('treeViewport'),familyView=document.getElementById('familyView'),fg=familyView?.querySelector('.kinGraph'),kinPeople=document.getElementById('kinPeople'),back=document.getElementById('backBtn'),add=document.querySelector('.addCenter'),input=document.getElementById('surname');
const css=document.createElement('style');css.textContent=`
.addCenter{white-space:nowrap!important;overflow:hidden!important}
.addCenter::after{content:""!important;display:none!important}
.addCenter:hover,.addCenter:focus-visible{width:220px!important;border-radius:999px!important;background:#ce1126!important;color:#fff!important;opacity:1!important;font-size:17px!important;font-weight:750!important}
.treeViewport.liveFiltering .addCenter:hover,.treeViewport.liveFiltering .addCenter:focus-visible{background:#ce1126!important}
.familyView .kin{pointer-events:auto!important;cursor:pointer!important}
.familyView .kin *{pointer-events:none!important}
`;document.head.appendChild(css);
if(add){const show=()=>{add.classList.add('familyHover');add.textContent='Agregar familia'},hide=()=>{add.classList.remove('familyHover');add.innerHTML='<span class="sirioPlus">+</span>'};add.onmouseenter=show;add.onmouseleave=hide;add.onfocus=show;add.onblur=hide}
function cancelDrag(){[viewport,fg].filter(Boolean).forEach(el=>{try{if(el.hasPointerCapture?.(1))el.releasePointerCapture(1)}catch(_){};try{el.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:1}))}catch(_){}});document.body.style.cursor=''}
['mouseup','pointerup','pointercancel','blur'].forEach(ev=>window.addEventListener(ev,cancelDrag,true));document.addEventListener('mouseleave',cancelDrag,true);document.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'&&e.buttons===0)cancelDrag()},true);
if(back)back.addEventListener('click',e=>{e.preventDefault();cancelDrag()},true);
let zoom=1,px=0,py=0;function apply(){if(!fg)return;fg.style.transition='transform .72s cubic-bezier(.16,.85,.2,1)';fg.style.transform=`translate(calc(-50% + ${px}px),calc(-50% + ${py}px)) scale(${zoom})`}
if(fg){fg.addEventListener('dblclick',e=>{if(e.target.closest('.kin'))return;e.preventDefault();zoom=Math.min(1.65,zoom*1.32);apply()},true)}
if(kinPeople){kinPeople.addEventListener('click',e=>{const kin=e.target.closest('.kin');if(!kin)return;cancelDrag();const kids=[...kinPeople.children],idx=kids.indexOf(kin);if(idx<0)return;const next=kids[idx+1]||kids[idx-1];if(next){next.click();setTimeout(()=>{zoom=Math.max(.58,zoom*.9);apply()},40)}},false)}
})();