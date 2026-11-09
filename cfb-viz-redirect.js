(function(){'use strict';
const hash=(document.currentScript&&document.currentScript.getAttribute('data-hash'))||'viz-analyzer';
const q=new URLSearchParams(location.search);
const keep=new URLSearchParams();
for(const k of ['game','conf','event','team']){if(q.get(k)!=null)keep.set(k,q.get(k))}
const to='index.html'+(keep.toString()?'?'+keep:'')+'#'+hash;
window.__cfbVizRedirect=to;location.replace(to);
})();
