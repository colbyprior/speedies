// ============================================================================
// warband-template.typ
// Reusable Typst template for the "Warband" tabletop-RPG character sheet.
// Recreates warbandsheet-v2 (A4 landscape, fillable-PDF original) as a
// data-driven Typst template: pass in dictionaries, get a populated sheet.
//
// Layout has fixed capacity, matching the source form: up to 6 heroes
// (3 rows x 2 cols) and up to 4 henchmen units (2 rows x 2 cols). Extra
// entries beyond that are ignored; fewer entries just leave blank cards.
//
// ---- warband-sheet() top-level fields (all optional strings) ----
//   player-name, warband-name, warband-type, faction, max-units, hero-slots,
//   stored-equipment, gold, rout-threshold, wins, losses
//
// ---- heroes: array of up to 6 dictionaries, keys (all optional) ----
//   name, type, deathtouched, blight
//   base-stats: dict with optional stat keys (mov, mel, rgd, def, agi,
//               mrl, atk, wnd, inj, prc)
//   advances: array of up to 2 dicts, same shape as base-stats
//             (fills the two tracking rows below Base)
//   special: array of strings, one per row — index 0 = Base row,
//            index 1 = advance row 1, index 2 = advance row 2
//
// ---- henchmen: array of up to 4 dictionaries, keys (all optional) ----
//   name, type, cap, blight, count
//   base-stats: dict with optional stat keys
//   advances: array of up to 3 dicts, same shape as base-stats
//             (fills the three tracking rows below Base)
//   special: array of strings — index 0 = Base, 1–3 = advance rows
//
// Usage (see warband-example.typ for a full worked example, or
// warband-blank.typ for a printable blank sheet):
//   #import "warband-template.typ": warband-sheet
//   #set page(paper: "a4", flipped: true, margin: (x: 0.6cm, y: 0.5cm))
//   #warband-sheet(
//     player-name: "...", warband-name: "...",
//     heroes: ((name: "...", mov: "...", ..), ..),
//     henchmen: ((name: "...", ..), ..),
//   )
// ============================================================================

// ---------- Visual constants (colour-matched to the source sheet) ----------
#let c-blue   = rgb("#D7E9F7")  // Heroes-side header / label tint
#let c-purple = rgb("#E3E0F1")  // Henchmen-side header / label tint
#let c-title  = rgb("#4989C8")  // "Heroes" / "Henchmen" section title
#let c-text   = rgb("#2C3034")  // label text colour
#let c-border = rgb("#BFBFBF")  // grid-line colour

#let stat-keys    = ("mov", "mel", "rgd", "def", "agi", "mrl", "atk", "wnd", "inj", "prc")
#let stat-labels  = ("Mov", "Mel", "Rgd", "Def", "Agi", "Mrl", "Atk", "Wnd", "Inj", "Prc")

// Shared column layout for hero/henchman cards: 1 label gutter + 10 stats + 1 wide notes column.
#let card-cols = (1.75fr,) + (1fr,) * 10 + (5.8fr,)

#let lbl(body) = text(weight: "bold", size: 5.2pt, fill: c-text)[#body]
#let val(body) = text(size: 6.5pt)[#body]
#let stat-val(body) = align(center + horizon)[#val(body)]

// ---------- Hero card ----------
// hero: dictionary with keys name, type, deathtouched, blight,
//       base-stats (dict with optional stat keys),
//       advances (array of up to 2 dicts, same shape as base-stats),
//       special (array of strings: index 0 = Base row, 1-2 = advance rows)
#let hero-card(hero: (:)) = {
  let h = (
    name: "", type: "", deathtouched: "", blight: "",
    base-stats: (:),
    advances: (),
    special: (),
    ..hero,
  )
  let bs  = h.base-stats
  let adv = h.advances + ((:),) * calc.max(0, 2 - h.advances.len())
  let sp  = h.special
  table(
    columns: card-cols,
    rows: (12.5pt, 14pt, 13pt, 13pt, 12.5pt, 15pt),
    stroke: 0.4pt + c-border,
    inset: 2pt,
    align: left + horizon,
    // Row 1: header labels
    table.cell(colspan: 4, fill: c-blue)[#lbl("Name")],
    table.cell(colspan: 4, fill: c-blue)[#lbl("Type")],
    table.cell(colspan: 2, fill: c-blue)[#lbl("Deathtouched")],
    table.cell(colspan: 1, fill: c-blue)[#lbl("Blight")],
    table.cell(fill: c-blue)[#lbl("Special")],
    // Row 2: value-entry cells — special[0]
    table.cell(colspan: 4)[#val(h.name)],
    table.cell(colspan: 4)[#val(h.type)],
    table.cell(colspan: 2)[#val(h.deathtouched)],
    table.cell(colspan: 1)[#val(h.blight)],
    table.cell()[#val(sp.at(0, default: ""))],
    // Row 3: stat header labels — special[1]
    table.cell()[],
    ..stat-labels.map(s => table.cell(fill: c-blue, align: center + horizon)[#lbl(s)]),
    table.cell()[#val(sp.at(1, default: ""))],
    // Row 4: Base row — special[2]
    table.cell(fill: c-blue)[#lbl("Base")],
    ..stat-keys.map(k => table.cell()[#stat-val(bs.at(k, default: ""))]),
    table.cell()[#val(sp.at(2, default: ""))],
    // Row 5: advance row 1 — special[3]
    table.cell()[],
    ..stat-keys.map(k => table.cell()[#stat-val(adv.at(0).at(k, default: ""))]),
    table.cell()[#val(sp.at(3, default: ""))],
    // Row 6: advance row 2 — special[4]
    table.cell()[],
    ..stat-keys.map(k => table.cell()[#stat-val(adv.at(1).at(k, default: ""))]),
    table.cell()[#val(sp.at(4, default: ""))],
  )
}

// ---------- Henchman card ----------
// henchman: dictionary with keys name, type, cap, blight, count,
//           base-stats (dict with optional stat keys),
//           advances (array of up to 3 dicts, same shape as base-stats),
//           special (array of strings: index 0 = Base row, 1-3 = advance rows)
#let henchman-card(henchman: (:)) = {
  let h = (
    name: "", type: "", cap: "", blight: "", count: "",
    base-stats: (:),
    advances: (),
    special: (),
    ..henchman,
  )
  let bs  = h.base-stats
  let adv = h.advances + ((:),) * calc.max(0, 3 - h.advances.len())
  let sp  = h.special
  table(
    columns: card-cols,
    rows: (10pt, 14pt, 13pt, 12.5pt, 12.5pt, 12.5pt, 18.5pt),
    stroke: 0.4pt + c-border,
    inset: 2pt,
    align: left + horizon,
    // Row 1: header labels, "Count" on the right
    table.cell(colspan: 4, fill: c-purple)[#lbl("Name")],
    table.cell(colspan: 4, fill: c-purple)[#lbl("Type")],
    table.cell(colspan: 1, fill: c-purple)[#lbl("Cap")],
    table.cell(colspan: 2, fill: c-purple)[#lbl("Blight")],
    table.cell(fill: c-purple)[#lbl("Count")],
    // Row 2: value-entry cells + Count value (no special cell — Count occupies that column)
    table.cell(colspan: 4)[#val(h.name)],
    table.cell(colspan: 4)[#val(h.type)],
    table.cell(colspan: 1)[#val(h.cap)],
    table.cell(colspan: 2)[#val(h.blight)],
    table.cell()[#val(h.count)],
    // Row 3: stat header labels, "Special" label on the right (header, not a data cell)
    table.cell()[],
    ..stat-labels.map(s => table.cell(fill: c-purple, align: center + horizon)[#lbl(s)]),
    table.cell(fill: c-purple)[#lbl("Special")],
    // Row 4: Base row — special[0] (topmost special data cell for henchmen)
    table.cell(fill: c-purple)[#lbl("Base")],
    ..stat-keys.map(k => table.cell()[#stat-val(bs.at(k, default: ""))]),
    table.cell()[#val(sp.at(0, default: ""))],
    // Row 5: advance row 1 — special[1]
    table.cell()[],
    ..stat-keys.map(k => table.cell()[#stat-val(adv.at(0).at(k, default: ""))]),
    table.cell()[#val(sp.at(1, default: ""))],
    // Row 6: advance row 2 — special[2]
    table.cell()[],
    ..stat-keys.map(k => table.cell()[#stat-val(adv.at(1).at(k, default: ""))]),
    table.cell()[#val(sp.at(2, default: ""))],
    // Row 7: advance row 3 — special[3]
    table.cell()[],
    ..stat-keys.map(k => table.cell()[#stat-val(adv.at(2).at(k, default: ""))]),
    table.cell()[#val(sp.at(3, default: ""))],
  )
}

// ---------- Full sheet ----------
#let warband-sheet(
  player-name: "", warband-name: "", warband-type: "", faction: "",
  max-units: "", hero-slots: "",
  stored-equipment: "", gold: "", rout-threshold: "", wins: "", losses: "",
  heroes: (), henchmen: (),
) = {
  set text(font: "Times New Roman", size: 6.5pt, fill: black)

  table(
    columns: (2fr, 2fr, 2fr, 2fr, 1fr, 1fr),
    rows: (11pt, 19pt, 11pt, 19pt),
    stroke: 0.4pt + c-border,
    inset: 2pt,
    align: left + horizon,
    table.cell(fill: c-blue)[#lbl("Player Name")],
    table.cell(fill: c-blue)[#lbl("Warband Name")],
    table.cell(fill: c-blue)[#lbl("Warband Type")],
    table.cell(fill: c-blue)[#lbl("Faction")],
    table.cell(fill: c-blue)[#lbl("Max Units")],
    table.cell(fill: c-blue)[#lbl("Hero Slots")],
    table.cell()[#val(player-name)],
    table.cell()[#val(warband-name)],
    table.cell()[#val(warband-type)],
    table.cell()[#val(faction)],
    table.cell()[#val(max-units)],
    table.cell()[#val(hero-slots)],
    table.cell(colspan: 2, fill: c-blue)[#lbl("Stored Equipment")],
    table.cell(fill: c-blue)[#lbl("Gold")],
    table.cell(fill: c-blue)[#lbl("Rout Threshold")],
    table.cell(fill: c-blue)[#lbl("Wins")],
    table.cell(fill: c-blue)[#lbl("Losses")],
    table.cell(colspan: 2)[#val(stored-equipment)],
    table.cell()[#val(gold)],
    table.cell()[#val(rout-threshold)],
    table.cell()[#val(wins)],
    table.cell()[#val(losses)],
  )

  v(6pt)
  align(center)[#text(weight: "bold", size: 9pt, fill: c-title)[Heroes]]
  v(2pt)

  let hero-slots-list = heroes + ((:),) * calc.max(0, 6 - heroes.len())
  grid(
    columns: (1fr, 1fr),
    column-gutter: 10pt,
    row-gutter: 0pt,
    ..hero-slots-list.slice(0, 6).map(h => hero-card(hero: h))
  )

  v(6pt)
  align(center)[#text(weight: "bold", size: 9pt, fill: c-title)[Henchmen]]
  v(2pt)

  let henchman-slots-list = henchmen + ((:),) * calc.max(0, 4 - henchmen.len())
  grid(
    columns: (1fr, 1fr),
    column-gutter: 10pt,
    row-gutter: 0pt,
    ..henchman-slots-list.slice(0, 4).map(h => henchman-card(henchman: h))
  )
}
