#!/usr/bin/env python3
"""Build display-only CFB RB expected-rush-yards JSON.

expected = season avg rush attempts × opponent rush yards allowed per rush attempt

Attempts and opponent YPC come from published Hub player game logs (car / ryd).
Lines and Sports Labs proj come from published props when present.
"""
from __future__ import annotations

import collections
import json
import os
import statistics
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
OUT = os.path.join(DATA, "rb_expected_rush.json")
ET = ZoneInfo("America/New_York")


def jload(path):
    with open(path if path.startswith("/") else os.path.join(DATA, path)) as f:
        return json.load(f)


def round1(x):
    return None if x is None else round(float(x) + 1e-9, 1)


def main():
    meta = jload("meta.json")
    cfb = jload("cfb.json")
    teams = cfb.get("teams") or {}
    props = [
        p
        for p in cfb.get("props") or []
        if p.get("mk") == "Rush yds" and p.get("pos") == "RB"
    ]
    by_aid = {}
    for p in props:
        aid = str(p["aid"])
        # prefer starter / highest use if duplicates
        cur = by_aid.get(aid)
        if not cur or (p.get("starter") and not cur.get("starter")):
            by_aid[aid] = p

    # Opponent rush yards / attempts faced from published player game logs
    D = collections.defaultdict(lambda: {"ry": 0.0, "ra": 0.0, "g": set()})
    players_dir = os.path.join(DATA, "players")
    for fn in os.listdir(players_dir):
        if not fn.endswith(".json"):
            continue
        p = jload(os.path.join(players_dir, fn))
        for g in p.get("g") or []:
            opp = str(g.get("opp") or "")
            if not opp:
                continue
            car = float(g.get("car") or 0)
            ry = float(g.get("ryd") or 0)
            if car or ry:
                D[opp]["ry"] += ry
                D[opp]["ra"] += car
                D[opp]["g"].add(str(g.get("gid") or f"{g.get('wk')}-{opp}"))

    team_ypc = {}
    for tid, d in D.items():
        if d["ra"] < 10:
            continue
        ab = (teams.get(tid) or {}).get("ab") or tid
        team_ypc[tid] = {
            "ypc": round(d["ry"] / d["ra"], 2),
            "ry": round(d["ry"], 1),
            "ra": round(d["ra"], 1),
            "g": len(d["g"]),
            "ab": ab,
            "source": "2026 player-log rush attempts & yards allowed",
        }

    # Upcoming games by team id
    games = cfb.get("games") or []
    next_by_team = {}
    for g in games:
        if g.get("done"):
            continue
        for side, opp_side, home in (("h", "a", True), ("a", "h", False)):
            tid = str(g.get(side) or "")
            oid = str(g.get(opp_side) or "")
            if not tid or not oid:
                continue
            # keep earliest upcoming
            prev = next_by_team.get(tid)
            if not prev or (g.get("t") or "") < (prev.get("t") or ""):
                next_by_team[tid] = {
                    "opp": oid,
                    "home": home,
                    "kickoff": g.get("t"),
                    "gid": g.get("id"),
                    "opp_ab": (teams.get(oid) or {}).get("ab") or g.get("aab" if home else "hab"),
                }

    players_out = {}
    hidden = collections.Counter()
    # Candidate RBs: list players with pos RB who are starters or have rush props or high rush yards
    list_players = [p for p in cfb.get("players") or [] if p.get("pos") == "RB"]
    cand_ids = {str(p["id"]) for p in list_players if p.get("starter") or (p.get("ryd") or 0) >= 100}
    cand_ids |= set(by_aid.keys())

    for pid in sorted(cand_ids):
        path = os.path.join(players_dir, f"{pid}.json")
        if not os.path.exists(path):
            hidden["missing_player_file"] += 1
            continue
        p = jload(path)
        if p.get("pos") != "RB":
            hidden["not_rb"] += 1
            continue
        tid = str(p.get("t") or "")
        board = by_aid.get(pid)
        nxt = None
        if board and board.get("opp_tid"):
            nxt = {
                "opp": str(board["opp_tid"]),
                "home": None,
                "kickoff": board.get("time"),
                "opp_ab": board.get("opp_ab"),
            }
            # infer home from gid like 150@152
            gid = board.get("gid") or ""
            if "@" in gid:
                a, h = gid.split("@", 1)
                nxt["home"] = tid == h
        elif tid in next_by_team:
            nxt = next_by_team[tid]
        else:
            hidden["no_upcoming_opponent"] += 1
            continue

        s = p.get("s") or {}
        gp = float(s.get("gp") or 0)
        car = float(s.get("car") or 0)
        gl = p.get("g") or []
        cars = [float(g["car"]) for g in gl if g.get("car") is not None]
        if cars:
            avg_att = statistics.mean(cars)
            window = f"2026 season ({len(cars)} games with carries logged)"
            att_games = len(cars)
        elif gp >= 1 and car > 0:
            avg_att = car / gp
            window = f"2026 season totals ({int(gp)} GP)"
            att_games = int(gp)
        else:
            hidden["no_attempt_history"] += 1
            continue

        opp = str(nxt["opp"])
        y = team_ypc.get(opp)
        if not y:
            hidden["missing_opp_attempts_faced"] += 1
            continue
        expected = round1(avg_att * y["ypc"])
        row = {
            "id": pid,
            "name": p.get("nm"),
            "team": tid,
            "team_ab": (teams.get(tid) or {}).get("ab"),
            "pos": "RB",
            "opp": opp,
            "opp_ab": nxt.get("opp_ab") or y.get("ab"),
            "home": nxt.get("home"),
            "kickoff": nxt.get("kickoff"),
            "avg_att": round1(avg_att),
            "att_window": window,
            "att_games": att_games,
            "opp_ypc": y["ypc"],
            "opp_ypc_source": y["source"],
            "opp_ry": y["ry"],
            "opp_ra": y["ra"],
            "opp_g": y["g"],
            "expected": expected,
            "formula": f"{round1(avg_att)} att × {y['ypc']} yds allowed/att = {expected} yds",
            "label": "Attempts × opponent rate estimate",
        }
        if board:
            if board.get("line") is not None:
                row["line"] = board["line"]
                row["line_src"] = "posted"
            if board.get("proj") is not None:
                row["sl_proj"] = board["proj"]
            if board.get("best") and isinstance(board["best"], list) and len(board["best"]) > 1:
                row["book"] = board["best"][1]  # Book letter
        players_out[pid] = row

    out = {
        "updated": meta.get("updated"),
        "built": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ"),
        "built_et": datetime.now(ET).strftime("%Y-%m-%d %-I:%M %p ET"),
        "week": cfb.get("week"),
        "method": "RB average rush attempts × opponent rush yards allowed per rush attempt",
        "scope": "Running backs only. Rushing QBs omitted in this preview.",
        "note": "Display-only matchup layer. Does not replace Sports Labs rush-yards projection or change picks.",
        "coverage": {
            "candidate_rbs": len(cand_ids),
            "shown": len(players_out),
            "hidden": dict(hidden),
            "rush_yds_props": len(props),
            "rush_yds_props_shown": sum(1 for a in by_aid if a in players_out),
            "defs_with_ypc": len(team_ypc),
        },
        "teams": team_ypc,
        "players": players_out,
    }
    with open(OUT, "w") as f:
        json.dump(out, f, separators=(",", ":"))
        f.write("\n")
    # sample Sheppard
    s = players_out.get("5164332")
    print("wrote", OUT, "shown", len(players_out), "hidden", dict(hidden), "sheppard", (s or {}).get("formula"))


if __name__ == "__main__":
    main()
