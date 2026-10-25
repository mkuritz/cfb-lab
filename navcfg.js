/* CFB Hub top-bar config (window.SLTOP, same shape as the NFL Hub navcfg-v2.js). */
window.SLTOP={
 sports:window.SLS?SLS.top():[["NBA","https://betlab.sportslabshq.com/","nba"],["NFL","https://nfllab.sportslabshq.com/","nfl"],["CFB","index.html","cfb"],["CBB","https://cbblab.sportslabshq.com/","cbb"],["NHL","https://nhllab.sportslabshq.com/","nhl"],["MLB","https://mlblab.sportslabshq.com/","mlb"]],
 by:[["Matchups","index.html","index"],["Player Props","props.html","props"],["Anytime TD","anytime-td.html","anytime-td"],["Lines & injuries","lines.html","lines"],["Trends","trends.html","trends"],["Players","players.html","players"],["Defense vs Pos","defense.html","defense"],["O-Line","oline.html","oline"],["Power","power.html","power"],["Visuals","viz.html","viz"]].concat(window.SLS?[["CFB in Bet Lab ↗",SLS.betlab("cfb"),"bl"]]:[]),
 ask:"https://betlab.sportslabshq.com/#ask&q=",cur:"cfb",ready:{cfb:true}};
