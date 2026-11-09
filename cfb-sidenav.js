/* CFB Hub in-page sidebar: builds window.SLNAV from SLTOP.by and mounts side.js. */
(function(){'use strict';
function mount(){const C=window.SLTOP;if(!C||window.SLNAV)return;
 const items=C.by.map(x=>{const href=x[1],m=/^index\.html#(.+)$/.exec(href);return [x[0],href,m?'index#'+m[1]:href.replace(/\.html.*$/,'')]});
 window.SLNAV={key:'cfb-sidebar',groups:[['CFB Hub',items]]};
 const s=document.createElement('script');s.src='side.js?v=1109hub1';document.body.appendChild(s);document.body.classList.add('cfb-side')}
const css=document.createElement('style');css.textContent='body.cfb-side #v2bar nav.by{display:none}body.cfb-side .w>h2{margin-left:0}';document.head.appendChild(css);
document.readyState==='complete'?mount():addEventListener('DOMContentLoaded',()=>setTimeout(mount,0));
})();
