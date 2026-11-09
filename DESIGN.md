# Design

World: **NCR as a Metro network.** Every area is a station; each city owns a line colour. Evoke transit wayfinding; never copy any operator's logo, roundel or exact signage.

## Tokens (src/app/globals.css)

| Token | Value | Use |
|---|---|---|
| `ink` | #15171c | Text, primary buttons, hub stations |
| `paper` | #f4f5f2 | Section bands, filter panel, fact tiles |
| `board` | #111317 | Platform boards: match board, rent board, score chip |
| `amber` | #ffb81c | Numerals on boards only |
| `accent` / `accent-soft` | #1f5fd6 / #e9f0fd | Links, focus, info notices, hover of primary |
| `line-*` | yellow #f2b705, magenta #c4167c, blue #1f5fd6, green #1a8f4a, violet #6a3fb5, aqua #0a9cad | Map lines and city identity |

City → line (`CITY_LINE` in src/lib/options.ts): Delhi magenta, Gurugram yellow (text #9a7300 for contrast), Noida blue, Ghaziabad green, Faridabad violet.

## Type

- Display and UI labels: Overpass (signage sans), weights 600–900, tight tracking on headings.
- Body: Geist.
- All money, counts and scores use `tabular-nums`.

## Components (src/components)

- `MetroMap`: schematic map; stations link to `/browse?city=&area=` and show live post counts. Labels hide below 640px; city chips take over.
- `MatchLines`: two people as two lines; same habit = white interchange bar, one step apart = dashed, far apart = amber "different".
- `Station`: line stub + station dot + area/city; the heading of every post.
- `PostCard`, `ScoreBadge` (board chip, amber number), `KindTag`.
- Buttons are pills (`btn` ink, `btnGhost` outlined); inputs are rounded-2xl with 2px borders.

## Shape and depth

Pills and 24–32px radii; no 1px boxed cards. Cards use a soft offset shadow and lift 4px on hover. Dashed rules separate card sections.

## Motion

One authored moment: map lines draw along their paths (staggered), then stations pop in; a train dot rides the yellow line. Buttons scale to 0.97 on press. Everything respects `prefers-reduced-motion`.

## Browser surfaces

Yellow text selection, accent caret, accent focus ring (2px, 3px offset), accent checkboxes, thin neutral scrollbar.
