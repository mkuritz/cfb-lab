# Supported visual release — Nov6,2026

## Supported routes
- `matchup-analyzer.html?game=0`: existing units, model/book values, talent/SOS, recorded injury-adjusted RATINGS and actual native player files. No separate injury-adjusted betting-line estimator.
- `conference-map.html?conf=all`:138 stored power teams; modeled CFP/title outputs distinctly separate from posted AP ranks. Not official committee rankings.
- `game-flow.html?event=401859185`: HISTORICAL completed Notre Dame at Navy, Oct31,2026 noon ET, collected Nov6 at6:30:44 PM ET. Actual16 drives/131 probability observations transformed to14 ten-play mean/range bins,5 observed estimate swings and8 period/team drive aggregates. Axis is play order, not fabricated time; no lateral drive paths or inferred joins.
## Publication permission
Official terms opened Nov6,2026: https://collegefootballdata.com/terms (effective Aug12,2026), §§3–6 permit commercial independently transformed summaries/reasonable factual display and private caching. No raw response, bulk API mirror or key included. Attribution is optional under §6; trademark/likeness rights are not granted. Only a5.4KB single-game transformed summary is added. No supplemental138-team raw comparison file or new collection. No tier/free-access promises.

## Verification and limits
91 cross-hub DOM/runtime/data/identity/security assertions passed against these exact release worktrees. Run one hub independently with `NODE_PATH=/workspace/visual-preview-tests/node_modules node tests/supported_visual_release.cjs`; `jsdom` is required. Browser/local-port visual verification remains pending under sandbox policy; no layout screenshot or PDF inspection claimed. No firewall/proxy/tunnel/browser workaround used.

Initial40-file Aikido scan reported10 pre-existing template warnings in legacy CBB `players.html` (the only proposed change was a profile-entry script). That modification was removed entirely; native modal invocation now occurs directly from Matchup Duel. No warnings were ignored or rules suppressed. Final combined47-file scan:0 issues. Evidence is under `audit/supported-release-aikido-*.json`. The intermediate combined scan found prop-intel HTML rendering and a dynamic builder file read; both were replaced with DOM construction/fixed-path readers and rescanned successfully. No findings ignored. Existing native hub renderers were not globally security-audited.

No new ingestion, schedules, workflows, keys, paid access, pick weights or pricing changes in this release. Unsupported menus are absent rather than empty landing pages. Original hub nav/features remain; only additive supported entries.
