# CFB RB expected rush yards — LOCAL PREVIEW ONLY

Branch: `preview/cfb-rb-expected-yards`  
Formula: **RB avg rush attempts × opponent yards allowed per rush attempt**

Display-only. Does **not** replace Sports Labs rush-yards projection or change picks. Nothing pushed / not live.

## Preview

```sh
python3 scripts/build_rb_expected_rush.py
python3 -m unittest tests.test_rb_expected_rush -v
python3 -m http.server 8768 --bind 127.0.0.1
# Open players.html or props, open Nate Sheppard (Duke) → Expected rush yards card
```

## Data

- Snapshot: `data/meta.json` updated **2026-11-06 ~2:07 PM ET**, week 10
- Player attempts: mean of published per-game `car` in player files
- Opponent YPC: sum of published player-log rush yards allowed ÷ rush attempts faced (`car`/`ryd` against that defense); hidden if attempts faced &lt; 10

## Scope

Running backs only; rushing QBs omitted in this preview.
