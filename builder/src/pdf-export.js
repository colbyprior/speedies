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

// Page: A4 landscape, margins x=0.6cm y=0.5cm
const MARGIN_X  = 6
const MARGIN_Y  = 5
const PAGE_W    = 297
const CONTENT_W = PAGE_W - 2 * MARGIN_X  // 285 mm

// Two-column card grid with 10pt gutter
const CARD_GUTTER = 10 * PT
const CARD_W      = (CONTENT_W - CARD_GUTTER) / 2

// Card columns: 1.75fr label | 11×1fr stats | 5.8fr special  (total 18.55fr)
const TOTAL_FR = 1.75 + 11 + 5.8
const COL_L    = (1.75 / TOTAL_FR) * CARD_W
const COL_S    = (1    / TOTAL_FR) * CARD_W
const COL_SPEC = (5.8  / TOTAL_FR) * CARD_W

const STAT_KEYS   = ['mov','run','mel','rgd','def','agi','mrl','atk','wnd','inj','prc']
const STAT_LABELS = ['Mov','Run','Mel','Rgd','Def','Agi','Mrl','Atk','Wnd','Inj','Prc']

// Card row heights in mm (converted from pt)
const HERO_ROWS  = [12.5, 14, 13, 13, 12.5, 15 ].map(p => p * PT)
const HENCH_ROWS = [10, 14, 13, 12.5, 12.5, 12.5, 18.5].map(p => p * PT)
const HERO_H     = HERO_ROWS .reduce((a, b) => a + b, 0)
const HENCH_H    = HENCH_ROWS.reduce((a, b) => a + b, 0)

// ── Drawing primitives ───────────────────────────────────────────────────────

function setStroke(doc) {
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
  doc.setLineWidth(0.14)  // 0.4pt ≈ 0.14 mm
}

function drawText(doc, x, y, w, h, text, fontSize, bold, align = 'left', vAlign = 'middle') {
  if (!text) return
  const pad   = 0.71  // 2pt inset
  const lineH = fontSize * PT * 1.1
  doc.setFont('times', bold ? 'bold' : 'normal')
  doc.setFontSize(fontSize)
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

function cell(doc, x, y, w, h, bg, text, fontSize, bold, align = 'left', vAlign = 'middle') {
  doc.setFillColor(bg[0], bg[1], bg[2])
  setStroke(doc)
  doc.rect(x, y, w, h, 'FD')
  drawText(doc, x, y, w, h, text, fontSize, bold, align, vAlign)
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
  const sp     = hero.special        || []
  const advLbl = hero.advance_labels || []
  const rh     = HERO_ROWS
  const specX  = x + COL_L + 11 * COL_S
  let ry = y

  // Row 1: Name / Type / Deathtouched / Blight / Special  (label headers)
  cell(doc, x,                   ry, COL_L + 3*COL_S, rh[0], BLUE, 'Name',         5.2, true)
  cell(doc, x + COL_L + 3*COL_S, ry, 5*COL_S,         rh[0], BLUE, 'Type',         5.2, true)
  cell(doc, x + COL_L + 8*COL_S, ry, 2*COL_S,         rh[0], BLUE, 'Deathtouched', 5.2, true)
  cell(doc, x + COL_L +10*COL_S, ry, COL_S,           rh[0], BLUE, 'Blight',       5.2, true)
  cell(doc, specX,                ry, COL_SPEC,        rh[0], BLUE, 'Special',      5.2, true)
  ry += rh[0]

  // Merged special cell spanning rows 2–6, top-aligned
  const specH    = rh[1] + rh[2] + rh[3] + rh[4] + rh[5]
  const specText = (Array.isArray(sp) ? sp : [sp]).filter(Boolean).join('\n')
  cell(doc, specX, ry, COL_SPEC, specH, WHITE, specText, 6.5, false, 'left', 'top')

  // Row 2: Name/Type/Deathtouched/Blight values
  cell(doc, x,                   ry, COL_L + 3*COL_S, rh[1], WHITE, hero.name         || '', 6.5, false)
  cell(doc, x + COL_L + 3*COL_S, ry, 5*COL_S,         rh[1], WHITE, hero.type         || '', 6.5, false)
  cell(doc, x + COL_L + 8*COL_S, ry, 2*COL_S,         rh[1], WHITE, hero.deathtouched || '', 6.5, false)
  cell(doc, x + COL_L +10*COL_S, ry, COL_S,           rh[1], WHITE, hero.blight       || '', 6.5, false)
  ry += rh[1]

  // Row 3: stat header labels
  cell(doc, x, ry, COL_L, rh[2], WHITE, '', 5.2, false)
  let rx = x + COL_L
  for (let i = 0; i < 11; i++) {
    cell(doc, rx, ry, COL_S, rh[2], BLUE, STAT_LABELS[i], 5.2, true, 'center')
    rx += COL_S
  }
  ry += rh[2]

  // Row 4: Base stats
  cell(doc, x, ry, COL_L, rh[3], BLUE, 'Base', 5.2, true)
  rx = x + COL_L
  for (let i = 0; i < 11; i++) {
    cell(doc, rx, ry, COL_S, rh[3], WHITE, bs[STAT_KEYS[i]] || '', 6.5, false, 'center')
    rx += COL_S
  }
  ry += rh[3]

  // Rows 5–6: weapon rows
  for (let a = 0; a < 2; a++) {
    const advData = adv[a] || {}
    cell(doc, x, ry, COL_L, rh[4 + a], WHITE, advLbl[a] || '', 5.2, false)
    rx = x + COL_L
    for (let i = 0; i < 11; i++) {
      cell(doc, rx, ry, COL_S, rh[4 + a], WHITE, advData[STAT_KEYS[i]] || '', 6.5, false, 'center')
      rx += COL_S
    }
    ry += rh[4 + a]
  }
}

function henchmanCard(doc, x, y, henchman = {}) {
  const bs     = henchman.base_stats     || {}
  const adv    = henchman.advances       || []
  const sp     = henchman.special        || []
  const advLbl = henchman.advance_labels || []
  const rh     = HENCH_ROWS
  const specX  = x + COL_L + 11 * COL_S
  let ry = y

  // Row 1: Name / Type / Cap / Blight / Count  (label headers, PURPLE)
  cell(doc, x,                   ry, COL_L + 3*COL_S, rh[0], PURPLE, 'Name',   5.2, true)
  cell(doc, x + COL_L + 3*COL_S, ry, 5*COL_S,         rh[0], PURPLE, 'Type',   5.2, true)
  cell(doc, x + COL_L + 8*COL_S, ry, COL_S,           rh[0], PURPLE, 'Cap',    5.2, true)
  cell(doc, x + COL_L + 9*COL_S, ry, 2*COL_S,         rh[0], PURPLE, 'Blight', 5.2, true)
  cell(doc, specX,                ry, COL_SPEC,        rh[0], PURPLE, 'Count',  5.2, true)
  ry += rh[0]

  // Row 2: values + count
  cell(doc, x,                   ry, COL_L + 3*COL_S, rh[1], WHITE, henchman.name   || '', 6.5, false)
  cell(doc, x + COL_L + 3*COL_S, ry, 5*COL_S,         rh[1], WHITE, henchman.type   || '', 6.5, false)
  cell(doc, x + COL_L + 8*COL_S, ry, COL_S,           rh[1], WHITE, henchman.cap    || '', 6.5, false)
  cell(doc, x + COL_L + 9*COL_S, ry, 2*COL_S,         rh[1], WHITE, henchman.blight || '', 6.5, false)
  cell(doc, specX,                ry, COL_SPEC,        rh[1], WHITE, henchman.count  || '', 6.5, false)
  ry += rh[1]

  // Row 3: stat header labels + Special header label (PURPLE)
  cell(doc, x, ry, COL_L, rh[2], WHITE, '', 5.2, false)
  let rx = x + COL_L
  for (let i = 0; i < 11; i++) {
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
  for (let i = 0; i < 11; i++) {
    cell(doc, rx, ry, COL_S, rh[3], WHITE, bs[STAT_KEYS[i]] || '', 6.5, false, 'center')
    rx += COL_S
  }
  ry += rh[3]

  // Rows 5–7: weapon rows
  for (let a = 0; a < 3; a++) {
    const advData = adv[a] || {}
    cell(doc, x, ry, COL_L, rh[4 + a], WHITE, advLbl[a] || '', 5.2, false)
    rx = x + COL_L
    for (let i = 0; i < 11; i++) {
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

// Stat col width for 11-column stat rows (warband sheet)
const CC_SC = CC_W / 11

// Two-column card body: left = stats, right = skills
const CC_LSTATS_W = 26      // stats column width
const CC_VSTEP    = 3.0     // height per stat row in vertical layout
const CC_VLBL_W   = 13      // label cell width within stats column
const CC_VVAL_W   = CC_LSTATS_W - CC_VLBL_W  // value cell width

// ── Card primitives ───────────────────────────────────────────────────────────

function ccBorder(doc, x, y) {
  doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
  doc.setLineWidth(0.35)
  doc.rect(x, y, CC_W, CC_H, 'FD')
}

function ccHeader(doc, x, y, text, color, h = 8) {
  doc.setFillColor(color[0], color[1], color[2])
  doc.rect(x, y, CC_W, h, 'F')
  doc.setFont('times', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
  const lines = doc.splitTextToSize(String(text || '—'), CC_W - 2 * CC_PAD)
  doc.text(lines[0], x + CC_W / 2, y + h / 2, { align: 'center', baseline: 'middle' })
}

function ccText(doc, x, y, text, fontSize, bold, color) {
  doc.setFont('times', bold ? 'bold' : 'normal')
  doc.setFontSize(fontSize)
  doc.setTextColor((color || TEXT)[0], (color || TEXT)[1], (color || TEXT)[2])
  doc.text(String(text), x, y, { baseline: 'middle' })
}

function ccStatLabelRow(doc, x, y, h, color) {
  const bg = color || BLUE
  for (let i = 0; i < 11; i++) {
    doc.setFillColor(bg[0], bg[1], bg[2])
    setStroke(doc)
    doc.rect(x + i * CC_SC, y, CC_SC, h, 'FD')
    doc.setFont('times', 'bold')
    doc.setFontSize(4.5)
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    doc.text(STAT_LABELS[i], x + i * CC_SC + CC_SC / 2, y + h / 2, { align: 'center', baseline: 'middle' })
  }
}

function ccStatValueRow(doc, x, y, h, stats) {
  for (let i = 0; i < 11; i++) {
    const val = stats[STAT_KEYS[i]] || ''
    doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
    setStroke(doc)
    doc.rect(x + i * CC_SC, y, CC_SC, h, 'FD')
    doc.setFont('times', 'normal')
    doc.setFontSize(5.5)
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    doc.text(String(val || '—'), x + i * CC_SC + CC_SC / 2, y + h / 2, { align: 'center', baseline: 'middle' })
  }
}

// Vertical base stats — stacked label|value rows in left stats column
function ccVertStats(doc, x, cy, maxY, stats, headerColor) {
  if (cy + 3 <= maxY) {
    doc.setFillColor(headerColor[0], headerColor[1], headerColor[2])
    setStroke(doc)
    doc.rect(x, cy, CC_LSTATS_W, 3, 'FD')
    doc.setFont('times', 'bold')
    doc.setFontSize(5)
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    doc.text('Base Stats', x + CC_PAD, cy + 1.5, { baseline: 'middle' })
    cy += 3
  }
  for (let i = 0; i < 11; i++) {
    if (cy + CC_VSTEP > maxY) break
    const tint = i % 2 === 0
      ? headerColor
      : headerColor.map(c => Math.round(c * 0.6 + 255 * 0.4))
    doc.setFillColor(tint[0], tint[1], tint[2])
    setStroke(doc)
    doc.rect(x, cy, CC_VLBL_W, CC_VSTEP, 'FD')
    doc.setFont('times', 'bold')
    doc.setFontSize(5)
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    doc.text(STAT_LABELS[i], x + CC_VLBL_W / 2, cy + CC_VSTEP / 2, { align: 'center', baseline: 'middle' })
    doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
    doc.rect(x + CC_VLBL_W, cy, CC_VVAL_W, CC_VSTEP, 'FD')
    doc.setFont('times', 'normal')
    doc.setFontSize(5.5)
    doc.text(String(stats[STAT_KEYS[i]] || '—'), x + CC_VLBL_W + CC_VVAL_W / 2, cy + CC_VSTEP / 2, { align: 'center', baseline: 'middle' })
    cy += CC_VSTEP
  }
  return cy
}

// Compact weapon section in left column: tinted header + 2-per-row stat pairs
function ccWeaponCompact(doc, x, cy, maxY, label, advStats, headerColor) {
  if (cy + 3 > maxY) return cy
  doc.setFillColor(headerColor[0], headerColor[1], headerColor[2])
  setStroke(doc)
  doc.rect(x, cy, CC_LSTATS_W, 3, 'FD')
  doc.setFont('times', 'bold')
  doc.setFontSize(5)
  doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
  doc.text(doc.splitTextToSize(label, CC_LSTATS_W - CC_PAD)[0], x + CC_PAD, cy + 1.5, { baseline: 'middle' })
  cy += 3

  const nonEmpty = STAT_KEYS
    .map((k, i) => ({ label: STAT_LABELS[i], val: advStats[k] }))
    .filter(e => e.val)

  const halfW   = CC_LSTATS_W / 2
  const cLblW   = halfW * 0.55
  const cValW   = halfW - cLblW

  for (let i = 0; i < nonEmpty.length; i += 2) {
    if (cy + CC_VSTEP > maxY) break
    const a = nonEmpty[i]
    const b = nonEmpty[i + 1]
    const tint = (i / 2) % 2 === 0
      ? headerColor
      : headerColor.map(c => Math.round(c * 0.6 + 255 * 0.4))

    // Left stat pair
    doc.setFillColor(tint[0], tint[1], tint[2])
    setStroke(doc)
    doc.rect(x, cy, cLblW, CC_VSTEP, 'FD')
    doc.setFont('times', 'bold')
    doc.setFontSize(4.5)
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    doc.text(a.label, x + cLblW / 2, cy + CC_VSTEP / 2, { align: 'center', baseline: 'middle' })
    doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
    doc.rect(x + cLblW, cy, cValW, CC_VSTEP, 'FD')
    doc.setFont('times', 'normal')
    doc.setFontSize(5)
    doc.text(String(a.val), x + cLblW + cValW / 2, cy + CC_VSTEP / 2, { align: 'center', baseline: 'middle' })

    // Right stat pair
    if (b) {
      doc.setFillColor(tint[0], tint[1], tint[2])
      doc.rect(x + halfW, cy, cLblW, CC_VSTEP, 'FD')
      doc.setFont('times', 'bold')
      doc.text(b.label, x + halfW + cLblW / 2, cy + CC_VSTEP / 2, { align: 'center', baseline: 'middle' })
      doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
      doc.rect(x + halfW + cLblW, cy, cValW, CC_VSTEP, 'FD')
      doc.setFont('times', 'normal')
      doc.text(String(b.val), x + halfW + cLblW + cValW / 2, cy + CC_VSTEP / 2, { align: 'center', baseline: 'middle' })
    } else {
      doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
      setStroke(doc)
      doc.rect(x + halfW, cy, halfW, CC_VSTEP, 'FD')
    }
    cy += CC_VSTEP
  }
  return cy
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
  setStroke(doc)
  doc.rect(x, cy, CC_W, labelH, 'FD')
  doc.setFont('times', 'bold')
  doc.setFontSize(5)
  doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
  const labelLines = doc.splitTextToSize(label || '', CC_W - 2 * CC_PAD)
  doc.text(labelLines[0], x + CC_PAD, cy + labelH / 2, { baseline: 'middle' })
  cy += labelH

  // Stat columns
  for (let i = 0; i < 11; i++) {
    const val = stats[STAT_KEYS[i]] || ''
    doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
    setStroke(doc)
    doc.rect(x + i * CC_SC, cy, CC_SC, statsH, 'FD')
    if (val) {
      doc.setFont('times', 'normal')
      doc.setFontSize(5.5)
      doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
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
  doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
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
  doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])

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

      // Skill name as its own bold heading line
      if (cy + lineH > maxY) break
      doc.setFont('times', 'bold')
      doc.setFontSize(fontSize)
      doc.text(boldPart, textX, cy + lineH / 2, { baseline: 'middle' })
      cy += lineH

      // Description on subsequent lines, slightly indented
      if (restPart) {
        doc.setFont('times', 'normal')
        const descW = maxW - 2
        const wrapped = doc.splitTextToSize(restPart, descW)
        for (const wl of wrapped) {
          if (cy + lineH > maxY) break
          doc.text(wl, textX + 2, cy + lineH / 2, { baseline: 'middle' })
          cy += lineH
        }
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
    doc.setFillColor(i < progress ? TEXT[0] : WHITE[0], i < progress ? TEXT[1] : WHITE[1], i < progress ? TEXT[2] : WHITE[2])
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
  ccBorder(doc, x, y)

  // Title
  ccHeader(doc, x, y, data.warband_name || 'Warband', TITLE, 9)
  let cy = y + 9

  // Type row
  doc.setFillColor(BLUE[0], BLUE[1], BLUE[2])
  doc.rect(x, cy, CC_W, 5, 'F')
  doc.setFont('times', 'normal')
  doc.setFontSize(6)
  doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
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
    doc.setFillColor(BLUE[0], BLUE[1], BLUE[2])
    setStroke(doc)
    doc.rect(x + i * sw, cy, sw, 4, 'FD')
    doc.setFont('times', 'bold')
    doc.setFontSize(4)
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    doc.text(statsRow[i][0], x + i * sw + sw / 2, cy + 2, { align: 'center', baseline: 'middle' })
  }
  cy += 4
  for (let i = 0; i < 4; i++) {
    doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
    setStroke(doc)
    doc.rect(x + i * sw, cy, sw, 5.5, 'FD')
    doc.setFont('times', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    doc.text(String(statsRow[i][1]), x + i * sw + sw / 2, cy + 2.75, { align: 'center', baseline: 'middle' })
  }
  cy += 5.5

  // Max Units / Hero Slots — 2 equal columns
  const unitRow = [['Max Units', data.max_units || '—'], ['Hero Slots', data.hero_slots || '—']]
  const uw = CC_W / 2
  for (let i = 0; i < 2; i++) {
    doc.setFillColor(BLUE[0], BLUE[1], BLUE[2])
    setStroke(doc)
    doc.rect(x + i * uw, cy, uw, 4, 'FD')
    doc.setFont('times', 'bold')
    doc.setFontSize(4.5)
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    doc.text(unitRow[i][0], x + i * uw + uw / 2, cy + 2, { align: 'center', baseline: 'middle' })
  }
  cy += 4
  for (let i = 0; i < 2; i++) {
    doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
    setStroke(doc)
    doc.rect(x + i * uw, cy, uw, 5.5, 'FD')
    doc.setFont('times', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    doc.text(String(unitRow[i][1]), x + i * uw + uw / 2, cy + 2.75, { align: 'center', baseline: 'middle' })
  }
  cy += 5.5

  // Aligned neutral heroes
  const nhList = (data.neutral_heroes || []).filter(nh => nh.name)
  if (nhList.length > 0) {
    doc.setFillColor(BLUE[0], BLUE[1], BLUE[2])
    doc.rect(x, cy, CC_W, 3.5, 'F')
    doc.setFont('times', 'bold')
    doc.setFontSize(4)
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    doc.text('Aligned Neutral Heroes', x + CC_PAD, cy + 1.75, { baseline: 'middle' })
    cy += 3.5
    for (const nh of nhList) {
      doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
      setStroke(doc)
      doc.rect(x, cy, CC_W, 5, 'FD')
      doc.setFont('times', 'normal')
      doc.setFontSize(5.5)
      doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
      doc.text(nh.name, x + CC_PAD, cy + 2.5, { baseline: 'middle' })
      ccProgressPips(doc, x, cy, 5, nh.progress || 0)
      cy += 5
    }
  }

  // Stored equipment (fill rest of card)
  if (data.stored_equipment) {
    doc.setFillColor(BLUE[0], BLUE[1], BLUE[2])
    doc.rect(x, cy, CC_W, 3.5, 'F')
    doc.setFont('times', 'bold')
    doc.setFontSize(4)
    doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
    doc.text('Stored Equipment', x + CC_PAD, cy + 1.75, { baseline: 'middle' })
    cy += 3.5
    ccTextBlock(doc, x, cy, y + CC_H - CC_PAD, data.stored_equipment, 5.5)
  }
}

function renderUnitCard(doc, x, y, unit, isHero) {
  ccBorder(doc, x, y)

  const name = unit.name || unit.type || '—'
  const headerColor = isHero ? BLUE : PURPLE
  const maxY = y + CC_H - CC_PAD

  // Name header (full width, 8mm)
  ccHeader(doc, x, y, name, headerColor, 8)
  let cy = y + 8

  // Identity row: type | DT/Blight (hero) or Count | Cap | Blight (henchman)
  doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
  setStroke(doc)
  doc.rect(x, cy, CC_W, 5, 'FD')
  doc.setFont('times', 'normal')
  doc.setFontSize(5.5)
  doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
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
      doc.setFillColor(TEXT[0], TEXT[1], TEXT[2])
      doc.rect(fx, flagMidY - sqSz / 2, sqSz, sqSz, 'F')
    } else {
      doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
      setStroke(doc)
      doc.rect(fx, flagMidY - sqSz / 2, sqSz, sqSz, 'FD')
    }
    fx -= 7
    doc.text('DT', fx + sqSz + 0.5, flagMidY, { baseline: 'middle' })
    if (unit.deathtouched) {
      doc.setFillColor(TEXT[0], TEXT[1], TEXT[2])
      doc.rect(fx, flagMidY - sqSz / 2, sqSz, sqSz, 'F')
    } else {
      doc.setFillColor(WHITE[0], WHITE[1], WHITE[2])
      setStroke(doc)
      doc.rect(fx, flagMidY - sqSz / 2, sqSz, sqSz, 'FD')
    }
  } else {
    const info = [`x${unit.count || '?'}`, unit.cap ? `Cap ${unit.cap}` : null, unit.blight ? '[Blt]' : null].filter(Boolean).join('  ')
    doc.setFont('times', 'bold')
    doc.text(info, x + CC_W - CC_PAD, cy + 2.5, { align: 'right', baseline: 'middle' })
  }
  cy += 5

  // Two-column body: left = stats, right = skills
  const bodyY = cy
  const rightX = x + CC_LSTATS_W
  const rightW = CC_W - CC_LSTATS_W

  // Vertical separator between columns
  doc.setDrawColor(BORDER[0], BORDER[1], BORDER[2])
  doc.setLineWidth(0.2)
  doc.line(rightX, bodyY, rightX, y + CC_H)

  // Left column: base stats (vertical)
  let lcy = ccVertStats(doc, x, bodyY, maxY, unit.base_stats || {}, headerColor)

  // Left column: weapon sections (compact)
  const maxWeapons = isHero ? 2 : 3
  for (let i = 0; i < maxWeapons; i++) {
    const label = (unit.advance_labels || [])[i]
    if (!label) continue
    lcy = ccWeaponCompact(doc, x, lcy, maxY, label, (unit.advances || [])[i] || {}, headerColor)
  }

  // Right column: skills/special text (bold names, normal descriptions)
  const specLines = (unit.special || []).filter(Boolean)
  if (specLines.length > 0) {
    ccSpecialBlock(doc, rightX, bodyY + CC_PAD, maxY, specLines, 7, rightW)
  }
}

function renderSpellCards(data) {
  // Returns an array of draw-functions, one per card needed
  const drawFns = []
  const lineH = 5.5 * PT * 1.3
  const maxY = CC_H - CC_PAD

  for (const table of (data.spell_tables || [])) {
    if (!table.spells?.length) continue

    // Measure how many spells fit on one card and split accordingly
    let remaining = [...table.spells]
    let cardNum = 0
    while (remaining.length > 0) {
      const captured = []
      const school = table.school
      const headerH = 8
      // Available height after header
      let avail = CC_H - headerH - CC_PAD
      for (const spell of remaining) {
        const nameH = lineH + 1   // name + check line
        const descLines = Math.ceil(String(spell.description || '').length / 38)  // rough estimate
        const descH = descLines * lineH
        const spellH = nameH + descH + 2
        if (avail < spellH && captured.length > 0) break
        captured.push(spell)
        avail -= spellH
      }
      remaining = remaining.slice(captured.length)
      const cardTitle = cardNum === 0 ? school : `${school} (cont.)`
      cardNum++
      const spellsForCard = captured
      drawFns.push((doc, x, y) => {
        ccBorder(doc, x, y)
        ccHeader(doc, x, y, cardTitle, TITLE, 8)
        let cy = y + 8 + CC_PAD / 2

        for (const spell of spellsForCard) {
          if (cy + lineH > y + CC_H - CC_PAD) break
          // Spell name + check
          doc.setFont('times', 'bold')
          doc.setFontSize(6)
          doc.setTextColor(TEXT[0], TEXT[1], TEXT[2])
          const nameText = `${spell.name}  (${spell.check})`
          doc.text(nameText, x + CC_PAD, cy + lineH / 2, { baseline: 'middle' })
          cy += lineH

          // Description
          if (spell.description) {
            doc.setFont('times', 'normal')
            doc.setFontSize(5)
            const lines = doc.splitTextToSize(String(spell.description), CC_W - 2 * CC_PAD)
            for (const line of lines) {
              if (cy + lineH * 0.85 > y + CC_H - CC_PAD) break
              doc.text(line, x + CC_PAD + 2, cy + lineH * 0.85 / 2, { baseline: 'middle' })
              cy += lineH * 0.85
            }
          }
          cy += 1.5  // gap between spells
        }
      })
    }
  }
  return drawFns
}

/**
 * Generate a card-format PDF for printing and cutting.
 * 3×3 grid of 63×88mm cards on A4 portrait.
 */
export function generateCardsPDF(data) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  doc.setFont('times', 'normal')

  // Collect draw functions in order: warband → heroes → henchmen → spells
  const drawFns = []

  drawFns.push((doc, x, y) => renderWarbandCard(doc, x, y, data))

  for (const hero of (data.heroes || [])) {
    if (hero.type) drawFns.push((doc, x, y) => renderUnitCard(doc, x, y, hero, true))
  }

  for (const hench of (data.henchmen || [])) {
    if (hench.type) drawFns.push((doc, x, y) => renderUnitCard(doc, x, y, hench, false))
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
