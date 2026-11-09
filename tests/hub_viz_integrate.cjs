// CFB in-Hub visuals. NODE_PATH=/workspace/visual-preview-tests/node_modules node tests/hub_viz_integrate.cjs
const fs=require('fs'),path=require('path'),{JSDOM}=require('jsdom');
const R=path.join(__dirname,'..');let ok=0,bad=0;const t=(c,m)=>{c?ok++:(bad++,console.log('FAIL',m))};const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 t(fs.readFileSync(path.join(R,'navcfg.js'),'utf8').includes('index.html#viz-analyzer'),'nav analyzer hash');
 t(fs.readFileSync(path.join(R,'navcfg.js'),'utf8').includes('index.html#viz-conference'),'nav conference hash');
 t(fs.readFileSync(path.join(R,'navcfg.js'),'utf8').includes('index.html#viz-flow'),'nav flow hash');
 for(const [page,h] of[['matchup-analyzer.html','viz-analyzer'],['conference-map.html','viz-conference'],['game-flow.html','viz-flow']]){
  const html=fs.readFileSync(path.join(R,page),'utf8');t(html.includes(h)&&html.includes('location.replace'),'redirect '+page);
 }
 const html=fs.readFileSync(path.join(R,'index.html'),'utf8');
 t(html.includes('cfb-hub-viz.js')&&html.includes('cfb-sidenav.js'),'index loads hub viz+sidenav');
 const dom=new JSDOM('<!doctype html><body><div class="w"><h2>Week</h2><div id="x"></div></div></body>',{url:'https://cfblab.sportslabshq.com/index.html#viz-analyzer',runScripts:'outside-only'});
 const w=dom.window;
 w.fetch=async(u)=>{const f=path.join(R,String(u).split('?')[0].replace(/^\.\//,''));return fs.existsSync(f)?{ok:true,json:async()=>JSON.parse(fs.readFileSync(f,'utf8'))}:{ok:false}};
 w.SLTOP={by:[['Matchup Analyzer','index.html#viz-analyzer','index#viz-analyzer'],['Matchups','index.html','index']],sports:[],cur:'cfb',ready:{cfb:true}};
 for(const f of['preview-dom.js','cfb-hub-views.js','cfb-hub-viz.js'])w.eval(fs.readFileSync(path.join(R,f),'utf8'));
 await wait(400);
 t(w.document.body.classList.contains('viz-on'),'viz-on for analyzer');
 t(!!w.document.getElementById('viz-root'),'viz-root mounted');
 t(!!w.document.querySelector('.vz-tabs a[aria-current]'),'tab current');
 w.location.hash='viz-conference';await wait(400);
 t(w.document.querySelector('.vz-heading h2')?.textContent==='Conference Map','conference title');
 w.location.hash='viz-flow';await wait(400);
 t(w.document.querySelector('.vz-heading h2')?.textContent==='Game Flow','flow title');
 w.location.hash='';await wait(100);
 t(!w.document.body.classList.contains('viz-on'),'hub restored off-hash');
 console.log(`hub_viz_integrate: ${ok} passed, ${bad} failed`);process.exit(bad?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
