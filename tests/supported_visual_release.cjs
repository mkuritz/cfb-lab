const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');const root=path.resolve(__dirname,'..');let checks=0;
const ok=(v,m)=>{assert.ok(v,m);checks++};
(async()=>{
 ok(fs.existsSync(path.join(root,'cfb-hub-viz.js')),'hub viz module present');
 ok(fs.existsSync(path.join(root,'cfb-hub-views.js')),'hub views module present');
 ok(fs.existsSync(path.join(root,'cfb-sidenav.js')),'sidenav module present');
 const nav=fs.readFileSync(path.join(root,'navcfg.js'),'utf8');
 ok(nav.includes('index.html#viz-analyzer')&&nav.includes('index.html#viz-conference')&&nav.includes('index.html#viz-flow'),'nav uses in-hub hashes');
 for(const [page,h] of[['matchup-analyzer.html','viz-analyzer'],['conference-map.html','viz-conference'],['game-flow.html','viz-flow']]){
  const html=fs.readFileSync(path.join(root,page),'utf8');
  ok(html.includes('location.replace')&&html.includes(h),'standalone '+page+' redirects to #'+h);
 }
 const idx=fs.readFileSync(path.join(root,'index.html'),'utf8');
 ok(idx.includes('cfb-hub-viz.js')&&idx.includes('cfb-sidenav.js'),'index loads hub integration');
 // Redirect script preserves query
 const dom=new JSDOM(fs.readFileSync(path.join(root,'matchup-analyzer.html'),'utf8'),{url:'https://cfblab.sportslabshq.com/matchup-analyzer.html?game=2',runScripts:'dangerously'});
 await new Promise(r=>setTimeout(r,20));
 ok((dom.window.__cfbVizRedirect||'').includes('#viz-analyzer')&&(dom.window.__cfbVizRedirect||'').includes('game=2'),'redirect keeps game query');
 // Data contracts still present
 for(const f of['data/cfb.json','data/meta.json','data/visual_preview/event_view.json','data/visual_preview/profile_ids.json']) ok(fs.existsSync(path.join(root,f)),'data '+f);
 console.log(`cfb hub release checks passed\n${checks} assertions passed`);
})().catch(e=>{console.error(e);process.exitCode=1});
