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

var KS={bk:1000,m:0.25};
try{var sv=JSON.parse(localStorage.getItem("sl_cfb_kelly")||"null");if(sv&&sv.bk>0)KS=sv}catch(e){}
function saveK(){try{localStorage.setItem("sl_cfb_kelly",JSON.stringify(KS))}catch(e){}}
function kellyBar(el,cb){
 if(!el)return;
 el.innerHTML='<div class="kbar"><label>💰 Bankroll ($)<input type="number" id="cfb-bk" min="50" step="50" value="'+KS.bk+'"></label><div class="kbtns" role="group" aria-label="Kelly multiplier">'+[[0.25,"0.25x Kelly"],[0.5,"0.5x Kelly"],[1.0,"1.0x Full"],[0,"Flat 1%"]].map(function(x){return '<button type="button" data-km="'+x[0]+'" class="'+(KS.m===x[0]?"on":"")+'">'+x[1]+'</button>'}).join("")+'</div><span class="mut sm" style="margin-left:auto">Exact $ stake &amp; Fair vs. Market Line Edge on every card (capped at 5% bankroll)</span></div>';
 var inp=el.querySelector("#cfb-bk");
 if(inp)inp.onchange=function(){var v=Math.max(10,parseFloat(inp.value)||1000);KS.bk=v;saveK();if(cb)cb()};
 el.querySelectorAll("[data-km]").forEach(function(b){b.onclick=function(){KS.m=parseFloat(b.getAttribute("data-km"));saveK();kellyBar(el,cb);if(cb)cb()}});
}
function badgesHtml(arr){
 if(!arr||!arr.length)return"";
 return '<div class="cbadges">'+arr.map(function(b){return '<span class="cbadge '+E(b.kind||"")+'">'+E(b.txt)+'</span>'}).join("")+'</div>';
}
function stakeHtml(oursP,fairP,amOdds,sideLabel){
 if(oursP==null||fairP==null)return"";
 var diff=oursP-fairP;
 if(Math.abs(diff)<0.008)return '<div class="krow"><span class="mut">Fair vs Market: aligned ('+pc(oursP)+' vs '+pc(fairP)+')</span><span class="mut">$0 Pass</span></div>';
 var p=diff>0?oursP:(1-oursP),q=diff>0?fairP:(1-fairP),ed=p-q;
 var bDec=(diff>0&&amOdds!=null)?(amOdds>0?amOdds/100:100/-amOdds):(100/110);
 var f=Math.max(0,(p*bDec-(1-p))/bDec);
 var frac=KS.m===0?0.01:Math.min(0.05,f*KS.m);
 var stake=Math.round(KS.bk*frac*100)/100;
 var evPct=((p*(bDec+1)-1)*100);
 if(stake<=0&&ed>0.01){stake=Math.round(KS.bk*Math.min(0.03,ed*(KS.m||0.25))*100)/100}
 return '<div class="krow"><span class="kst">💵 Stake $'+stake.toFixed(2)+(sideLabel?" · "+E(sideLabel):"")+'</span><span class="mut">Fair <b>'+pc(p)+'</b> vs Mkt <b>'+pc(q)+'</b> ('+(ed>=0?"+":"")+(ed*100).toFixed(1)+'% edge'+(evPct>0?' · +$'+Math.max(0.1,stake*Math.max(ed,evPct/100)).toFixed(2)+' EV':'')+')</span></div>';
}

window.CFB={data:data,E:E,ord:ord,fmtT:fmtT,am:am,pc:pc,head:head,logo:logo,edge:edge,ini:ini,kellyBar:kellyBar,badgesHtml:badgesHtml,stakeHtml:stakeHtml};
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
})();
