import { jsPDF } from 'jspdf'

// ── Constants ────────────────────────────────────────────────────────────────

const PT = 0.352778  // 1 typographic point in mm

// Colours matching warband-template.typ
const BLUE   = [215, 233, 247]
const PURPLE = [227, 224, 241]
const TITLE  = [73,  137, 200]
const TEXT   = [44,  48,  52 ]
const BORDER = [191, 191, 191]
const WHITE  = [255, 255, 255]
const PENCIL = [130, 130, 130]  // printed values that are meant to be written over

// Page: A4 landscape, margins x=0.6cm y=0.5cm
const MARGIN_X  = 6
const MARGIN_Y  = 5
const PAGE_W    = 297
const CONTENT_W = PAGE_W - 2 * MARGIN_X  // 285 mm

// Two-column card grid with 10pt gutter
const CARD_GUTTER = 10 * PT
const CARD_W      = (CONTENT_W - CARD_GUTTER) / 2

// Card columns: 2.6fr label | 10×1fr stats | 4.95fr special  (total 17.55fr)
// The label column is wide enough for combined rows like "Shield + Heavy Armour".
const TOTAL_FR = 2.6 + 10 + 4.95
const COL_L    = (2.6  / TOTAL_FR) * CARD_W
const COL_S    = (1    / TOTAL_FR) * CARD_W
const COL_SPEC = (4.95 / TOTAL_FR) * CARD_W

const STAT_KEYS   = ['mov','mel','rgd','def','agi','mrl','atk','wnd','inj','prc']
const STAT_LABELS = ['Mov','Mel','Rgd','Def','Agi','Mrl','Atk','Wnd','Inj','Prc']

// Card row heights in mm (converted from pt)
// Hero card: header / values / stat labels / base + 4 equipment rows
// (2 melee + 1 ranged + 1 armour). Heights are tuned to stay under the old 92.5pt
// total — the sheet is a fixed single-page layout with only ~3mm of slack. Rows
// holding 6.5pt text must be at least 11.2pt or drawText's padding check drops it.
const HERO_ROWS  = [10.5, 12, 10.5, 12, 11.5, 11.5, 11.5, 11.5].map(p => p * PT)
const HENCH_ROWS = [10, 14, 13, 12.5, 12.5, 12.5, 18.5].map(p => p * PT)
const HERO_H     = HERO_ROWS .reduce((a, b) => a + b, 0)
const HENCH_H    = HENCH_ROWS.reduce((a, b) => a + b, 0)

// ── Drawing primitives ───────────────────────────────────────────────────────

function setStroke(doc) {
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
  doc.setLineWidth(0.14)  // 0.4pt ≈ 0.14 mm
}

function drawText(doc, x, y, w, h, text, fontSize, bold, align = 'left', vAlign = 'middle', fit = false) {
  if (!text) return
  const pad   = 0.71  // 2pt inset
  doc.setFont('times', bold ? 'bold' : 'normal')
  doc.setFontSize(fontSize)

  // Single-line cells (equipment labels) shrink to fit rather than being clipped
  if (fit) {
    const avail = w - 2 * pad
    while (fontSize > 4 && doc.getTextWidth(String(text)) > avail) {
      fontSize = Math.round((fontSize - 0.2) * 10) / 10
      doc.setFontSize(fontSize)
    }
  }

  const lineH = fontSize * PT * 1.1
  doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])

  const lines    = doc.splitTextToSize(String(text), w - 2 * pad)
  const maxLines = vAlign === 'top' ? lines.length : Math.max(1, Math.floor(h / lineH))
  const shown    = lines.slice(0, maxLines)
  const blockH   = shown.length * lineH
  const startY   = vAlign === 'top'
    ? y + pad + lineH / 2
    : y + (h - blockH) / 2 + lineH / 2

  for (let i = 0; i < shown.length; i++) {
    const ty = startY + i * lineH
    if (ty + lineH / 2 > y + h - pad) break
    if (align === 'center') {
      doc.text(shown[i], x + w / 2, ty, { align: 'center', baseline: 'middle' })
    } else {
      doc.text(shown[i], x + pad, ty, { baseline: 'middle' })
    }
  }
}

function cell(doc, x, y, w, h, bg, text, fontSize, bold, align = 'left', vAlign = 'middle', fit = false) {
  doc.setFillColor(bg[0], bg[1], bg[2])
  setStroke(doc)
  doc.rect(x, y, w, h, 'FD')
  drawText(doc, x, y, w, h, text, fontSize, bold, align, vAlign, fit)
}

// Draw n small checkbox squares centred inside a cell. First `filled` are filled dark.
function drawCheckboxes(doc, x, y, w, h, n = 12, filled = 0) {
  const size = 2, gap = 0.5
  const totalW = n * size + (n - 1) * gap
  let bx = x + (w - totalW) / 2
  const by = y + (h - size) / 2
  for (let i = 0; i < n; i++) {
    if (i < filled) {
      doc.setFillColor(TEXT[0], TEXT[1], TEXT[2])
    } else {
      doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
    }
    setStroke(doc)
    doc.rect(bx, by, size, size, 'FD')
    bx += size + gap
  }
}

// ── Cards ────────────────────────────────────────────────────────────────────

function heroCard(doc, x, y, hero = {}) {
  const bs     = hero.base_stats     || {}
  const adv    = hero.advances       || []
  const sp     = hero.special_sheet  || hero.special || []
  const advLbl = hero.advance_labels || []
  const rh     = HERO_ROWS
  const specX  = x + COL_L + 10 * COL_S
  let ry = y

  // Row 1: Name / Type / Deathtouched / Blight / Special  (label headers)
  cell(doc, x,                   ry, COL_L + 3*COL_S, rh[0], BLUE, 'Name',         5.2, true)
  cell(doc, x + COL_L + 3*COL_S, ry, 4*COL_S,         rh[0], BLUE, 'Type',         5.2, true)
  cell(doc, x + COL_L + 7*COL_S, ry, 2*COL_S,         rh[0], BLUE, 'Deathtouched', 5.2, true)
  cell(doc, x + COL_L + 9*COL_S, ry, COL_S,           rh[0], BLUE, 'Blight',       5.2, true)
  cell(doc, specX,                ry, COL_SPEC,        rh[0], BLUE, 'Special',      5.2, true)
  ry += rh[0]

  // Merged special cell spanning rows 2–8, top-aligned
  const specH    = rh.slice(1).reduce((a, b) => a + b, 0)
  const specText = (Array.isArray(sp) ? sp : [sp]).filter(Boolean).join('\n')
  cell(doc, specX, ry, COL_SPEC, specH, WHITE, specText, 6.5, false, 'left', 'top')

  // Row 2: Name/Type/Deathtouched/Blight values
  cell(doc, x,                   ry, COL_L + 3*COL_S, rh[1], WHITE, hero.name         || '', 6.5, false)
  cell(doc, x + COL_L + 3*COL_S, ry, 4*COL_S,         rh[1], WHITE, hero.type         || '', 6.5, false)
  cell(doc, x + COL_L + 7*COL_S, ry, 2*COL_S,         rh[1], WHITE, hero.deathtouched || '', 6.5, false)
  cell(doc, x + COL_L + 9*COL_S, ry, COL_S,           rh[1], WHITE, hero.blight       || '', 6.5, false)
  ry += rh[1]

  // Row 3: stat header labels
  cell(doc, x, ry, COL_L, rh[2], WHITE, '', 5.2, false)
  let rx = x + COL_L
  for (let i = 0; i < STAT_KEYS.length; i++) {
    cell(doc, rx, ry, COL_S, rh[2], BLUE, STAT_LABELS[i], 5.2, true, 'center')
    rx += COL_S
  }
  ry += rh[2]

  // Row 4: Base stats
  cell(doc, x, ry, COL_L, rh[3], BLUE, 'Base', 5.2, true)
  rx = x + COL_L
  for (let i = 0; i < STAT_KEYS.length; i++) {
    cell(doc, rx, ry, COL_S, rh[3], WHITE, bs[STAT_KEYS[i]] || '', 6.5, false, 'center')
    rx += COL_S
  }
  ry += rh[3]

  // Rows 5–8: equipment rows (2 melee slots + 1 ranged + 1 armour)
  for (let a = 0; a < 4; a++) {
    const advData = adv[a] || {}
    cell(doc, x, ry, COL_L, rh[4 + a], WHITE, advLbl[a] || '', 5.2, false, 'left', 'middle', true)
    rx = x + COL_L
    for (let i = 0; i < STAT_KEYS.length; i++) {
      cell(doc, rx, ry, COL_S, rh[4 + a], WHITE, advData[STAT_KEYS[i]] || '', 6.5, false, 'center')
      rx += COL_S
    }
    ry += rh[4 + a]
  }
}

function henchmanCard(doc, x, y, henchman = {}) {
  const bs     = henchman.base_stats     || {}
  const adv    = henchman.advances       || []
  const sp     = henchman.special_sheet  || henchman.special || []
  const advLbl = henchman.advance_labels || []
  const rh     = HENCH_ROWS
  const specX  = x + COL_L + 10 * COL_S
  let ry = y

  // Row 1: Name / Type / Cap / Blight / Count  (label headers, PURPLE)
  cell(doc, x,                   ry, COL_L + 3*COL_S, rh[0], PURPLE, 'Name',   5.2, true)
  cell(doc, x + COL_L + 3*COL_S, ry, 4*COL_S,         rh[0], PURPLE, 'Type',   5.2, true)
  cell(doc, x + COL_L + 7*COL_S, ry, COL_S,           rh[0], PURPLE, 'Cap',    5.2, true)
  cell(doc, x + COL_L + 8*COL_S, ry, 2*COL_S,         rh[0], PURPLE, 'Blight', 5.2, true)
  cell(doc, specX,                ry, COL_SPEC,        rh[0], PURPLE, 'Count',  5.2, true)
  ry += rh[0]

  // Row 2: values + count
  cell(doc, x,                   ry, COL_L + 3*COL_S, rh[1], WHITE, henchman.name   || '', 6.5, false)
  cell(doc, x + COL_L + 3*COL_S, ry, 4*COL_S,         rh[1], WHITE, henchman.type   || '', 6.5, false)
  cell(doc, x + COL_L + 7*COL_S, ry, COL_S,           rh[1], WHITE, henchman.cap    || '', 6.5, false)
  cell(doc, x + COL_L + 8*COL_S, ry, 2*COL_S,         rh[1], WHITE, henchman.blight || '', 6.5, false)
  cell(doc, specX,                ry, COL_SPEC,        rh[1], WHITE, henchman.count  || '', 6.5, false)
  ry += rh[1]

  // Row 3: stat header labels + Special header label (PURPLE)
  cell(doc, x, ry, COL_L, rh[2], WHITE, '', 5.2, false)
  let rx = x + COL_L
  for (let i = 0; i < STAT_KEYS.length; i++) {
    cell(doc, rx, ry, COL_S, rh[2], PURPLE, STAT_LABELS[i], 5.2, true, 'center')
    rx += COL_S
  }
  cell(doc, specX, ry, COL_SPEC, rh[2], PURPLE, 'Special', 5.2, true)
  ry += rh[2]

  // Merged special cell spanning rows 4–7, top-aligned
  const specH    = rh[3] + rh[4] + rh[5] + rh[6]
  const specText = (Array.isArray(sp) ? sp : [sp]).filter(Boolean).join('\n')
  cell(doc, specX, ry, COL_SPEC, specH, WHITE, specText, 6.5, false, 'left', 'top')

  // Row 4: Base stats
  cell(doc, x, ry, COL_L, rh[3], PURPLE, 'Base', 5.2, true)
  rx = x + COL_L
  for (let i = 0; i < STAT_KEYS.length; i++) {
    cell(doc, rx, ry, COL_S, rh[3], WHITE, bs[STAT_KEYS[i]] || '', 6.5, false, 'center')
    rx += COL_S
  }
  ry += rh[3]

  // Rows 5–7: weapon rows
  for (let a = 0; a < 3; a++) {
    const advData = adv[a] || {}
    cell(doc, x, ry, COL_L, rh[4 + a], WHITE, advLbl[a] || '', 5.2, false, 'left', 'middle', true)
    rx = x + COL_L
    for (let i = 0; i < STAT_KEYS.length; i++) {
      cell(doc, rx, ry, COL_S, rh[4 + a], WHITE, advData[STAT_KEYS[i]] || '', 6.5, false, 'center')
      rx += COL_S
    }
    ry += rh[4 + a]
  }
}

// ── Section title ────────────────────────────────────────────────────────────

function sectionTitle(doc, y, label) {
  // v(6pt) gap, then 9pt bold title, then v(2pt) gap
  y += 6 * PT
  doc.setFont('times', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(TITLE[0], TITLE[1], TITLE[2])
  doc.text(label, MARGIN_X + CONTENT_W / 2, y + (9 * PT) / 2, { align: 'center', baseline: 'middle' })
  return y + 9 * PT + 2 * PT
}

// ── Reference page ───────────────────────────────────────────────────────────

const REF_GUTTER = 8                    // mm between the two reference columns
const REF_COL_W  = (CONTENT_W - REF_GUTTER) / 2  // ~138.5mm each
const REF_LINE_H = 6.5 * PT * 1.2      // ~2.75mm per text line
const REF_TITLE_H = 7 * PT + 2         // ~4.47mm section title block height

function addReferencePage(doc, data) {
  const sections = []
  if (data.skills?.length)
    sections.push({ title: 'Skills Reference', entries: data.skills })
  if (data.ranged_properties?.length)
    sections.push({ title: 'Ranged Properties', entries: data.ranged_properties })
  if (data.special_rules?.length)
    sections.push({ title: 'Special Rules', entries: data.special_rules })
  for (const t of (data.spell_tables || [])) {
    if (t.spells?.length)
      sections.push({
        title: t.school,
        entries: t.spells.map(s => ({ name: `${s.name} (${s.check})`, desc: s.description })),
      })
  }

  if (!sections.length) return

  doc.addPage()

  const colXs = [MARGIN_X, MARGIN_X + REF_COL_W + REF_GUTTER]
  const maxY  = 210 - MARGIN_Y
  let col = 0
  let y   = MARGIN_Y

  // Advance y by h; overflow into next column if needed. Returns false if no room left.
  function advance(h) {
    if (y + h <= maxY) return true
    if (col < colXs.length - 1) { col++; y = MARGIN_Y; return true }
    return false
  }

  for (const section of sections) {
    if (!advance(REF_TITLE_H + 2 * REF_LINE_H)) break

    doc.setFont('times', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(TITLE[0], TITLE[1], TITLE[2])
    doc.text(section.title, colXs[col], y + REF_TITLE_H / 2, { baseline: 'middle' })
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    y += REF_TITLE_H

    for (const entry of section.entries) {
      if (!advance(REF_LINE_H)) break

      // Entry name (bold)
      doc.setFont('times', 'bold')
      doc.setFontSize(6.5)
      doc.text(entry.name, colXs[col], y + REF_LINE_H / 2, { baseline: 'middle' })
      y += REF_LINE_H

      // Description (normal, 4mm indent)
      if (entry.desc) {
        doc.setFont('times', 'normal')
        const lines = doc.splitTextToSize(String(entry.desc), REF_COL_W - 4)
        for (const line of lines) {
          if (!advance(REF_LINE_H)) break
          doc.text(line, colXs[col] + 4, y + REF_LINE_H / 2, { baseline: 'middle' })
          y += REF_LINE_H
        }
      }

      y += 0.7  // gap between entries
    }

    y += 3  // gap between sections
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Build a jsPDF document replicating the warband-template.typ layout.
 * data shape matches buildPDFPayload() output in main.js.
 */
export function generateWarbandPDF(data) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  doc.setFont('times', 'normal')

  let y = MARGIN_Y

  // ── Header table ──────────────────────────────────────────────────────────
  // 7 columns: Player Name | Warband Name | Warband Type | Max Units | Hero Slots | Aligned Neutral Heroes | Neutral Hero Progression
  const hFr   = [3, 4, 4, 1.5, 1.5, 2.5, 4]
  const hTot  = hFr.reduce((a, b) => a + b, 0)
  const hCols = hFr.map(f => (f / hTot) * CONTENT_W)
  const hRows = [11, 19, 11, 19].map(p => p * PT)

  // Row 1: labels
  const r1Labels = ['Player Name','Warband Name','Warband Type','Max Units','Hero Slots','Aligned Neutral Heroes','Neutral Hero Progression']
  let rx = MARGIN_X
  for (let i = 0; i < 7; i++) {
    cell(doc, rx, y, hCols[i], hRows[0], BLUE, r1Labels[i], 5.2, true)
    rx += hCols[i]
  }

  const nh = data.neutral_heroes || [{}, {}, {}]

  // Row 2: values (cols 0–4) + NH hero 1 name (col 5) + NH hero 1 progress (col 6)
  rx = MARGIN_X
  const r2Vals = [data.player_name||'', data.warband_name||'', data.warband_type||'', data.max_units||'', data.hero_slots||'']
  for (let i = 0; i < 5; i++) {
    cell(doc, rx, y + hRows[0], hCols[i], hRows[1], WHITE, r2Vals[i], 6.5, false)
    rx += hCols[i]
  }
  cell(doc, rx, y + hRows[0], hCols[5], hRows[1], WHITE, nh[0]?.name || '', 6.5, false)
  rx += hCols[5]
  cell(doc, rx, y + hRows[0], hCols[6], hRows[1], WHITE, '', 6.5, false)
  drawCheckboxes(doc, rx, y + hRows[0], hCols[6], hRows[1], 12, nh[0]?.progress || 0)

  // Row 3: labels (cols 0–4) + NH hero 2 name (col 5) + NH hero 2 progress (col 6)
  const r3y = y + hRows[0] + hRows[1]
  rx = MARGIN_X
  const r3Labels = ['Stored Equipment','Rout Threshold','Gold','Wins','Losses']
  for (let i = 0; i < 5; i++) {
    cell(doc, rx, r3y, hCols[i], hRows[2], BLUE, r3Labels[i], 5.2, true)
    rx += hCols[i]
  }
  cell(doc, rx, r3y, hCols[5], hRows[2], WHITE, nh[1]?.name || '', 5.2, false)
  rx += hCols[5]
  cell(doc, rx, r3y, hCols[6], hRows[2], WHITE, '', 5.2, false)
  drawCheckboxes(doc, rx, r3y, hCols[6], hRows[2], 12, nh[1]?.progress || 0)

  // Row 4: values (cols 0–4) + NH hero 3 name (col 5) + NH hero 3 progress (col 6)
  const r4y = r3y + hRows[2]
  rx = MARGIN_X
  const r4Vals = [data.stored_equipment||'', data.rout_threshold||'', data.gold||'', data.wins||'', data.losses||'']
  for (let i = 0; i < 5; i++) {
    cell(doc, rx, r4y, hCols[i], hRows[3], WHITE, r4Vals[i], 6.5, false)
    rx += hCols[i]
  }
  cell(doc, rx, r4y, hCols[5], hRows[3], WHITE, nh[2]?.name || '', 6.5, false)
  rx += hCols[5]
  cell(doc, rx, r4y, hCols[6], hRows[3], WHITE, '', 6.5, false)
  drawCheckboxes(doc, rx, r4y, hCols[6], hRows[3], 12, nh[2]?.progress || 0)

  y = r4y + hRows[3]

  // ── Heroes section ────────────────────────────────────────────────────────
  y = sectionTitle(doc, y, 'Heroes')

  const heroSlots = (data.heroes || []).concat(
    Array(Math.max(0, 6 - (data.heroes || []).length)).fill({}),
  )
  for (let row = 0; row < 3; row++) {
    heroCard(doc, MARGIN_X,                        y, heroSlots[row * 2]     || {})
    heroCard(doc, MARGIN_X + CARD_W + CARD_GUTTER, y, heroSlots[row * 2 + 1] || {})
    y += HERO_H
  }

  // ── Henchmen section ──────────────────────────────────────────────────────
  y = sectionTitle(doc, y, 'Henchmen')

  const henchSlots = (data.henchmen || []).concat(
    Array(Math.max(0, 4 - (data.henchmen || []).length)).fill({}),
  )
  for (let row = 0; row < 2; row++) {
    henchmanCard(doc, MARGIN_X,                        y, henchSlots[row * 2]     || {})
    henchmanCard(doc, MARGIN_X + CARD_W + CARD_GUTTER, y, henchSlots[row * 2 + 1] || {})
    y += HENCH_H
  }

  addReferencePage(doc, data)

  return doc
}

// ── Card-format PDF export ────────────────────────────────────────────────────
//
// Layout: 3×3 grid of 63×88mm poker-sized cards on A4 portrait.
// Cut guides are drawn as thin dashed lines between cards.

const CC_W    = 63    // card width mm
const CC_H    = 88    // card height mm
const CC_COLS = 3
const CC_ROWS = 3
const CC_ML   = (210 - CC_COLS * CC_W) / 2   // 10.5mm left margin
const CC_MT   = (297 - CC_ROWS * CC_H) / 2   // 16.5mm top margin
const CC_PAD  = 2.5   // inner horizontal/vertical padding mm

// Stat col width for 10-column stat rows (warband sheet)
const CC_SC = CC_W / 10

// Card stats: one 10-column grid shared by the base row and every equipment row,
// so a column can be read straight down to compare base against modified values.
// Same order and columns as the warband sheet's STAT_KEYS.
const CC_STAT_KEYS   = ['mov', 'mel', 'rgd', 'def', 'agi', 'mrl', 'atk', 'wnd', 'inj', 'prc']
const CC_STAT_LABELS = ['Mov', 'Mel', 'Rgd', 'Def', 'Agi', 'Mrl', 'Atk', 'Wnd', 'Inj', 'Prc']
const CC_STAT_COL    = CC_W / CC_STAT_KEYS.length   // 6.3mm

// Type sizes for the stat grid. Labels at 6pt leave ~1.9mm of slack in a column;
// values at 8pt are the largest that sit comfortably in CC_VAL_H.
const CC_LBL_FS = 6
const CC_VAL_FS = 8
const CC_LBL_H  = 3.4   // header / equipment-name bar
const CC_VAL_H  = 4.4   // value row

// ── Card palette ──────────────────────────────────────────────────────────────
//
// Cards only — the warband sheet keeps the original palette, since a full-page
// tinted fill costs far more ink than a few cut-out cards.
//
// The look is built from paper tone, weight and rule, not from dark fills:
// reversing 6pt type out of a solid is unreadable on a home printer, and the
// pencil write-in mode needs cells light enough to take graphite.

const CC_PAPER = [255, 255, 255]  // white stock — cheapest to print, no flat tint
const CC_FIELD = [255, 255, 255]  // value cells
const CC_INK   = [26,  24,  22 ]  // warm near-black
const CC_HAIR  = [166, 160, 152]  // hairline rules
const CC_BONE  = [238, 234, 226]  // type reversed out of the ink band

// Accents must stay readable as a thin rule against CC_INK, so none of them can
// sit too close to it in value — that rule is the main hero/henchman tell.
const CC_OXBLOOD = [122, 32,  26 ]  // heroes — dried blood
const CC_IRON    = [108, 116, 118]  // henchmen — weathered steel
const CC_SLATE   = [92,  102, 122]  // warband + spell cards

// Accent washed into the paper: ~35% for column headers, ~18% for name bars
function ccWash(accent, amount) {
  return accent.map((c, i) => Math.round(c * amount + CC_PAPER[i] * (1 - amount)))
}
function ccPalette(accent) {
  return { accent, head: ccWash(accent, 0.35), bar: ccWash(accent, 0.18) }
}

function ccStroke(doc) {
  doc.setDrawColor(CC_HAIR[0], CC_HAIR[1], CC_HAIR[2])
  doc.setLineWidth(0.12)
}

// ── Warband sigils ────────────────────────────────────────────────────────────
//
// Heraldic marks drawn as flat polygons in a 0..1 box (y down), so they stay
// crisp at any size and add nothing to the file. Deliberately blunt silhouettes:
// they have to read at ~5mm on the card banner.
//
//   fill/parts — filled in the foreground colour
//   cut        — drawn back in the background colour (eye sockets, a leaf midrib)
//   circles    — [cx, cy, r] in the same 0..1 space

// A bar of `len`×`wid` centred at (cx,cy), rotated by `ang` radians
function ccBar(cx, cy, len, wid, ang) {
  const c = Math.cos(ang), s = Math.sin(ang)
  const hx = c * len / 2, hy = s * len / 2
  const wx = -s * wid / 2, wy = c * wid / 2
  return [[cx - hx - wx, cy - hy - wy], [cx + hx - wx, cy + hy - wy],
          [cx + hx + wx, cy + hy + wy], [cx - hx + wx, cy - hy + wy]]
}

// Blade, crossguard and pommel along one diagonal
function ccSword(ang) {
  const c = Math.cos(ang), s = Math.sin(ang)
  return [ccBar(0.5 + c * 0.06, 0.5 + s * 0.06, 0.82, 0.10, ang),
          ccBar(0.5 - c * 0.10, 0.5 - s * 0.10, 0.11, 0.34, ang),
          ccBar(0.5 - c * 0.42, 0.5 - s * 0.42, 0.11, 0.15, ang)]
}

// `n` triangular rays on the diagonals, for a radiant cross
function ccRays(n, r0, r1, w) {
  const out = []
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 4 + i * Math.PI / 2
    out.push([[0.5 + r0 * Math.cos(a - w), 0.5 + r0 * Math.sin(a - w)],
              [0.5 + r1 * Math.cos(a),     0.5 + r1 * Math.sin(a)],
              [0.5 + r0 * Math.cos(a + w), 0.5 + r0 * Math.sin(a + w)]])
  }
  return out
}

const CC_STAR8 = (() => {
  const p = []
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 8, r = i % 2 ? 0.16 : 0.5
    p.push([0.5 + r * Math.cos(a), 0.5 + r * Math.sin(a)])
  }
  return p
})()

const CC_SIGILS = {
  // skull
  'Undead': {
    fill: [[0.20,0.34],[0.26,0.12],[0.40,0.03],[0.60,0.03],[0.74,0.12],[0.80,0.34],[0.78,0.55],
           [0.66,0.64],[0.66,0.80],[0.58,0.88],[0.42,0.88],[0.34,0.80],[0.34,0.64],[0.22,0.55]],
    cut: [[[0.28,0.34],[0.42,0.34],[0.40,0.50],[0.30,0.50]],
          [[0.72,0.34],[0.58,0.34],[0.60,0.50],[0.70,0.50]],
          [[0.50,0.50],[0.56,0.62],[0.44,0.62]]],
  },
  // eight-pointed star
  'Cultists': { fill: CC_STAR8 },
  // anvil
  'Dwarves': {
    fill: [[0.10,0.30],[0.34,0.30],[0.30,0.20],[0.62,0.20],[0.90,0.32],[0.72,0.44],[0.62,0.44],
           [0.62,0.62],[0.78,0.78],[0.78,0.90],[0.22,0.90],[0.22,0.78],[0.38,0.62],[0.38,0.44],[0.14,0.44]],
  },
  // crossed swords
  'Sellswords': { parts: [...ccSword(-Math.PI / 4), ...ccSword(-3 * Math.PI / 4)] },
  // shield charged with a cross
  'Paladins': {
    fill: [[0.14,0.06],[0.86,0.06],[0.86,0.46],[0.50,0.94],[0.14,0.46]],
    cut: [[[0.44,0.16],[0.56,0.16],[0.56,0.32],[0.72,0.32],[0.72,0.44],[0.56,0.44],
           [0.56,0.72],[0.44,0.72],[0.44,0.44],[0.28,0.44],[0.28,0.32],[0.44,0.32]]],
  },
  // radiant cross
  'Inquisitors': {
    fill: [[0.45,0.04],[0.55,0.04],[0.58,0.28],[0.80,0.31],[0.80,0.41],[0.58,0.44],[0.55,0.96],
           [0.45,0.96],[0.42,0.44],[0.20,0.41],[0.20,0.31],[0.42,0.28]],
    parts: ccRays(4, 0.13, 0.42, 0.26),
  },
  // bat
  'Vampires': {
    fill: [[0.02,0.32],[0.20,0.26],[0.36,0.34],[0.40,0.15],[0.46,0.30],[0.50,0.23],[0.54,0.30],
           [0.60,0.15],[0.64,0.34],[0.80,0.26],[0.98,0.32],[0.86,0.58],[0.78,0.46],[0.66,0.64],
           [0.60,0.50],[0.50,0.76],[0.40,0.50],[0.34,0.64],[0.22,0.46],[0.14,0.58]],
  },
  // leaf
  'Wood Elves': {
    fill: [[0.50,0.02],[0.74,0.24],[0.82,0.54],[0.50,0.96],[0.18,0.54],[0.26,0.24]],
    cut: [[[0.485,0.22],[0.515,0.22],[0.515,0.90],[0.485,0.90]]],
  },
  // rat in profile
  'Ratlings': {
    fill: [[0.03,0.63],[0.13,0.54],[0.25,0.46],[0.40,0.41],[0.56,0.39],[0.70,0.44],[0.80,0.54],
           [0.84,0.66],[0.74,0.75],[0.56,0.78],[0.38,0.77],[0.22,0.72],[0.10,0.68]],
    parts: [[[0.82,0.60],[0.92,0.46],[0.97,0.28],[0.92,0.26],[0.86,0.44],[0.78,0.56]]],
    circles: [[0.34,0.36,0.115]],
    cut: [[[0.15,0.58],[0.21,0.58],[0.21,0.63],[0.15,0.63]]],
  },
}

function ccSigil(warbandType) {
  return CC_SIGILS[String(warbandType || '').trim()] || null
}

function ccPoly(doc, pts, x, y, size, mirror = false) {
  const abs = pts.map(([px, py]) => [x + (mirror ? 1 - px : px) * size, y + py * size])
  const deltas = abs.slice(1).map(([px, py], i) => [px - abs[i][0], py - abs[i][1]])
  doc.lines(deltas, abs[0][0], abs[0][1], [1, 1], 'F', true)
}

// Draw a sigil in `size` mm with its top-left at (x, y). `bg` paints the cut-outs.
function ccDrawSigil(doc, sigil, x, y, size, fg, bg, mirror = false) {
  if (!sigil) return
  const mx = cx => mirror ? 1 - cx : cx
  doc.setFillColor(fg[0], fg[1], fg[2])
  if (sigil.fill) ccPoly(doc, sigil.fill, x, y, size, mirror)
  for (const p of (sigil.parts || [])) ccPoly(doc, p, x, y, size, mirror)
  for (const [cx, cy, r] of (sigil.circles || [])) doc.circle(x + mx(cx) * size, y + cy * size, r * size, 'F')
  doc.setFillColor(bg[0], bg[1], bg[2])
  for (const c of (sigil.cut || [])) ccPoly(doc, c, x, y, size, mirror)
}

// ── Card primitives ───────────────────────────────────────────────────────────

// Paper stock, a heavy ink frame, and an inset hairline keyline
function ccBorder(doc, x, y) {
  doc.setFillColor(CC_PAPER[0], CC_PAPER[1], CC_PAPER[2])
  doc.setDrawColor(CC_INK[0], CC_INK[1], CC_INK[2])
  doc.setLineWidth(0.5)
  doc.rect(x, y, CC_W, CC_H, 'FD')

  const inset = 1.1
  doc.setDrawColor(CC_HAIR[0], CC_HAIR[1], CC_HAIR[2])
  doc.setLineWidth(0.12)
  doc.rect(x + inset, y + inset, CC_W - 2 * inset, CC_H - 2 * inset, 'D')
}

// Solid ink band with the name reversed out in letter-spaced caps, closed by a
// rule in the unit's accent colour
// The accent rule sits inside `h` so every caller's existing offsets still hold.
// `sigil` (optional) is mirrored either side of the title, heraldry-style.
function ccHeader(doc, x, y, text, accent, h = 8, sigil = null) {
  const rule = 0.8
  const band = h - rule

  doc.setFillColor(CC_INK[0], CC_INK[1], CC_INK[2])
  doc.rect(x, y, CC_W, band, 'F')

  let avail = CC_W - 2 * CC_PAD - 2
  if (sigil) {
    const sz = Math.min(band - 1.2, 5.6)
    const sy = y + (band - sz) / 2
    ccDrawSigil(doc, sigil, x + CC_PAD, sy, sz, CC_BONE, CC_INK)
    ccDrawSigil(doc, sigil, x + CC_W - CC_PAD - sz, sy, sz, CC_BONE, CC_INK, true)  // faces inward
    avail -= 2 * (sz + 1.6)
  }

  const CS = 0.4
  doc.setFont('times', 'bold')
  doc.setTextColor(CC_BONE[0], CC_BONE[1], CC_BONE[2])
  doc.setCharSpace(CS)
  const label = String(text || '—').toUpperCase()
  // Shrink rather than clip — the sigils leave a narrow slot for long names.
  // getTextWidth ignores char spacing, so add it back or the title runs long.
  const widthOf = t => doc.getTextWidth(t) + CS * Math.max(0, t.length - 1)
  let fs = 8
  doc.setFontSize(fs)
  while (fs > 5 && widthOf(label) > avail) {
    fs = Math.round((fs - 0.2) * 10) / 10
    doc.setFontSize(fs)
  }
  // align:'center' also ignores char spacing and would drift the title right,
  // into the second sigil — so centre it manually on the spaced width
  const shown = doc.splitTextToSize(label, avail)[0]
  doc.text(shown, x + (CC_W - widthOf(shown)) / 2, y + band / 2, { baseline: 'middle' })
  doc.setCharSpace(0)

  doc.setFillColor(accent[0], accent[1], accent[2])
  doc.rect(x, y + band, CC_W, rule, 'F')
  return y + h
}

function ccText(doc, x, y, text, fontSize, bold, color) {
  doc.setFont('times', bold ? 'bold' : 'normal')
  doc.setFontSize(fontSize)
  doc.setTextColor((color || CC_INK)[0], (color || CC_INK)[1], (color || CC_INK)[2])
  doc.text(String(text), x, y, { baseline: 'middle' })
}

function ccStatLabelRow(doc, x, y, h, color) {
  const bg = color || BLUE
  for (let i = 0; i < STAT_KEYS.length; i++) {
    doc.setFillColor(bg[0], bg[1], bg[2])
    ccStroke(doc)
    doc.rect(x + i * CC_SC, y, CC_SC, h, 'FD')
    doc.setFont('times', 'bold')
    doc.setFontSize(4.5)
    doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
    doc.text(STAT_LABELS[i], x + i * CC_SC + CC_SC / 2, y + h / 2, { align: 'center', baseline: 'middle' })
  }
}

function ccStatValueRow(doc, x, y, h, stats) {
  for (let i = 0; i < STAT_KEYS.length; i++) {
    const val = stats[STAT_KEYS[i]] || ''
    doc.setFillColor(CC_FIELD[0], CC_FIELD[1], CC_FIELD[2])
    ccStroke(doc)
    doc.rect(x + i * CC_SC, y, CC_SC, h, 'FD')
    doc.setFont('times', 'normal')
    doc.setFontSize(5.5)
    doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
    doc.text(String(val || '—'), x + i * CC_SC + CC_SC / 2, y + h / 2, { align: 'center', baseline: 'middle' })
  }
}

// One row of the 10-column stat grid. `blankEmpty` leaves a cell empty rather
// than printing an em dash — used by equipment rows, which only fill the stats
// they change and read their column headers from the base row above.
function ccStatRow(doc, x, cy, stats, blankEmpty, textColor) {
  const col = textColor || TEXT
  for (let i = 0; i < CC_STAT_KEYS.length; i++) {
    doc.setFillColor(CC_FIELD[0], CC_FIELD[1], CC_FIELD[2])
    ccStroke(doc)
    doc.rect(x + i * CC_STAT_COL, cy, CC_STAT_COL, CC_VAL_H, 'FD')
    const val = stats[CC_STAT_KEYS[i]] || ''
    if (!val && blankEmpty) continue
    doc.setFont('times', 'normal')
    doc.setFontSize(CC_VAL_FS)
    doc.setTextColor(col[0], col[1], col[2])
    doc.text(String(val || '—'), x + i * CC_STAT_COL + CC_STAT_COL / 2, cy + CC_VAL_H / 2,
             { align: 'center', baseline: 'middle' })
  }
  return cy + CC_VAL_H
}

// An empty row on the stat grid, for writing current values in by hand
function ccBlankStatRow(doc, x, cy) {
  return ccStatRow(doc, x, cy, {}, true)
}

// Stat grid header: the column labels, drawn once per card above the base row
function ccStatHeader(doc, x, cy, headerColor) {
  for (let i = 0; i < CC_STAT_LABELS.length; i++) {
    doc.setFillColor(headerColor[0], headerColor[1], headerColor[2])
    ccStroke(doc)
    doc.rect(x + i * CC_STAT_COL, cy, CC_STAT_COL, CC_LBL_H, 'FD')
    doc.setFont('times', 'bold')
    doc.setFontSize(CC_LBL_FS)
    doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
    doc.text(CC_STAT_LABELS[i], x + i * CC_STAT_COL + CC_STAT_COL / 2, cy + CC_LBL_H / 2,
             { align: 'center', baseline: 'middle' })
  }
  return cy + CC_LBL_H
}

// Equipment row: tinted full-width name bar + a value row on the shared grid
function ccWeaponHoriz(doc, x, cy, label, advStats, headerColor, valueColor) {
  doc.setFillColor(headerColor[0], headerColor[1], headerColor[2])
  ccStroke(doc)
  doc.rect(x, cy, CC_W, CC_LBL_H, 'FD')
  doc.setFont('times', 'bold')
  doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
  // Only one line fits in the bar, so shrink rather than clip a long combined label
  const avail = CC_W - 2 * CC_PAD
  let fs = CC_LBL_FS
  doc.setFontSize(fs)
  while (fs > 4.5 && doc.getTextWidth(String(label)) > avail) {
    fs = Math.round((fs - 0.2) * 10) / 10
    doc.setFontSize(fs)
  }
  doc.text(doc.splitTextToSize(label, avail)[0], x + CC_PAD, cy + CC_LBL_H / 2, { baseline: 'middle' })
  cy += CC_LBL_H

  return ccStatRow(doc, x, cy, advStats, true, valueColor)
}

// Weapon displayed as two rows matching the warband sheet style:
//   Row 1: tinted label bar with weapon name
//   Row 2: 11 stat columns showing modified values (blank = unchanged)
// Returns the new cy after both rows.
function ccWeaponRows(doc, x, cy, label, stats, headerColor) {
  const labelH = 3.5
  const statsH = 4.0

  // Label bar
  doc.setFillColor(headerColor[0], headerColor[1], headerColor[2])
  ccStroke(doc)
  doc.rect(x, cy, CC_W, labelH, 'FD')
  doc.setFont('times', 'bold')
  doc.setFontSize(5)
  doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
  const labelLines = doc.splitTextToSize(label || '', CC_W - 2 * CC_PAD)
  doc.text(labelLines[0], x + CC_PAD, cy + labelH / 2, { baseline: 'middle' })
  cy += labelH

  // Stat columns
  for (let i = 0; i < STAT_KEYS.length; i++) {
    const val = stats[STAT_KEYS[i]] || ''
    doc.setFillColor(CC_FIELD[0], CC_FIELD[1], CC_FIELD[2])
    ccStroke(doc)
    doc.rect(x + i * CC_SC, cy, CC_SC, statsH, 'FD')
    if (val) {
      doc.setFont('times', 'normal')
      doc.setFontSize(5.5)
      doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
      doc.text(String(val), x + i * CC_SC + CC_SC / 2, cy + statsH / 2, { align: 'center', baseline: 'middle' })
    }
  }
  return cy + statsH
}

// Render wrapped text block starting at cy, return new cy
function ccTextBlock(doc, x, cy, maxY, text, fontSize) {
  const lineH = fontSize * PT * 1.25
  doc.setFont('times', 'normal')
  doc.setFontSize(fontSize)
  doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
  const lines = doc.splitTextToSize(String(text || ''), CC_W - 2 * CC_PAD)
  for (const line of lines) {
    if (cy + lineH > maxY) break
    doc.text(line, x + CC_PAD, cy + lineH / 2, { baseline: 'middle' })
    cy += lineH
  }
  return cy
}

// Render a list of "Name: description" lines with the name in bold, return new cy
// colW defaults to full card width; pass a narrower value for split-column layouts
function ccSpecialBlock(doc, x, cy, maxY, lines, fontSize, colW = CC_W) {
  const lineH = fontSize * PT * 1.3
  const textX = x + CC_PAD
  const maxW = colW - 2 * CC_PAD
  doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])

  for (const line of lines) {
    if (!line) continue
    if (cy + lineH > maxY) break

    const colonIdx = line.indexOf(': ')
    if (colonIdx === -1) {
      doc.setFont('times', 'normal')
      doc.setFontSize(fontSize)
      const wrapped = doc.splitTextToSize(line, maxW)
      for (const wl of wrapped) {
        if (cy + lineH > maxY) break
        doc.text(wl, textX, cy + lineH / 2, { baseline: 'middle' })
        cy += lineH
      }
    } else {
      const boldPart = line.slice(0, colonIdx)   // "Name" (no colon)
      const restPart = line.slice(colonIdx + 2)  // "Description..."

      // Pre-measure full entry height — don't render partial entries
      doc.setFont('times', 'normal')
      doc.setFontSize(fontSize)
      const descW = maxW - 2
      const wrapped = restPart ? doc.splitTextToSize(restPart, descW) : []
      const entryH = (1 + wrapped.length) * lineH
      if (cy + entryH > maxY) break  // won't fit entirely — stop here

      // Heading
      doc.setFont('times', 'bold')
      doc.text(boldPart, textX, cy + lineH / 2, { baseline: 'middle' })
      cy += lineH

      // Description
      doc.setFont('times', 'normal')
      for (const wl of wrapped) {
        doc.text(wl, textX + 2, cy + lineH / 2, { baseline: 'middle' })
        cy += lineH
      }
    }
  }
  return cy
}

// Progress pips (like drawCheckboxes but smaller, right-aligned in a row)
function ccProgressPips(doc, x, y, rowH, progress, total = 12) {
  const size = 1.8, gap = 0.3
  const totalW = total * size + (total - 1) * gap
  let px = x + CC_W - CC_PAD - totalW
  const py = y + (rowH - size) / 2
  for (let i = 0; i < total; i++) {
    doc.setFillColor(i < progress ? CC_INK[0] : CC_FIELD[0], i < progress ? CC_INK[1] : CC_FIELD[1], i < progress ? CC_INK[2] : CC_FIELD[2])
    doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
    doc.setLineWidth(0.1)
    doc.rect(px, py, size, size, 'FD')
    px += size + gap
  }
}

// Draw cut-guide dashed lines across the full page
function ccCutGuides(doc) {
  doc.setDrawColor(160, 160, 160)
  doc.setLineWidth(0.1)
  const dash = [1.5, 2]
  // vertical lines
  for (let c = 0; c <= CC_COLS; c++) {
    const lx = CC_ML + c * CC_W
    let ly = 0
    let on = true
    while (ly < 297) {
      const seg = on ? dash[0] : dash[1]
      if (on) doc.line(lx, ly, lx, Math.min(ly + seg, 297))
      ly += seg
      on = !on
    }
  }
  // horizontal lines
  for (let r = 0; r <= CC_ROWS; r++) {
    const ly = CC_MT + r * CC_H
    let lx = 0
    let on = true
    while (lx < 210) {
      const seg = on ? dash[0] : dash[1]
      if (on) doc.line(lx, ly, Math.min(lx + seg, 210), ly)
      lx += seg
      on = !on
    }
  }
}

// ── Individual card renderers ─────────────────────────────────────────────────

function renderWarbandCard(doc, x, y, data) {
  const wbPal = ccPalette(CC_SLATE)
  ccBorder(doc, x, y)

  // Title
  ccHeader(doc, x, y, data.warband_name || 'Warband', CC_SLATE, 9, ccSigil(data.warband_type))
  let cy = y + 9

  // Type row
  doc.setFillColor(wbPal.head[0], wbPal.head[1], wbPal.head[2])
  doc.rect(x, cy, CC_W, 5, 'F')
  doc.setFont('times', 'normal')
  doc.setFontSize(6)
  doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
  doc.text(data.warband_type || '', x + CC_PAD, cy + 2.5, { baseline: 'middle' })
  if (data.player_name) {
    doc.setFont('times', 'bold')
    doc.text(data.player_name, x + CC_W - CC_PAD, cy + 2.5, { align: 'right', baseline: 'middle' })
  }
  cy += 5

  // Wins / Losses / Gold / Rout — 4 equal columns
  const statsRow = [
    ['Wins',   data.wins   || '—'],
    ['Losses', data.losses || '—'],
    ['Gold',   data.gold   || '—'],
    ['Rout',   data.rout_threshold || '—'],
  ]
  const sw = CC_W / 4
  for (let i = 0; i < 4; i++) {
    doc.setFillColor(wbPal.head[0], wbPal.head[1], wbPal.head[2])
    ccStroke(doc)
    doc.rect(x + i * sw, cy, sw, 4, 'FD')
    doc.setFont('times', 'bold')
    doc.setFontSize(4)
    doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
    doc.text(statsRow[i][0], x + i * sw + sw / 2, cy + 2, { align: 'center', baseline: 'middle' })
  }
  cy += 4
  for (let i = 0; i < 4; i++) {
    doc.setFillColor(CC_FIELD[0], CC_FIELD[1], CC_FIELD[2])
    ccStroke(doc)
    doc.rect(x + i * sw, cy, sw, 5.5, 'FD')
    doc.setFont('times', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
    doc.text(String(statsRow[i][1]), x + i * sw + sw / 2, cy + 2.75, { align: 'center', baseline: 'middle' })
  }
  cy += 5.5

  // Max Units / Hero Slots — 2 equal columns
  const unitRow = [['Max Units', data.max_units || '—'], ['Hero Slots', data.hero_slots || '—']]
  const uw = CC_W / 2
  for (let i = 0; i < 2; i++) {
    doc.setFillColor(wbPal.head[0], wbPal.head[1], wbPal.head[2])
    ccStroke(doc)
    doc.rect(x + i * uw, cy, uw, 4, 'FD')
    doc.setFont('times', 'bold')
    doc.setFontSize(4.5)
    doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
    doc.text(unitRow[i][0], x + i * uw + uw / 2, cy + 2, { align: 'center', baseline: 'middle' })
  }
  cy += 4
  for (let i = 0; i < 2; i++) {
    doc.setFillColor(CC_FIELD[0], CC_FIELD[1], CC_FIELD[2])
    ccStroke(doc)
    doc.rect(x + i * uw, cy, uw, 5.5, 'FD')
    doc.setFont('times', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
    doc.text(String(unitRow[i][1]), x + i * uw + uw / 2, cy + 2.75, { align: 'center', baseline: 'middle' })
  }
  cy += 5.5

  // Aligned neutral heroes — always show 3 slots
  {
    const nhRaw = (data.neutral_heroes || []).filter(nh => nh.name)
    const nhList = [...nhRaw, ...Array(Math.max(0, 3 - nhRaw.length)).fill({})]
    doc.setFillColor(wbPal.head[0], wbPal.head[1], wbPal.head[2])
    doc.rect(x, cy, CC_W, 3.5, 'F')
    doc.setFont('times', 'bold')
    doc.setFontSize(4)
    doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
    doc.text('Aligned Neutral Heroes', x + CC_PAD, cy + 1.75, { baseline: 'middle' })
    cy += 3.5
    for (const nh of nhList) {
      doc.setFillColor(CC_FIELD[0], CC_FIELD[1], CC_FIELD[2])
      ccStroke(doc)
      doc.rect(x, cy, CC_W, 5, 'FD')
      if (nh.name) {
        doc.setFont('times', 'normal')
        doc.setFontSize(5.5)
        doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
        doc.text(nh.name, x + CC_PAD, cy + 2.5, { baseline: 'middle' })
        ccProgressPips(doc, x, cy, 5, nh.progress || 0)
      }
      cy += 5
    }
  }

  // Stored equipment
  if (data.stored_equipment) {
    doc.setFillColor(wbPal.head[0], wbPal.head[1], wbPal.head[2])
    doc.rect(x, cy, CC_W, 3.5, 'F')
    doc.setFont('times', 'bold')
    doc.setFontSize(4)
    doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
    doc.text('Stored Equipment', x + CC_PAD, cy + 1.75, { baseline: 'middle' })
    cy += 3.5
    cy = ccTextBlock(doc, x, cy, y + CC_H - CC_PAD, data.stored_equipment, 5.5)
  }

  // Special rules
  const specRules = (data.special_rules || []).filter(r => r.name)
  if (specRules.length > 0) {
    const maxY = y + CC_H - CC_PAD
    if (cy + 3.5 < maxY) {
      doc.setFillColor(wbPal.bar[0], wbPal.bar[1], wbPal.bar[2])
      doc.rect(x, cy, CC_W, 3.5, 'F')
      doc.setFont('times', 'bold')
      doc.setFontSize(4)
      doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
      doc.text('Special Rules', x + CC_PAD, cy + 1.75, { baseline: 'middle' })
      cy += 3.5
    }
    const lines = specRules.map(r => r.desc ? `${r.name}: ${r.desc}` : r.name)
    ccSpecialBlock(doc, x, cy, maxY, lines, 5.5)
  }
}

// Draws the stats/weapons portion of a unit card and returns the cy after weapons
// (used by both the main card and to measure available space for skills)
function drawUnitCardStats(doc, x, y, unit, isHero, opts = {}) {
  const name = unit.name || unit.type || '—'
  const pal = ccPalette(isHero ? CC_OXBLOOD : CC_IRON)

  ccHeader(doc, x, y, name, pal.accent, 8, opts.sigil)
  let cy = y + 8

  // Identity row — paper stock, so the field cells below read as the writable part
  doc.setFillColor(CC_PAPER[0], CC_PAPER[1], CC_PAPER[2])
  ccStroke(doc)
  doc.rect(x, cy, CC_W, 5, 'FD')
  doc.setFont('times', 'italic')
  doc.setFontSize(5.5)
  doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
  doc.text(unit.type || '', x + CC_PAD, cy + 2.5, { baseline: 'middle' })
  if (isHero) {
    const flagMidY = cy + 2.5
    let fx = x + CC_W - CC_PAD
    const sqSz = 1.5
    fx -= 5
    doc.setFont('times', 'bold')
    doc.setFontSize(5.5)
    doc.text('Blt', fx + sqSz + 0.5, flagMidY, { baseline: 'middle' })
    if (unit.blight) {
      doc.setFillColor(CC_INK[0], CC_INK[1], CC_INK[2])
      doc.rect(fx, flagMidY - sqSz / 2, sqSz, sqSz, 'F')
    } else {
      doc.setFillColor(CC_FIELD[0], CC_FIELD[1], CC_FIELD[2])
      ccStroke(doc)
      doc.rect(fx, flagMidY - sqSz / 2, sqSz, sqSz, 'FD')
    }
    fx -= 7
    doc.text('DT', fx + sqSz + 0.5, flagMidY, { baseline: 'middle' })
    if (unit.deathtouched) {
      doc.setFillColor(CC_INK[0], CC_INK[1], CC_INK[2])
      doc.rect(fx, flagMidY - sqSz / 2, sqSz, sqSz, 'F')
    } else {
      doc.setFillColor(CC_FIELD[0], CC_FIELD[1], CC_FIELD[2])
      ccStroke(doc)
      doc.rect(fx, flagMidY - sqSz / 2, sqSz, sqSz, 'FD')
    }
  } else {
    const info = [`x${unit.count || '?'}`, unit.cap ? `Cap ${unit.cap}` : null, unit.blight ? '[Blt]' : null].filter(Boolean).join('  ')
    doc.setFont('times', 'bold')
    doc.text(info, x + CC_W - CC_PAD, cy + 2.5, { align: 'right', baseline: 'middle' })
  }
  cy += 5

  cy = ccStatHeader(doc, x, cy, pal.head)
  cy = ccStatRow(doc, x, cy, unit.base_stats || {}, false)
  // Pencil mode: an empty row under Base to track the unit's current stats, and
  // greyed equipment modifiers so they can be written over as the unit advances
  if (opts.pencil) cy = ccBlankStatRow(doc, x, cy)
  const advColor = opts.pencil ? PENCIL : TEXT

  // Cards use the full labels ("Sword + Heavy Armour") — the name bar is the full
  // card width. The warband sheet falls back to the plain names.
  const advLabels = unit.advance_labels_full || unit.advance_labels || []
  const loadoutStarts = new Set(isHero ? [] : (unit.loadout_starts || []))
  for (let i = 0; i < advLabels.length; i++) {
    const label = advLabels[i]
    if (!label) continue
    if (!isHero && i > 0 && loadoutStarts.has(i)) {
      const sortedStartsArr = [...loadoutStarts].sort((a, b) => a - b)
      const startIdx = sortedStartsArr.indexOf(i)
      const nextStart = sortedStartsArr[startIdx + 1] ?? advLabels.length
      const eqNames = advLabels.slice(i, nextStart).filter(Boolean).join(', ')
      doc.setFillColor(pal.head[0], pal.head[1], pal.head[2])
      ccStroke(doc)
      doc.rect(x, cy, CC_W, 3, 'FD')
      doc.setFont('times', 'bolditalic')
      doc.setFontSize(4.5)
      doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
      doc.text(eqNames || `Option ${startIdx + 2}`, x + CC_PAD, cy + 1.5, { baseline: 'middle' })
      cy += 3
    }
    cy = ccWeaponHoriz(doc, x, cy, label, (unit.advances || [])[i] || {}, pal.bar, advColor)
  }

  return cy
}

// Calculate how tall the stats+weapons section is for a given unit (in mm, relative to card top)
function statsBlockHeight(unit, isHero, opts = {}) {
  const WEAPON_H = CC_LBL_H + CC_VAL_H   // 7.8mm per equipment row (name bar + values)
  const SEP_H    = 3.0                   // loadout separator bar

  const advLabels    = (unit.advance_labels || []).filter(Boolean)
  const loadoutStarts = isHero ? [] : (unit.loadout_starts || [])
  const extraSeps    = loadoutStarts.filter(s => s > 0).length

  // header(8) + identity(5) + stat header + base row (+ write-in row)
  return 8 + 5 + CC_LBL_H + CC_VAL_H +
         (opts.pencil ? CC_VAL_H : 0) +
         advLabels.length * WEAPON_H +
         extraSeps * SEP_H
}

// Returns an array of draw-functions: main card + any overflow skill cards
function buildUnitCardDrawFns(unit, isHero, opts = {}) {
  const accent = isHero ? CC_OXBLOOD : CC_IRON
  const name = unit.name || unit.type || '—'
  const specLines = (unit.special || []).filter(Boolean)

  const SKILL_FS = 6.5
  const SKILL_LH = SKILL_FS * PT * 1.3

  // Available height for skills on the main card
  const statsH   = statsBlockHeight(unit, isHero, opts)
  const mainAvail = CC_H - CC_PAD - statsH - CC_PAD  // bottom pad + gap before skills

  // Simulate ccSpecialBlock rendering to find accurate split points.
  // Must exactly mirror the pre-measure logic in ccSpecialBlock.
  const measDoc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const maxW = CC_W - 2 * CC_PAD
  const descW = maxW - 2

  const entryHeight = (line) => {
    const colonIdx = line.indexOf(': ')
    if (colonIdx === -1) {
      measDoc.setFont('times', 'normal')
      measDoc.setFontSize(SKILL_FS)
      return measDoc.splitTextToSize(line, maxW).length * SKILL_LH
    }
    const rest = line.slice(colonIdx + 2)
    measDoc.setFont('times', 'normal')
    measDoc.setFontSize(SKILL_FS)
    const descLines = rest ? measDoc.splitTextToSize(rest, descW).length : 0
    return (1 + descLines) * SKILL_LH
  }

  // Split into chunks: first chunk fits on main card (never force), overflow chunks get the rest
  const chunks = []
  let remaining = [...specLines]

  // Main card chunk — stop as soon as an entry won't fit, even if chunk is empty
  {
    const chunk = []
    let used = 0
    for (const line of remaining) {
      const h = entryHeight(line)
      if (used + h > mainAvail) break
      chunk.push(line)
      used += h
    }
    chunks.push(chunk)
    remaining = remaining.slice(chunk.length)
  }

  // Overflow chunks — force at least one entry per card so we never loop forever
  const overflowAvail = CC_H - 8 - CC_PAD * 2
  while (remaining.length > 0) {
    const chunk = []
    let used = 0
    for (const line of remaining) {
      const h = entryHeight(line)
      if (used + h > overflowAvail && chunk.length > 0) break
      chunk.push(line)
      used += h
    }
    if (chunk.length === 0) chunk.push(remaining[0])  // entry taller than card — force it
    chunks.push(chunk)
    remaining = remaining.slice(chunk.length)
  }

  const drawFns = []

  // Main card
  const firstChunk = chunks[0] || []
  drawFns.push((doc, x, y) => {
    ccBorder(doc, x, y)
    const cy = drawUnitCardStats(doc, x, y, unit, isHero, opts)
    if (firstChunk.length > 0) {
      ccSpecialBlock(doc, x, cy + CC_PAD, y + CC_H - CC_PAD, firstChunk, SKILL_FS)
    }
    if (chunks.length > 1) {
      doc.setFont('times', 'italic')
      doc.setFontSize(4.5)
      doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
      // ASCII only \u2014 Times' WinAnsi encoding has no arrow glyph
      doc.text('cont. >', x + CC_W - CC_PAD, y + CC_H - CC_PAD, { align: 'right', baseline: 'bottom' })
    }
  })

  // Overflow cards
  for (let i = 1; i < chunks.length; i++) {
    const chunk = chunks[i]
    const cardTitle = `${name} (cont.)`
    drawFns.push((doc, x, y) => {
      ccBorder(doc, x, y)
      ccHeader(doc, x, y, cardTitle, accent, 8, opts.sigil)
      ccSpecialBlock(doc, x, y + 8 + CC_PAD, y + CC_H - CC_PAD, chunk, SKILL_FS)
    })
  }

  return drawFns
}

function renderSpellCards(data) {
  const sigil = ccSigil(data.warband_type)
  // Returns an array of draw-functions, one per card needed
  const drawFns = []

  // Match the unit cards' skill block so spell text reads at the same size
  const NAME_FS   = 6.5
  const DESC_FS   = 6.5
  const NAME_LH   = NAME_FS * PT * 1.3
  const DESC_LH   = DESC_FS * PT * 1.3
  const GAP       = 1.5
  const HEADER_H  = 8
  const DESC_W    = CC_W - 2 * CC_PAD - 2  // indented 2mm
  const AVAIL_H   = CC_H - HEADER_H - CC_PAD

  // Use a temporary doc for accurate line measurement
  const measDoc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  measDoc.setFont('times', 'normal')

  const spellHeight = (spell) => {
    measDoc.setFontSize(DESC_FS)
    const descLines = spell.description
      ? measDoc.splitTextToSize(String(spell.description), DESC_W).length
      : 0
    return NAME_LH + descLines * DESC_LH + GAP
  }

  for (const table of (data.spell_tables || [])) {
    if (!table.spells?.length) continue

    let remaining = [...table.spells]
    let cardNum = 0
    while (remaining.length > 0) {
      const school = table.school
      const captured = []
      let avail = AVAIL_H
      for (const spell of remaining) {
        const h = spellHeight(spell)
        if (avail < h && captured.length > 0) break
        captured.push(spell)
        avail -= h
      }
      remaining = remaining.slice(captured.length)
      const cardTitle = cardNum === 0 ? school : `${school} (cont.)`
      cardNum++
      const spellsForCard = captured
      drawFns.push((doc, x, y) => {
        ccBorder(doc, x, y)
        ccHeader(doc, x, y, cardTitle, CC_SLATE, HEADER_H, sigil)
        let cy = y + HEADER_H + CC_PAD / 2
        const maxY = y + CC_H - CC_PAD

        for (const spell of spellsForCard) {
          if (cy + NAME_LH > maxY) break
          // Spell name + check
          doc.setFont('times', 'bold')
          doc.setFontSize(NAME_FS)
          doc.setTextColor(CC_INK[0], CC_INK[1], CC_INK[2])
          doc.text(`${spell.name}  (${spell.check})`, x + CC_PAD, cy + NAME_LH / 2, { baseline: 'middle' })
          cy += NAME_LH

          // Description
          if (spell.description) {
            doc.setFont('times', 'normal')
            doc.setFontSize(DESC_FS)
            const lines = doc.splitTextToSize(String(spell.description), DESC_W)
            for (const line of lines) {
              if (cy + DESC_LH > maxY) break
              doc.text(line, x + CC_PAD + 2, cy + DESC_LH / 2, { baseline: 'middle' })
              cy += DESC_LH
            }
          }
          cy += GAP
        }
      })
    }
  }
  return drawFns
}

// ── CardScaleProxy ────────────────────────────────────────────────────────────
// Wraps a jsPDF instance and scales all drawing calls by `scale`, offset by (dx, dy).
// This lets all card draw functions be reused unchanged for big-card export.

class CardScaleProxy {
  constructor(doc, scale, dx, dy) {
    this._doc = doc; this._s = scale; this._dx = dx; this._dy = dy
  }
  setFont(...a)        { return this._doc.setFont(...a) }
  setFillColor(...a)   { return this._doc.setFillColor(...a) }
  setDrawColor(...a)   { return this._doc.setDrawColor(...a) }
  setTextColor(...a)   { return this._doc.setTextColor(...a) }
  setFontSize(s)       { return this._doc.setFontSize(s * this._s) }
  setLineWidth(w)      { return this._doc.setLineWidth(w * this._s) }
  rect(x, y, w, h, st) { return this._doc.rect(x*this._s+this._dx, y*this._s+this._dy, w*this._s, h*this._s, st) }
  text(t, x, y, o)    { return this._doc.text(t, x*this._s+this._dx, y*this._s+this._dy, o) }
  line(x1, y1, x2, y2) { return this._doc.line(x1*this._s+this._dx, y1*this._s+this._dy, x2*this._s+this._dx, y2*this._s+this._dy) }
  splitTextToSize(t, w) { return this._doc.splitTextToSize(t, w * this._s) }
  setCharSpace(n)      { return this._doc.setCharSpace(n * this._s) }
  circle(x, y, r, st)  { return this._doc.circle(x*this._s+this._dx, y*this._s+this._dy, r*this._s, st) }
  lines(l, x, y, sc, st, cl) {
    return this._doc.lines(l.map(seg => seg.map(v => v * this._s)),
                           x*this._s+this._dx, y*this._s+this._dy, sc, st, cl)
  }
  // getTextWidth returns a value in card-space (unscaled), so callers that use it
  // for layout comparisons continue to work correctly.
  getTextWidth(t)      { return this._doc.getTextWidth(t) / this._s }
}

/**
 * Generate a card-format PDF for printing and cutting.
 * 3×3 grid of 63×88mm cards on A4 portrait.
 */
export function generateCardsPDF(data, opts = {}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  doc.setFont('times', 'normal')
  opts = { ...opts, sigil: ccSigil(data.warband_type) }

  // Collect draw functions in order: warband → heroes → henchmen → spells
  const drawFns = []

  drawFns.push((doc, x, y) => renderWarbandCard(doc, x, y, data))

  for (const hero of (data.heroes || [])) {
    if (hero.type) drawFns.push(...buildUnitCardDrawFns(hero, true, opts))
  }

  for (const hench of (data.henchmen || [])) {
    if (hench.type) drawFns.push(...buildUnitCardDrawFns(hench, false, opts))
  }

  drawFns.push(...renderSpellCards(data))

  // Lay cards out on pages, 3×3 per page
  const perPage = CC_COLS * CC_ROWS
  for (let i = 0; i < drawFns.length; i++) {
    const slot = i % perPage
    if (i > 0 && slot === 0) doc.addPage()

    const col = slot % CC_COLS
    const row = Math.floor(slot / CC_COLS)
    const cx  = CC_ML + col * CC_W
    const cy  = CC_MT + row * CC_H

    // Cut guides on first card of each page
    if (slot === 0) ccCutGuides(doc)

    drawFns[i](doc, cx, cy)
  }

  return doc
}

/**
 * Generate a big-card PDF (cards scaled ~1.5×) for printing and cutting.
 * 2×2 grid of 94.5×132mm cards on A4 portrait.
 */
export function generateBigCardsPDF(data, opts = {}) {
  opts = { ...opts, sigil: ccSigil(data.warband_type) }
  const SCALE = 1.5
  const BIG_COLS = 2
  const BIG_ROWS = 2
  const BIG_W = CC_W * SCALE   // 94.5mm
  const BIG_H = CC_H * SCALE   // 132mm
  const BIG_ML = (210 - BIG_COLS * BIG_W) / 2  // 10.5mm
  const BIG_MT = (297 - BIG_ROWS * BIG_H) / 2  // 16.5mm

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  doc.setFont('times', 'normal')

  // Collect same draw functions as regular cards
  const drawFns = []
  drawFns.push((d, x, y) => renderWarbandCard(d, x, y, data))
  for (const hero  of (data.heroes   || [])) { if (hero.type)  drawFns.push(...buildUnitCardDrawFns(hero, true, opts)) }
  for (const hench of (data.henchmen || [])) { if (hench.type) drawFns.push(...buildUnitCardDrawFns(hench, false, opts)) }
  drawFns.push(...renderSpellCards(data))

  // Draw cut guides for big cards
  function bigCutGuides() {
    doc.setDrawColor(160, 160, 160)
    doc.setLineWidth(0.1)
    const dash = [1.5, 2]
    for (let c = 0; c <= BIG_COLS; c++) {
      const lx = BIG_ML + c * BIG_W
      let ly = 0; let on = true
      while (ly < 297) {
        const seg = on ? dash[0] : dash[1]
        if (on) doc.line(lx, ly, lx, Math.min(ly + seg, 297))
        ly += seg; on = !on
      }
    }
    for (let r = 0; r <= BIG_ROWS; r++) {
      const ly = BIG_MT + r * BIG_H
      let lx = 0; let on = true
      while (lx < 210) {
        const seg = on ? dash[0] : dash[1]
        if (on) doc.line(lx, ly, Math.min(lx + seg, 210), ly)
        lx += seg; on = !on
      }
    }
  }

  const perPage = BIG_COLS * BIG_ROWS
  for (let i = 0; i < drawFns.length; i++) {
    const slot = i % perPage
    if (i > 0 && slot === 0) doc.addPage()
    if (slot === 0) bigCutGuides()

    const col = slot % BIG_COLS
    const row = Math.floor(slot / BIG_COLS)
    // Proxy translates card-space (0,0) origin to page position (dx, dy)
    const dx = BIG_ML + col * BIG_W
    const dy = BIG_MT + row * BIG_H
    const proxy = new CardScaleProxy(doc, SCALE, dx, dy)
    drawFns[i](proxy, 0, 0)
  }

  return doc
}
