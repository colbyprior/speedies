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
