(function(){
var E=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})};
var D=null,Q=[];function data(cb){if(D)return cb(D);Q.push(cb);if(Q.length>1)return;fetch("data/cfb.json").then(function(r){return r.json()}).then(function(j){D=j;Q.forEach(function(f){f(j)});Q=[]})}
function ord(n){var s=["th","st","nd","rd"],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0])}
function fmtT(t){var d=new Date(t);return d.toLocaleDateString("en-US",{weekday:"short",timeZone:"America/New_York"}).toUpperCase()+" "+d.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})+" ET"}
function am(a){return a==null?"—":(a>0?"+":"")+a}
function pc(p){return p==null?"—":(p*100).toFixed(1)+"%"}
function ini(n){return String(n||"").split(/\s+/).map(function(w){return w[0]}).slice(0,2).join("").toUpperCase()}
function head(id,nm,url,col,sz){sz=sz||44;return '<span class="hsr" style="width:'+sz+'px;height:'+sz+'px;box-shadow:0 0 0 3px '+(col||"#38d0f0")+'"><b style="font-size:'+Math.round(sz*.36)+'px">'+E(ini(nm))+'</b>'+(url?'<img loading="lazy" src="'+E(url)+'" alt="" onerror="this.remove()">':'')+'</span>'}
function logo(t,sz){var x=D&&D.teams[t];return x&&x.logo?'<img class="tl" src="'+E(x.logo)+'" alt="'+E(x.ab)+'" style="width:'+(sz||20)+'px;height:'+(sz||20)+'px;vertical-align:middle">':''}
function edge(e){return e==null?'<span class="edge" title="Needs 2+ books">EDGE —</span>':'<span class="edge '+(e>=0?"p":"n")+'">EDGE '+(e>=0?"+":"")+(e*100).toFixed(1)+'%</span>'}
function roleBadge(p){
 if(!p)return"";
 var r=p.role||(p.starter?(p.pos+"1 · Starter"):(p.pos+" · Rotation"));
 var cls=p.starter!==false?"st":"bn";
 var sh="";
 if(p.pos==="RB"&&p.cs)sh=' <span class="usg-pill">'+p.cs+'% Carry</span>';
 else if((p.pos==="WR"||p.pos==="TE")&&p.rs)sh=' <span class="usg-pill">'+p.rs+'% Rec Share</span>';
 else if(p.use_pct)sh=' <span class="usg-pill">'+p.use_pct+'% USG</span>';
 var ht=p.hit_l5?' <span class="hit-pill">'+E(p.hit_l5)+' L5</span>':'';
 return '<span class="role-pill '+cls+'">★ '+E(r)+'</span>'+sh+ht;
}

var KS={bk:1000,m:0.25};
try{
 var sv=JSON.parse(localStorage.getItem("sl_cfb_kelly")||"null");
 if(sv&&sv.bk>0)KS=sv;
 var uBk=parseFloat(localStorage.getItem("sl_bankroll")||"");
 var uKm=parseFloat(localStorage.getItem("sl_kelly")||"");
 if(uBk>0)KS.bk=uBk;
 if([0.25,0.5,1,1.0,0].includes(uKm))KS.m=uKm;
}catch(e){}
function saveK(){try{localStorage.setItem("sl_cfb_kelly",JSON.stringify(KS));localStorage.setItem("sl_bankroll",String(KS.bk));if(KS.m>0)localStorage.setItem("sl_kelly",String(KS.m))}catch(e){}}
function kellyBar(el,cb){
 if(!el)return;
 el.innerHTML='<div class="kbar"><label>💰 Bankroll ($)<input type="number" id="cfb-bk" min="50" step="50" value="'+KS.bk+'"></label><div class="kbtns" role="group" aria-label="Kelly multiplier">'+[[0.25,"0.25x Kelly"],[0.5,"0.5x Kelly"],[1.0,"1.0x Full"],[0,"Flat 1%"]].map(function(x){return '<button type="button" data-km="'+x[0]+'" class="'+(KS.m===x[0]?"on":"")+'">'+x[1]+'</button>'}).join("")+'</div><span class="mut sm" style="margin-left:auto">Exact $ stake &amp; Fair vs. Market Line Edge on every card (capped at 5% bankroll)</span></div>';
 var inp=el.querySelector("#cfb-bk");
 if(inp)inp.onchange=function(){var v=Math.max(10,parseFloat(inp.value)||1000);KS.bk=v;saveK();if(cb)cb()};
 el.querySelectorAll("[data-km]").forEach(function(b){b.onclick=function(){KS.m=parseFloat(b.getAttribute("data-km"));saveK();kellyBar(el,cb);if(cb)cb()}});
}
var WDIR_ARROW={N:"↓",NNE:"↙",NE:"↙",ENE:"←",E:"←",ESE:"↖",SE:"↖",SSE:"↑",S:"↑",SSW:"↗",SW:"↗",WSW:"→",W:"→",WNW:"↘",NW:"↘",NNW:"↓"};
function wxPillHtml(wx){
 if(!wx)return"";
 if(wx.indoor)return '<span class="cbadge wx">🏟️ Dome · Fast Track (+Pass)</span>';
 var arr=WDIR_ARROW[wx.wind_dir]||"↗";
 var wnd=wx.wind!=null?Math.round(wx.wind):0;
 var tag=wx.kind=="wind"?"Pass/FG Drag":wx.kind=="rain"?"Wet Ball · Rush Boost":wx.kind=="cold"?"Cold Track":wx.kind=="heat"?"Warm Track":"Clean Track";
 return '<span class="cbadge wx" title="'+E(wx.txt||"")+'">'+(wx.kind=="wind"?"🌬️":wx.kind=="rain"?"🌧️":"🌤️")+' '+(wx.temp!=null?wx.temp+"°F · ":"")+'Wind '+wnd+' mph '+(wx.wind_dir?arr+" "+E(wx.wind_dir)+" · ":"")+E(tag)+'</span>';
}
function badgesHtml(arr){
 if(!arr||!arr.length)return"";
 var top=arr.filter(function(b){return b.kind!="wx"}).slice(0,1);
 var wx=arr.filter(function(b){return b.kind=="wx"})[0];
 return '<div class="cbadges">'+top.map(function(b){return '<span class="cbadge '+E(b.kind||"")+'">'+E(b.txt)+'</span>'}).join("")+(wx?'<span class="cbadge wx">'+E(wx.txt)+'</span>':'')+'</div>';
}
function gameVizHtml(g){
 if(!D||!D.units||!D.teams)return badgesHtml(g.badges);
 var U=D.units,a=String(g.a),h=String(g.h);
 var aab=(D.teams[a]||{}).ab||"AWY",hab=(D.teams[h]||{}).ab||"HME";
 var u=function(k,t){return (U[k]&&U[k][t]!=null)?U[k][t]:50};
 var expA=u("Explosiveness",a),expH=u("Explosiveness",h);
 var trA=Math.round((u("Pass block",a)+u("Run block",a)+u("Havoc",a))/3);
 var trH=Math.round((u("Pass block",h)+u("Run block",h)+u("Havoc",h))/3);
 var rzA=Math.round(u("EPA offense",a)*0.65+(100-u("EPA defense",h))*0.35);
 var rzH=Math.round(u("EPA offense",h)*0.65+(100-u("EPA defense",a))*0.35);
 var gid=a+"@"+h;
 function mRow(lbl,vA,vH,cat){
  var tot=Math.max(1,vA+vH),wA=Math.round(vA/tot*100),wH=100-wA;
  return '<div class="cm-row" data-cgame="'+E(gid)+'" data-ccat="'+cat+'" title="Tap to jump to '+E(aab+' @ '+hab)+' player props"><span class="rk-pill '+(vA>=vH?"win":"")+'">'+E(aab)+' '+vA+'</span><div class="cm-mid"><span class="cm-lbl">'+lbl+' ↗</span><div class="cm-bar"><i class="a" style="width:'+wA+'%"></i><i class="h" style="width:'+wH+'%"></i></div></div><span class="rk-pill r '+(vH>vA?"win":"")+'">'+vH+' '+E(hab)+'</span></div>';
 }
 var topB=(g.badges||[]).filter(function(b){return b.kind!="wx"})[0];
 var pillStrip='<div class="cbadges">'+(topB?'<span class="cbadge '+E(topB.kind)+'">'+E(topB.txt.split("(")[0].trim())+'</span>':'')+wxPillHtml(g.wx)+'</div>';
 return '<div class="cfb-viz-meter" data-cgame="'+E(gid)+'" title="Tap any mismatch meter to filter '+E(aab+' @ '+hab)+' player props">'+mRow("💥 Explosive",expA,expH,"pass")+mRow("🛡️ Trenches",trA,trH,"rush")+mRow("🚨 Red Zone",rzA,rzH,"all")+'</div>'+pillStrip;
}
function stakeHtml(oursP,fairP,amOdds,sideLabel){
 if(oursP==null||fairP==null)return"";
 var diff=oursP-fairP;
 var p=diff>=0?oursP:(1-oursP),q=diff>=0?fairP:(1-fairP),ed=p-q;
 var pW=Math.min(100,Math.max(4,Math.round(p*1000)/10)),qW=Math.min(97,Math.max(3,Math.round(q*1000)/10));
 var gauge='<div class="cfb-edge-viz" title="Our Fair '+pc(p)+' vs Book Fair '+pc(q)+'"><div class="cev-hd"><span>📊 Our Fair <b>'+pc(p)+'</b>'+(sideLabel?" ("+E(sideLabel)+")":"")+'</span><span>Book Fair <b>'+pc(q)+'</b> · <b class="'+(ed>=0.008?"up":"mut")+'">'+(ed>=0?"+":"")+(ed*100).toFixed(1)+'% Edge</b></span></div><div class="cev-track"><div class="cev-fill" style="width:'+pW+'%"></div><div class="cev-tick" style="left:'+qW+'%" title="Book Fair '+pc(q)+'"></div></div></div>';
 if(Math.abs(diff)<0.008)return gauge+'<div class="krow"><span class="mut">Fair vs Market: aligned ('+pc(oursP)+' vs '+pc(fairP)+')</span><span class="mut">$0 Pass</span></div>';
 var bDec=(diff>0&&amOdds!=null)?(amOdds>0?amOdds/100:100/-amOdds):(100/110);
 var f=Math.max(0,(p*bDec-(1-p))/bDec);
 var frac=KS.m===0?0.01:Math.min(0.05,f*KS.m);
 var stake=Math.round(KS.bk*frac*100)/100;
 var evPct=((p*(bDec+1)-1)*100);
 if(stake<=0&&ed>0.01){stake=Math.round(KS.bk*Math.min(0.03,ed*(KS.m||0.25))*100)/100}
 return gauge+'<div class="krow"><span class="kst">💵 Stake $'+stake.toFixed(2)+(sideLabel?" · "+E(sideLabel):"")+'</span><span class="mut">Fair <b>'+pc(p)+'</b> vs Mkt <b>'+pc(q)+'</b> ('+(ed>=0?"+":"")+(ed*100).toFixed(1)+'% edge'+(evPct>0?' · +$'+Math.max(0.1,stake*Math.max(ed,evPct/100)).toFixed(2)+' EV':'')+')</span></div>';
}

function openPlayerModal(aid){
 data(function(){
  var pid=String(aid||"");
  var plBase=(D.players||[]).find(function(x){return String(x.id)===pid})||{};
  var pProps=(D.props||[]).filter(function(x){return String(x.aid)===pid});
  var pAtd=(D.atd||[]).find(function(x){return String(x.aid)===pid});
  var ov=document.getElementById("cfb-modal-ov");
  if(ov)ov.remove();
  ov=document.createElement("div");
  ov.id="cfb-modal-ov";
  ov.innerHTML='<div id="cfb-modal" role="dialog" aria-modal="true" aria-label="Player profile"><button type="button" class="xbtn" id="cfb-modal-x">✕</button><p class="mut">Loading player profile &amp; prop intel…</p></div>';
  document.body.appendChild(ov);
  ov.onclick=function(e){if(e.target===ov)ov.remove()};
  ov.querySelector("#cfb-modal-x").onclick=function(){ov.remove()};

  fetch("data/players/"+encodeURIComponent(pid)+".json").then(function(r){return r.ok?r.json():null}).catch(function(){return null}).then(function(pj){
   var p=Object.assign({},plBase,pj||{});
   var T=(D.teams&&D.teams[p.t])||{};
   var s=p.s||{gp:p.gp||1,pyd:p.pyd||0,ryd:p.ryd||0,reyd:p.reyd||0,rec:p.rec||0,ptd:p.ptd||0,rtd:p.rtd||0,retd:p.retd||0};
   var gl=(p.g||p.l5||[]).slice().reverse();
   var box=ov.querySelector("#cfb-modal");
   var h='<button type="button" class="xbtn" id="cfb-modal-x">✕</button>'
    +'<div style="display:flex;gap:14px;align-items:center">'
    +head(pid,p.nm,p.hs||plBase.hs,T.col||"#38d0f0",68)
    +'<div><div style="font-size:21px;font-weight:900">'+E(p.nm||"Player")+(p.j?' <span class="mut sm">#'+E(p.j)+'</span>':'')+'</div>'
    +'<div class="mut sm" style="margin:3px 0">'+logo(p.t,18)+' <a href="power.html#t'+p.t+'" style="color:#7dd3fc;font-weight:700">'+E(T.nm||T.ab||"CFB")+'</a> · '+E(p.pos||"")+' · '+E(T.conf||"FBS")+'</div>'
    +'<div style="margin-top:4px">'+roleBadge(plBase.role?plBase:(pProps[0]||p))+'</div></div></div>';

   h+='<h3 style="margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#94a3b8">⚡ Usage, Opportunity Shares &amp; Efficiency</h3>'
    +'<div class="m-grid">'
    +'<div class="m-tile"><div class="l">Overall Usage</div><div class="v" style="color:#38d0f0">'+(plBase.use_pct!=null?plBase.use_pct+'%':'—')+'</div><div class="s">Share of team plays</div></div>'
    +'<div class="m-tile"><div class="l">Carry Share</div><div class="v">'+(plBase.cs?plBase.cs+'%':'—')+'</div><div class="s">Team rush share</div></div>'
    +'<div class="m-tile"><div class="l">Rec / Tgt Share</div><div class="v" style="color:#fcd34d">'+(plBase.rs?plBase.rs+'%':'—')+'</div><div class="s">Team rec share</div></div>'
    +'<div class="m-tile"><div class="l">3rd-Down USG</div><div class="v">'+(plBase.third_use!=null?plBase.third_use+'%':'—')+'</div><div class="s">Money-down role</div></div>'
    +'<div class="m-tile"><div class="l">EPA / Play</div><div class="v" style="color:#8ee04a">'+(plBase.epa!=null?(plBase.epa>0?'+':'')+plBase.epa:'—')+'</div><div class="s">Garbage time out</div></div>'
    +'<div class="m-tile"><div class="l">2026 Season</div><div class="v">'+(s.gp||plBase.gp||0)+' GP</div><div class="s">'+(p.pos==="QB"?(s.pyd||0)+" Pass Yds":(p.pos==="RB"?(s.ryd||0)+" Rush Yds":(s.reyd||0)+" Rec Yds"))+'</div></div>'
    +'</div>';

   if(pProps.length||pAtd){
    h+='<h3 style="margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#94a3b8">🎯 Active Player Props &amp; Matchup Intel</h3>'
     +'<div class="card wrap" style="padding:0"><table><tr><th>Market</th><th>Side &amp; Line</th><th>Our Proj</th><th>Ours</th><th>Book Fair</th><th>Edge</th><th>Best</th><th>Slip</th></tr>'
     +pProps.map(function(pr){
      var po=pr.side==="Over"?pr.ours:(1-pr.ours),pf=pr.side==="Over"?pr.fair:(1-pr.fair);
      return '<tr><td><b>'+E(pr.mk)+'</b>'+(pr.hit_l5?' <span class="hit-pill">'+E(pr.hit_l5)+' L5</span>':'')+'</td><td>'+E(pr.side)+' '+pr.line+'</td><td><b>'+pr.proj+'</b></td><td>'+pc(po)+'</td><td>'+pc(pf)+'</td><td>'+edge(pr.edge)+'</td><td>'+(pr.best?am(pr.best[0])+' <span class="mut sm">'+E(pr.best[1])+'</span>':'—')+'</td><td><a class="sl-bl-btn" href="https://betlab.sportslabshq.com/?sport=cfb&amp;addleg='+encodeURIComponent(pid+"|"+pr.mk)+'" target="_blank" rel="noopener">➕ Slip</a></td></tr>';
     }).join("")
     +(pAtd?'<tr><td><b>Anytime TD</b> <span class="role-pill st">'+E(pAtd.tier)+'</span></td><td>Yes 0.5</td><td><b>'+pAtd.td_season+' TD / '+pAtd.gp+'G</b></td><td><b>'+pc(pAtd.p)+'</b></td><td>'+pc(pAtd.nv)+'</td><td>'+edge(pAtd.ev)+'</td><td>'+am(pAtd.price)+' <span class="mut sm">'+E(pAtd.book)+'</span></td><td><a class="sl-bl-btn" href="https://betlab.sportslabshq.com/?sport=cfb&amp;addleg='+encodeURIComponent(pid+"|Anytime TD")+'" target="_blank" rel="noopener">➕ Slip</a></td></tr>':'')
     +'</table></div>'
     +'<div class="mut sm" style="margin-top:5px">'+E((pProps[0]&&pProps[0].why)||(pAtd&&pAtd.why)||"")+'</div>';
   }

   if(gl.length){
    h+='<h3 style="margin:16px 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#94a3b8">📊 2026 Game Log &amp; Opportunity Shares</h3>'
     +'<div class="card wrap" style="padding:0"><table><tr><th>Wk</th><th>Opp</th><th>Pass</th><th>Rush</th><th>Rec</th><th>Carry %</th><th>Rec %</th></tr>'
     +gl.slice(0,8).map(function(x){
      var csTxt=x.cs!=null?(x.cs<=1?Math.round(x.cs*100):Math.round(x.cs))+"%":"—";
      var rsTxt=x.rs!=null?(x.rs<=1?Math.round(x.rs*100):Math.round(x.rs))+"%":"—";
      return '<tr><td>'+x.wk+'</td><td>'+E(x.ha||"vs")+' '+E(x.oab||"OPP")+'</td><td>'+(x.pyd?x.pyd+' yds'+(x.ptd?', '+x.ptd+' TD':''):'—')+'</td><td>'+(x.ryd?x.ryd+' yds'+(x.rtd?', '+x.rtd+' TD':''):'—')+'</td><td>'+(x.rec||x.reyd?(x.rec||0)+' rec, '+(x.reyd||0)+' yds'+(x.retd?', '+x.retd+' TD':''):'—')+'</td><td>'+csTxt+'</td><td>'+rsTxt+'</td></tr>';
     }).join("")+'</table></div>';
   }

   h+='<div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center"><a href="player.html?id='+encodeURIComponent(pid)+'" class="chip" style="text-decoration:none">Open Full Player Page →</a><a href="props.html" class="chip" style="text-decoration:none">All CFB Player Props →</a></div>';
   box.innerHTML=h;
   box.querySelector("#cfb-modal-x").onclick=function(){ov.remove()};
  });
 });
}

document.addEventListener("keydown",function(e){
 if(e.key==="Escape"){
  var ov=document.getElementById("cfb-modal-ov");
  if(ov)ov.remove();
 }
});
document.addEventListener("click",function(e){
 var pl=e.target.closest("[data-cfb-player]");
 if(pl){
  e.preventDefault();
  e.stopPropagation();
  openPlayerModal(pl.getAttribute("data-cfb-player"));
  return;
 }
 var cr=e.target.closest("[data-cgame]");
 if(cr){
  e.stopPropagation();
  var gVal=cr.getAttribute("data-cgame"),cVal=cr.getAttribute("data-ccat")||"";
  location.href="props.html?game="+encodeURIComponent(gVal)+(cVal?"&cat="+encodeURIComponent(cVal):"");
 }
});
window.CFB={data:data,E:E,ord:ord,fmtT:fmtT,am:am,pc:pc,head:head,logo:logo,edge:edge,ini:ini,roleBadge:roleBadge,kellyBar:kellyBar,badgesHtml:badgesHtml,gameVizHtml:gameVizHtml,wxPillHtml:wxPillHtml,stakeHtml:stakeHtml,openPlayerModal:openPlayerModal};
function bar(){if(document.getElementById("v2bar"))return;var C=window.SLTOP;if(!C)return;var pg=(location.pathname.split("/").pop()||"index.html").replace(".html","");if(pg=="player")pg="players";
 var b=document.createElement("header");b.id="v2bar";b.setAttribute("role","banner");
 var sp=C.sports.map(function(x){return x[2]==C.cur?'<a class="on" aria-current="page" href="'+x[1]+'">'+x[0]+'</a>':'<a href="'+x[1]+'" data-sp="'+x[2]+'">'+x[0]+'</a>'}).join("");
 var by=C.by.map(function(x){return '<a class="'+(pg==x[2]?"on":"")+'"'+(pg==x[2]?' aria-current="page"':'')+' href="'+x[1]+'">'+x[0]+'</a>'}).join("");
 b.innerHTML='<div class="in"><a class="brand" href="index.html">CFB <b>Hub</b></a><nav class="sp" aria-label="Sport">'+sp+'</nav><button id="v2menu" aria-expanded="false" aria-controls="v2drop" aria-label="Menu">☰</button><div id="v2drop"><form id="v2ask" role="search"><input type="search" placeholder="Ask anything… e.g. best college rushing matchups" aria-label="Ask Sports Labs" enterkeyhint="search"></form><nav class="by" aria-label="CFB Hub sections">'+by+'</nav></div></div>';
 document.body.insertBefore(b,document.body.firstChild);
 var m=b.querySelector("#v2menu"),dr=b.querySelector("#v2drop");m.onclick=function(){var o=dr.classList.toggle("open");m.setAttribute("aria-expanded",o);m.textContent=o?"✕":"☰";if(o)b.querySelector("#v2ask input").focus({preventScroll:true})};
 document.addEventListener("keydown",function(e){if(e.key=="Escape"&&dr.classList.contains("open"))m.click()});
 document.addEventListener("click",function(e){if(dr.classList.contains("open")&&!b.contains(e.target))m.click()});
 b.querySelectorAll("a").forEach(function(a){a.addEventListener("pointerdown",function(){b.querySelectorAll("nav a.on").forEach(function(x){if(x.parentNode==a.parentNode)x.classList.remove("on")});a.classList.add("on")})});
 b.querySelector("form").onsubmit=function(e){e.preventDefault();var q=b.querySelector("input").value.trim();location.href=C.ask+encodeURIComponent(q||"best college football props this week")}}
if(document.readyState=="loading")document.addEventListener("DOMContentLoaded",bar);else bar();
(function(){function _ld(){if(window.__sl||document.querySelector('script[src*="/sl/sl.js"]'))return;var _sls=document.createElement("script");_sls.src="https://sportslabshq.com/sl/sl.js?v=12";_sls.defer=true;document.head.appendChild(_sls)}if(document.readyState=="loading")document.addEventListener("DOMContentLoaded",_ld);else _ld()})();
})();
