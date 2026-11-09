/* CFB Hub · Matchup Analyzer / Conference Map / Game Flow as in-Hub hash views.
   Preview integration patterned on Soccer #viz-* mount. Display-only; no model changes. */
(function(){'use strict';
const VIEWS={'viz-analyzer':'Matchup Analyzer','viz-conference':'Conference Map','viz-flow':'Game Flow'};
const CSS=`<style id="cfvhcss">body.viz-on .w>*:not(header):not(#viz-root):not(footer):not(#sl-modal-root){display:none!important}
body.viz-on{background:#080f11;color:#dce9e8}body.viz-on .w{max-width:1440px;padding:18px 24px}
body.viz-on .sl-side{background:#0d191c;border-color:#223438;width:206px;font-size:14px}body.viz-on .sl-side h4{color:#899c9f;font-size:11px}body.viz-on .sl-side a{border-radius:3px;padding:8px 10px;color:#aebfc0;font-weight:500}body.viz-on .sl-side a.cur{background:#162d2d;box-shadow:inset 2px 0 #32c9b5;color:#e7f6f1}body.viz-on .sl-tog{background:#122528;border-color:#294044;color:#b8d2d0}
#viz-root{--vb:#111f22;--vp:#14272a;--vl:#263a3d;--vm:#32c9b5;--vt:#dfebea;--vs:#9db1b3;color:var(--vt);font:14px/1.5 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:1280px;margin:0 auto}
#viz-root .vz-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin:4px 0 16px}#viz-root .vz-heading h2{font-size:24px;line-height:1.2;font-weight:750;letter-spacing:-.6px;margin:3px 0 6px}#viz-root .vz-heading p{margin:0;color:var(--vs);font-size:14px}
#viz-root .vz-eyebrow{font-size:10px;font-weight:750;color:#68adab;letter-spacing:1.3px}#viz-root .vz-status{display:flex;align-items:center;gap:7px;font:11px/1.4 ui-monospace,monospace;color:#a6bfbc;border:1px solid #2a4444;border-radius:4px;padding:5px 9px;white-space:nowrap}#viz-root .vz-status i{height:5px;width:5px;background:var(--vm);border-radius:50%}
#viz-root .vz-tabs{display:flex;gap:0;border-bottom:1px solid var(--vl);padding-bottom:12px;margin:0 0 14px;overflow:auto}#viz-root .vz-tabs a{border:1px solid var(--vl);border-right:0;background:#0d1b1e;color:#a8bcbc;padding:9px 17px;min-height:40px;font-weight:700;text-decoration:none;white-space:nowrap;box-sizing:border-box}#viz-root .vz-tabs a:first-child{border-radius:5px 0 0 5px}#viz-root .vz-tabs a:last-child{border-radius:0 5px 5px 0;border-right:1px solid var(--vl)}#viz-root .vz-tabs a[aria-current]{background:#176269;color:#e6fffa;border-color:#378e8b}
#viz-root #preview-status{margin:0 0 12px;color:var(--vs);font-size:13px}#viz-root #preview-controls{display:flex;gap:12px;flex-wrap:wrap;align-items:end;margin:0 0 16px}
#viz-root .pv-control{display:flex;flex-direction:column;gap:5px;font-size:11px;color:var(--vs)}#viz-root select,#viz-root .pv-reset{min-height:40px;padding:8px 10px;border-radius:4px;border:1px solid var(--vl);background:#0e1c1f;color:var(--vt);font:inherit}#viz-root .pv-reset{cursor:pointer}
#viz-root #preview-app{display:grid;gap:14px}#viz-root .pv-card{background:var(--vb);border:1px solid var(--vl);border-radius:6px;padding:16px;box-shadow:0 2px 8px #00000012}#viz-root .pv-card h2{margin:0 0 12px;font-size:15px;font-weight:700;color:#d7e9e6}
#viz-root .pv-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:9px;margin:0 0 12px}#viz-root .pv-kpi{background:#14272a;border:1px solid #263c40;border-radius:4px;padding:12px}#viz-root .pv-kpi small{display:block;color:#a4bbbc;font-size:11px}#viz-root .pv-kpi strong{display:block;font-size:22px;letter-spacing:-.5px;margin-top:4px;font-variant-numeric:tabular-nums}
#viz-root .mut,#viz-root .mut.sm{color:var(--vs)!important;font-size:12px!important;line-height:1.55}#viz-root .pv-chart{width:100%;height:auto;background:#102326;border:1px solid #324e52;border-radius:2px}
#viz-root .pv-data{margin-top:10px}#viz-root .pv-scroll{overflow:auto}#viz-root table{width:100%;border-collapse:collapse;font-size:13px}#viz-root th,#viz-root td{padding:10px 8px;border-bottom:1px solid var(--vl);text-align:left;font-variant-numeric:tabular-nums}#viz-root thead th{font-size:10px;letter-spacing:.4px;color:#9db5b6;text-transform:uppercase}
#viz-root .pv-link{background:transparent;border:0;color:var(--vm);cursor:pointer;font:inherit;padding:0;text-decoration:underline}
#viz-root .pv-provenance{margin:8px 0 0;color:var(--vs);font-size:12px}
@media(min-width:768px){body.viz-on.sl-open{padding-left:206px}}
@media(max-width:600px){body.viz-on .w{padding:12px}#viz-root .vz-heading{flex-direction:column;gap:8px}#viz-root .vz-heading h2{font-size:21px}#viz-root .vz-tabs a{flex:1;text-align:center;padding:9px 10px;font-size:12px}#viz-root .pv-kpi strong{font-size:18px}}</style>`;

let root=null,booted=false,hubHeader=null;
function ensureHeader(){
 // CFB index has no <header>; add a lightweight Hub header while viz is on so layout matches Soccer.
 let hd=document.querySelector('.w>header');
 if(!hd){hd=document.createElement('header');hd.className='cfb-viz-head';hd.innerHTML='<a class="logo" href="./index.html">🏈 CFB <b>Hub</b></a><span class="mut sm">Matchups, map &amp; recorded game flow</span>';
  const w=document.querySelector('.w');if(w)w.prepend(hd);hubHeader=hd}
 return hd;
}
function ensureShell(){
 if(!document.getElementById('cfvhcss'))document.head.insertAdjacentHTML('beforeend',CSS);
 const hd=ensureHeader();
 if(!root){root=document.createElement('section');root.id='viz-root';root.hidden=true;root.setAttribute('aria-live','polite');hd.after(root)}
}
function blurb(v){return v==='viz-analyzer'?'Existing matchup projections, units, talent and schedule context. Ratings are not a separate injury-adjusted betting line.':v==='viz-conference'?'Every stored power team by conference, with modeled CFP and title context kept distinct from AP ranks.':'Historical completed-game win-probability path with observed swings. Not a live or future projection.'}
async function loadPreview(){
 if(window.CFBHubViews)return;
 await new Promise((resolve,reject)=>{
  const need=[];
  if(!window.PV)need.push('preview-dom.js?v=1109hub1');
  need.push('cfb-hub-views.js?v=1109hub1');
  let left=need.length;need.forEach(src=>{const s=document.createElement('script');s.src=src;s.onload=()=>{if(--left===0)resolve()};s.onerror=()=>reject(Error(src));document.head.appendChild(s)});
 });
}
async function show(){
 const v=location.hash.slice(1);const on=Object.hasOwn(VIEWS,v);
 document.body.classList.toggle('viz-on',on);if(hubHeader)hubHeader.hidden=!on;
 if(!on){if(root)root.hidden=true;return}
 ensureShell();root.hidden=false;
 root.innerHTML=`<div class="vz-heading"><div><div class="vz-eyebrow">CFB HUB · VISUALS</div><h2>${VIEWS[v]}</h2><p>${blurb(v)}</p></div><div class="vz-status"><i></i><span>RECORDED · NOT LIVE</span></div></div>
 <nav class="vz-tabs" aria-label="CFB visuals">${Object.entries(VIEWS).map(([k,l])=>`<a href="#${k}"${k===v?' aria-current="page"':''}>${l}</a>`).join('')}</nav>
 <div id="preview-status" role="status">Loading recorded hub snapshot…</div>
 <div id="preview-controls" class="pv-controls"></div>
 <div id="preview-app"></div>
 <div class="vz-mut" style="margin-top:14px;color:#9db1b3;font-size:12px">Recorded hub snapshots. Informational only.</div>`;
 try{await loadPreview();await window.CFBHubViews.show(v)}
 catch(e){root.querySelector('#preview-app').textContent='Visuals unavailable: '+(e.message||e)}
}
function init(){addEventListener('hashchange',show);show()}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
