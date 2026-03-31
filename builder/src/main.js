import './style.css'
import JSON5 from 'json5'
import meleeData from '../../static/jsondata/melee-weapons.json'
import rangedData from '../../static/jsondata/ranged-weapons.json'
import armourData from '../../static/jsondata/armour.json'
import aliasData from '../../static/jsondata/aliases.json'

// ─────────────────────────────────────────────────────────────
// DATA LOADING
// Use ?raw so Vite imports the files as plain strings, then parse
// with JSON5 — this handles trailing commas and comments in .json files.
// ─────────────────────────────────────────────────────────────

const rawWarbandStrings = import.meta.glob(
  '../../static/jsondata/warbands/*.json',
  { eager: true, query: '?raw', import: 'default' }
)

const WARBANDS = {}
for (const rawStr of Object.values(rawWarbandStrings)) {
  try {
    const data = JSON5.parse(rawStr)
    if (data?.Name) WARBANDS[data.Name] = data
  } catch (e) {
    console.warn('Failed to parse warband file:', e)
  }
}

const STARTING_GOLD = 500
const STORAGE_KEY = 'blightmeer-builder-v1'
const BASE_HERO_SLOTS = 3
const HERO_SLOT_COSTS = [50, 75, 100]

// ─────────────────────────────────────────────────────────────
// EQUIPMENT UTILITIES
// ─────────────────────────────────────────────────────────────

function resolveAlias(displayName, category) {
  const catMap = aliasData[category] || {}
  return catMap[displayName] || displayName
}

function getMeleeStats(displayName) {
  const key = resolveAlias(displayName, 'Melee Weapons')
  return meleeData[key] || meleeData[displayName] || null
}

function getRangedStats(displayName) {
  const key = resolveAlias(displayName, 'Ranged Weapons')
  return rangedData[key] || rangedData[displayName] || null
}

function getArmourStats(displayName) {
  const key = resolveAlias(displayName, 'Armour')
  return armourData[key] || armourData[displayName] || null
}

function getEquipCost(displayName, category) {
  let stats = null
  if (category === 'melee') stats = getMeleeStats(displayName)
  else if (category === 'ranged') stats = getRangedStats(displayName)
  else if (category === 'armour') stats = getArmourStats(displayName)
  return stats ? (parseInt(stats.Cost) || 0) : 0
}

function getMeleeSlots(displayName) {
  const stats = getMeleeStats(displayName)
  return stats ? (parseInt(stats.Slots) || 1) : 1
}

// ─────────────────────────────────────────────────────────────
// WARBAND DATA HELPERS
// ─────────────────────────────────────────────────────────────

function findUnitDef(wbData, typeName, category) {
  const arr = category === 'hero' ? (wbData.Heroes || []) : (wbData.Henchmen || [])
  return arr.find(u => u.Name === typeName) || null
}

function getEquipmentForUnit(wbData, unitTypeName) {
  const equipment = wbData.Equipment || {}
  for (const group of Object.values(equipment)) {
    if (Array.isArray(group.Aliases) && group.Aliases.includes(unitTypeName)) {
      return {
        melee: group['Melee Weapons'] || [],
        ranged: group['Ranged Weapons'] || [],
        armour: group['Armour'] || [],
      }
    }
  }
  return { melee: [], ranged: [], armour: [] }
}

// Only arcane schools restrict equipment (1 melee slot, no ranged, no armour).
// Divine Magic is a divine school — those units keep full equipment slots.
function isSpellcaster(unitDef) {
  return (unitDef.Skills || []).some(s => s.includes('Magic') && s !== 'Divine Magic')
}

function hasNoEquipment(unitDef) {
  return (unitDef.Skills || []).includes('No Equipment')
}

function getUnitCap(unitDef) {
  const cap = unitDef['Type Cap']
  if (!cap || cap === '-') return Infinity
  return parseInt(cap) || Infinity
}

// ─────────────────────────────────────────────────────────────
// SLOT LIMITS
// ─────────────────────────────────────────────────────────────

/**
 * Returns the maximum equipment slots for a unit given its current loadout.
 * Heroes: 2 melee slots + 1 ranged slot + 1 armour slot
 * Henchmen: 2 total weapon slots (melee + flex) + 1 armour slot
 * Spellcasters: 1 melee slot only
 */
function getSlotLimits(unitDef, category, eq) {
  if (hasNoEquipment(unitDef)) {
    return { meleeMax: 0, rangedMax: 0, armourMax: 0 }
  }
  if (isSpellcaster(unitDef)) {
    return { meleeMax: 1, rangedMax: 0, armourMax: 0 }
  }
  if (category === 'hero') {
    return { meleeMax: 2, rangedMax: 1, armourMax: 1 }
  }
  // Henchmen: 2 weapon slots total, flex slot can be ranged
  const rangedEquipped = (eq.ranged || []).length > 0 ? 1 : 0
  const meleeUsed = getMeleeUsed(eq)
  return {
    meleeMax: 2 - rangedEquipped,
    rangedMax: meleeUsed <= 1 ? 1 : 0,
    armourMax: 1,
  }
}

function getMeleeUsed(eq) {
  return (eq.melee || []).reduce((sum, name) => sum + getMeleeSlots(name), 0)
}

// ─────────────────────────────────────────────────────────────
// COST CALCULATION
// ─────────────────────────────────────────────────────────────

function calcUnitCost(unit, wbData) {
  const unitDef = findUnitDef(wbData, unit.typeName, unit.category)
  if (!unitDef) return 0
  let cost = parseInt(unitDef.Cost) || 0
  for (const item of (unit.equipment.melee || [])) cost += getEquipCost(item, 'melee')
  for (const item of (unit.equipment.ranged || [])) cost += getEquipCost(item, 'ranged')
  if (unit.equipment.armour) cost += getEquipCost(unit.equipment.armour, 'armour')
  return cost
}

function getHeroSlots(wb) {
  return BASE_HERO_SLOTS + (wb.heroSlotsPurchased || 0)
}

function getNextHeroSlotCost(wb) {
  const purchased = wb.heroSlotsPurchased || 0
  return purchased < HERO_SLOT_COSTS.length ? HERO_SLOT_COSTS[purchased] : null
}

function heroCount(wb) {
  return wb.units.filter(u => u.category === 'hero').length
}

function calcTotalSpent(warband) {
  const wbData = WARBANDS[warband.type]
  if (!wbData) return 0
  const unitCosts = warband.units.reduce((sum, u) => sum + calcUnitCost(u, wbData), 0)
  const slotCosts = HERO_SLOT_COSTS.slice(0, warband.heroSlotsPurchased || 0).reduce((s, c) => s + c, 0)
  return unitCosts + slotCosts
}

function goldRemaining(warband) {
  return STARTING_GOLD - calcTotalSpent(warband)
}

// ─────────────────────────────────────────────────────────────
// STATE MANAGEMENT
// ─────────────────────────────────────────────────────────────

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedWarbands))
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const state = {
  view: 'home',              // 'home' | 'select-type' | 'builder' | 'view-warband'
  savedWarbands: loadState(),
  currentId: null,
  equipModalUnitId: null,
  selectedType: null,
  mobileTab: 'hire',         // 'hire' | 'roster'
}

function currentWarband() {
  return state.savedWarbands.find(w => w.id === state.currentId) || null
}

function mutateWarband(fn) {
  const wb = currentWarband()
  if (!wb) return
  fn(wb)
  persistState()
  render()
}

// ─────────────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────────────

function createWarband(typeName, name) {
  const wb = {
    id: uid(),
    name: (name || '').trim() || `${typeName} Warband`,
    type: typeName,
    createdAt: Date.now(),
    units: [],
    heroSlotsPurchased: 0,
  }
  state.savedWarbands.push(wb)
  state.currentId = wb.id
  state.view = 'builder'
  state.mobileTab = 'hire'
  persistState()
  render()
}

function canAddUnit(warband, unitDef, category) {
  const wbData = WARBANDS[warband.type]
  const maxUnits = parseInt(wbData?.['Max Units']) || 15
  if (warband.units.length >= maxUnits) return { ok: false, reason: 'Full' }

  if (category === 'hero' && heroCount(warband) >= getHeroSlots(warband)) {
    return { ok: false, reason: 'No Hero Slots' }
  }

  const cap = getUnitCap(unitDef)
  const count = warband.units.filter(u => u.typeName === unitDef.Name).length
  if (cap !== Infinity && count >= cap) return { ok: false, reason: 'At Cap' }

  const baseCost = parseInt(unitDef.Cost) || 0
  if (goldRemaining(warband) < baseCost) return { ok: false, reason: "Can't Afford" }

  return { ok: true }
}

function addUnit(typeName, category) {
  const wb = currentWarband()
  if (!wb) return
  const wbData = WARBANDS[wb.type]
  const unitDef = findUnitDef(wbData, typeName, category)
  if (!unitDef) return
  const check = canAddUnit(wb, unitDef)
  if (!check.ok) return

  mutateWarband(wb => {
    wb.units.push({
      id: uid(),
      typeName,
      category,
      equipment: { melee: [], ranged: [], armour: null },
    })
  })
}

function removeUnit(unitId) {
  mutateWarband(wb => {
    wb.units = wb.units.filter(u => u.id !== unitId)
  })
}

function toggleEquip(unitId, itemName, category) {
  const wb = currentWarband()
  if (!wb) return
  const unit = wb.units.find(u => u.id === unitId)
  if (!unit) return
  const wbData = WARBANDS[wb.type]
  const unitDef = findUnitDef(wbData, unit.typeName, unit.category)
  if (!unitDef) return

  const eq = unit.equipment

  if (category === 'armour') {
    const limits = getSlotLimits(unitDef, unit.category, eq)
    if (limits.armourMax === 0) return
    if (eq.armour === itemName) {
      mutateWarband(wb => {
        wb.units.find(u => u.id === unitId).equipment.armour = null
      })
    } else {
      const cost = getEquipCost(itemName, 'armour')
      const oldCost = eq.armour ? getEquipCost(eq.armour, 'armour') : 0
      if (goldRemaining(wb) < cost - oldCost) return
      mutateWarband(wb => {
        wb.units.find(u => u.id === unitId).equipment.armour = itemName
      })
    }
  } else if (category === 'melee') {
    // toggleEquip only adds — removal is handled by removeEquip via the ✕ button
    const limits = getSlotLimits(unitDef, unit.category, eq)
    const used = getMeleeUsed(eq)
    const slots = getMeleeSlots(itemName)
    if ((used + slots) > limits.meleeMax) return
    if (goldRemaining(wb) < getEquipCost(itemName, 'melee')) return
    mutateWarband(wb => {
      wb.units.find(u => u.id === unitId).equipment.melee.push(itemName)
    })
  } else if (category === 'ranged') {
    const limits = getSlotLimits(unitDef, unit.category, eq)
    if (eq.ranged.includes(itemName)) return  // already equipped; use ✕ to remove
    if (eq.ranged.length >= limits.rangedMax) return
    if (goldRemaining(wb) < getEquipCost(itemName, 'ranged')) return
    mutateWarband(wb => {
      wb.units.find(u => u.id === unitId).equipment.ranged.push(itemName)
    })
  }
}

function removeEquip(unitId, itemName, category) {
  const wb = currentWarband()
  if (!wb) return
  mutateWarband(wb => {
    const u = wb.units.find(u => u.id === unitId)
    if (!u) return
    if (category === 'melee') {
      const idx = u.equipment.melee.indexOf(itemName)
      if (idx !== -1) u.equipment.melee.splice(idx, 1)
    } else if (category === 'ranged') {
      u.equipment.ranged = u.equipment.ranged.filter(r => r !== itemName)
    } else if (category === 'armour') {
      u.equipment.armour = null
    }
  })
}

function deleteWarband(id) {
  state.savedWarbands = state.savedWarbands.filter(w => w.id !== id)
  persistState()
  render()
}

// ─────────────────────────────────────────────────────────────
// RENDER HELPERS
// ─────────────────────────────────────────────────────────────

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function statVal(v) {
  return v === '-' || v == null ? '—' : v
}

// ─────────────────────────────────────────────────────────────
// VIEW: HOME
// ─────────────────────────────────────────────────────────────

function renderHome() {
  const released = Object.values(WARBANDS).filter(w => w.Status === 'Released')
  const drafts = Object.values(WARBANDS).filter(w => w.Status !== 'Released')
  const saved = state.savedWarbands

  function typeCard(wbData) {
    const isDraft = wbData.Status !== 'Released'
    const specialCount = Object.keys(wbData['Special Rules'] || {}).length
    return `
      <button class="type-card" data-action="select-type" data-type="${esc(wbData.Name)}">
        ${isDraft ? '<span class="draft-badge">Draft</span>' : ''}
        <div class="type-card-name">${esc(wbData.Name)}</div>
        <div class="type-card-complexity">${wbData.Complexity || ''}</div>
        <div class="type-card-style">${esc(wbData['Play Style'] || '')}</div>
        <div class="type-card-meta">
          <span>${wbData['Max Units']} units max</span>
          ${specialCount > 0 ? `<span class="special-tag">⚡ Special</span>` : ''}
        </div>
      </button>
    `
  }

  const savedSection = saved.length > 0 ? `
    <section class="home-section">
      <h2 class="section-title">Your Warbands</h2>
      <div class="saved-list">
        ${saved.map(wb => {
          const spent = calcTotalSpent(wb)
          const rem = STARTING_GOLD - spent
          return `
            <div class="saved-card">
              <div class="saved-card-info">
                <div class="saved-card-name">${esc(wb.name)}</div>
                <div class="saved-card-sub">${esc(wb.type)} · ${wb.units.length} units · ${rem}g left</div>
              </div>
              <div class="saved-card-actions">
                <button class="btn btn-primary btn-sm" data-action="open-builder" data-id="${wb.id}">Edit</button>
                <button class="btn btn-ghost btn-sm" data-action="open-view" data-id="${wb.id}">View</button>
                <button class="btn btn-danger btn-sm" data-action="delete-warband" data-id="${wb.id}">✕</button>
              </div>
            </div>
          `
        }).join('')}
      </div>
    </section>
  ` : ''

  return `
    <div class="home-view">
      <header class="home-header">
        <div class="home-logo">⚔</div>
        <div>
          <h1 class="home-title">Warband Builder</h1>
          <p class="home-subtitle">Blightmeer Skirmish</p>
        </div>
      </header>

      ${savedSection}

      <section class="home-section">
        <h2 class="section-title">Choose a Warband</h2>
        <div class="type-grid">
          ${released.map(typeCard).join('')}
        </div>
        ${drafts.length > 0 ? `
          <details class="draft-details">
            <summary>Draft Warbands (${drafts.length})</summary>
            <div class="type-grid draft-grid">
              ${drafts.map(typeCard).join('')}
            </div>
          </details>
        ` : ''}
      </section>
    </div>
  `
}

// ─────────────────────────────────────────────────────────────
// VIEW: SELECT TYPE MODAL
// ─────────────────────────────────────────────────────────────

function renderSelectTypeModal() {
  const typeName = state.selectedType
  const wbData = WARBANDS[typeName]
  if (!wbData) return ''

  const specialRules = wbData['Special Rules'] || {}
  const specialHtml = Object.entries(specialRules).map(([name, desc]) => `
    <div class="special-rule-entry">
      <strong>${esc(name)}:</strong> ${esc(desc)}
    </div>
  `).join('')

  return `
    <div class="modal-overlay" data-action="close-select-modal">
      <div class="modal">
        <div class="modal-header">
          <h2>${esc(typeName)}</h2>
          <button class="modal-close" data-action="close-select-modal">✕</button>
        </div>
        <div class="modal-body">
          <div class="wb-details-grid">
            <div class="wb-detail"><span class="wb-detail-label">Complexity</span><span>${wbData.Complexity || '—'}</span></div>
            <div class="wb-detail"><span class="wb-detail-label">Play Style</span><span>${esc(wbData['Play Style'] || '—')}</span></div>
            <div class="wb-detail"><span class="wb-detail-label">Max Units</span><span>${wbData['Max Units']}</span></div>
            <div class="wb-detail"><span class="wb-detail-label">Rout At</span><span>${wbData['Rout Threshold']} down</span></div>
          </div>
          ${specialHtml ? `<div class="special-rules-block">${specialHtml}</div>` : ''}
          <div class="name-section">
            <label class="name-label" for="wb-name-input">Name your warband</label>
            <input
              id="wb-name-input"
              class="name-input"
              type="text"
              placeholder="${esc(typeName)} Warband"
              maxlength="50"
              autofocus
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" data-action="close-select-modal">Cancel</button>
          <button class="btn btn-primary" data-action="create-warband" data-type="${esc(typeName)}">
            Start Building →
          </button>
        </div>
      </div>
    </div>
  `
}

// ─────────────────────────────────────────────────────────────
// VIEW: BUILDER
// ─────────────────────────────────────────────────────────────

function renderBuilder() {
  const wb = currentWarband()
  if (!wb) return renderHome()

  const wbData = WARBANDS[wb.type]
  const spent = calcTotalSpent(wb)
  const rem = STARTING_GOLD - spent
  const maxUnits = parseInt(wbData?.['Max Units']) || 15
  const unitCount = wb.units.length
  const overBudget = rem < 0

  return `
    <div class="builder-view">
      <header class="builder-header">
        <button class="btn btn-ghost btn-back" data-action="nav-home">← Back</button>
        <div class="builder-header-center">
          <div class="builder-wb-name">${esc(wb.name)}</div>
          <div class="builder-wb-type">${esc(wb.type)}</div>
        </div>
        <div class="builder-stats-row">
          <div class="stat-chip ${overBudget ? 'stat-chip--danger' : rem < 50 ? 'stat-chip--warn' : ''}">
            <span class="stat-chip-label">Gold</span>
            <span class="stat-chip-value">${rem}g</span>
          </div>
          <div class="stat-chip ${unitCount >= maxUnits ? 'stat-chip--danger' : ''}">
            <span class="stat-chip-label">Units</span>
            <span class="stat-chip-value">${unitCount}/${maxUnits}</span>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" data-action="open-view" data-id="${wb.id}">View ↗</button>
      </header>

      <nav class="mobile-tabs">
        <button class="tab-btn ${state.mobileTab === 'hire' ? 'active' : ''}" data-action="set-tab" data-tab="hire">
          Hire Units
        </button>
        <button class="tab-btn ${state.mobileTab === 'roster' ? 'active' : ''}" data-action="set-tab" data-tab="roster">
          Roster${unitCount > 0 ? ` <span class="tab-count">${unitCount}</span>` : ''}
        </button>
      </nav>

      <div class="builder-panels">
        <aside class="panel hire-panel ${state.mobileTab === 'hire' ? 'panel--active' : ''}">
          ${renderHirePanel(wb, wbData)}
        </aside>
        <main class="panel roster-panel ${state.mobileTab === 'roster' ? 'panel--active' : ''}">
          ${renderRosterPanel(wb, wbData)}
        </main>
      </div>
    </div>
    ${state.equipModalUnitId ? renderEquipModal(wb, wbData) : ''}
  `
}

function renderHirePanel(wb, wbData) {
  const rem = goldRemaining(wb)
  const maxUnits = parseInt(wbData['Max Units']) || 15
  const full = wb.units.length >= maxUnits

  function unitCard(unitDef, category) {
    const count = wb.units.filter(u => u.typeName === unitDef.Name).length
    const cap = getUnitCap(unitDef)
    const check = canAddUnit(wb, unitDef, category)
    const isLeader = unitDef.Type === 'Leader'
    const cost = parseInt(unitDef.Cost) || 0

    return `
      <div class="hire-card${!check.ok ? ' hire-card--disabled' : ''}">
        <div class="hire-card-top">
          <div class="hire-card-title">
            <span class="hire-card-name">${esc(unitDef.Name)}</span>
            ${isLeader ? '<span class="leader-tag">Leader</span>' : ''}
          </div>
          <div class="hire-card-count-cost">
            <span class="hire-card-cap">${cap === Infinity ? `${count} hired` : `${count} / ${cap}`}</span>
            <span class="hire-card-cost">${cost === 0 ? 'Free' : `${cost}g`}</span>
          </div>
        </div>
        <div class="hire-card-stats">
          <span title="Move">Mov ${statVal(unitDef.Move)}</span>
          <span title="Melee">Mel ${statVal(unitDef.Melee)}</span>
          <span title="Ranged">Rng ${statVal(unitDef.Ranged)}</span>
          <span title="Defense">Def ${statVal(unitDef.Defense)}</span>
          <span title="Agility">Agi ${statVal(unitDef.Agility)}</span>
          <span title="Attacks">Atk ${statVal(unitDef.Attacks)}</span>
          <span title="Wounds">Wnd ${statVal(unitDef.Wounds)}</span>
        </div>
        ${unitDef.Skills?.length > 0 ? `
          <div class="hire-card-skills">${unitDef.Skills.map(s => `<span class="skill-tag">${esc(s)}</span>`).join('')}</div>
        ` : ''}
        <button
          class="btn ${check.ok ? 'btn-primary' : 'btn-ghost'} btn-sm hire-btn"
          data-action="add-unit"
          data-unit-name="${esc(unitDef.Name)}"
          data-unit-cat="${category}"
          ${!check.ok ? 'disabled' : ''}
        >${check.ok ? '+ Hire' : check.reason}</button>
      </div>
    `
  }

  const heroSlots = getHeroSlots(wb)
  const heroesHired = heroCount(wb)
  const nextSlotCost = getNextHeroSlotCost(wb)
  const canBuySlot = nextSlotCost !== null && goldRemaining(wb) >= nextSlotCost

  return `
    <div class="hire-inner">
      <div class="hire-section">
        <div class="hire-section-header">
          <h3 class="hire-section-title">Heroes</h3>
          <div class="hero-slots-info">
            <span class="hero-slots-count">${heroesHired} / ${heroSlots} slots</span>
            ${nextSlotCost !== null ? `
              <button
                class="btn btn-sm ${canBuySlot ? 'btn-gold' : 'btn-ghost'}"
                data-action="buy-hero-slot"
                ${!canBuySlot ? 'disabled' : ''}
              >+ Slot (${nextSlotCost}g)</button>
            ` : `<span class="hero-slots-max">Max slots</span>`}
          </div>
        </div>
        ${(wbData.Heroes || []).map(h => unitCard(h, 'hero')).join('')}
      </div>
      <div class="hire-section">
        <h3 class="hire-section-title">Henchmen</h3>
        ${(wbData.Henchmen || []).map(h => unitCard(h, 'henchman')).join('')}
      </div>
    </div>
  `
}

function renderRosterPanel(wb, wbData) {
  if (wb.units.length === 0) {
    return `
      <div class="empty-roster">
        <div class="empty-icon">⚔</div>
        <p>No units hired yet.</p>
        <button class="btn btn-primary" data-action="set-tab" data-tab="hire">Hire Units</button>
      </div>
    `
  }

  return `
    <div class="roster-list">
      ${wb.units.map(unit => renderRosterUnit(unit, wb, wbData)).join('')}
    </div>
  `
}

function renderRosterUnit(unit, wb, wbData) {
  const unitDef = findUnitDef(wbData, unit.typeName, unit.category)
  if (!unitDef) return ''

  const cost = calcUnitCost(unit, wbData)
  const eq = unit.equipment
  const noEquip = hasNoEquipment(unitDef)

  const meleeItems = (eq.melee || []).map(m => ({
    name: m, icon: '⚔', cat: 'melee', cost: getEquipCost(m, 'melee'), slots: getMeleeSlots(m),
  }))
  const rangedItems = (eq.ranged || []).map(r => ({
    name: r, icon: '🏹', cat: 'ranged', cost: getEquipCost(r, 'ranged'),
  }))
  const armourItem = eq.armour ? [{
    name: eq.armour, icon: '🔰', cat: 'armour', cost: getEquipCost(eq.armour, 'armour'),
  }] : []
  const allEquip = [...meleeItems, ...rangedItems, ...armourItem]

  return `
    <div class="roster-unit">
      <div class="roster-unit-header">
        <div class="roster-unit-left">
          <span class="roster-unit-name">${esc(unit.typeName)}</span>
          <span class="roster-unit-cat roster-cat--${unit.category}">${unit.category}</span>
        </div>
        <div class="roster-unit-right">
          <span class="roster-unit-cost">${cost}g</span>
          <button class="btn btn-danger btn-xs" data-action="remove-unit" data-unit-id="${unit.id}" title="Remove unit">✕</button>
        </div>
      </div>
      ${allEquip.length > 0 ? `
        <ul class="equip-list">
          ${allEquip.map(e => `
            <li class="equip-list-item">
              <span class="equip-icon">${e.icon}</span>
              <span class="equip-name">${esc(e.name)}</span>
              <span class="equip-cost">${e.cost}g</span>
            </li>
          `).join('')}
        </ul>
      ` : ''}
      ${!noEquip ? `
        <button class="btn btn-ghost btn-sm equip-open-btn" data-action="open-equip" data-unit-id="${unit.id}">
          ✚ Manage Equipment
        </button>
      ` : '<div class="no-equip-tag">No Equipment</div>'}
    </div>
  `
}

// ─────────────────────────────────────────────────────────────
// VIEW: EQUIPMENT MODAL
// ─────────────────────────────────────────────────────────────

function renderEquipModal(wb, wbData) {
  const unitId = state.equipModalUnitId
  const unit = wb.units.find(u => u.id === unitId)
  if (!unit) return ''

  const unitDef = findUnitDef(wbData, unit.typeName, unit.category)
  if (!unitDef) return ''

  const available = getEquipmentForUnit(wbData, unit.typeName)
  const eq = unit.equipment
  const limits = getSlotLimits(unitDef, unit.category, eq)
  const meleeUsed = getMeleeUsed(eq)
  const rem = goldRemaining(wb)

  function slotBar() {
    if (isSpellcaster(unitDef)) {
      return `<div class="slot-bar">Spellcaster: 1 melee slot, no ranged, no armour</div>`
    }
    if (unit.category === 'hero') {
      const pips = [meleeUsed >= 1, meleeUsed >= 2].map(f =>
        `<span class="slot-pip ${f ? 'slot-pip--used' : ''}"></span>`
      ).join('')
      return `<div class="slot-bar">Melee ${pips} ${meleeUsed}/2 slots · ${(eq.ranged || []).length > 0 ? '🏹 1/1' : '🏹 0/1'} ranged · ${eq.armour ? '🔰 armoured' : '🔰 no armour'}</div>`
    }
    // Henchmen
    const totalWeaponSlots = meleeUsed + ((eq.ranged || []).length > 0 ? 1 : 0)
    return `<div class="slot-bar">Weapon slots: ${totalWeaponSlots}/2 used · ${eq.armour ? '🔰 armoured' : '🔰 no armour'}</div>`
  }

  function removeBtn(displayName, cat) {
    return `<button class="equip-remove-btn" data-action="remove-equip" data-unit-id="${unitId}" data-item="${esc(displayName)}" data-cat="${cat}" title="Remove">✕</button>`
  }

  function meleeItem(displayName) {
    const stats = getMeleeStats(displayName)
    const slots = getMeleeSlots(displayName)
    const cost = stats ? (parseInt(stats.Cost) || 0) : 0
    const count = eq.melee.filter(m => m === displayName).length
    const canAdd = (meleeUsed + slots) <= limits.meleeMax && rem >= cost
    const disabled = !canAdd && count === 0
    const countLabel = count === 0 ? '' : count === 1 ? '✓' : `×${count}`
    const hint = canAdd && count > 0 ? 'Add another (dual wield)' : !canAdd ? 'No slots available' : ''

    return `
      <div class="equip-row ${count > 0 ? 'equip-row--on' : ''} ${disabled ? 'equip-row--off' : ''}"
        ${!disabled ? `data-action="toggle-equip" data-unit-id="${unitId}" data-item="${esc(displayName)}" data-cat="melee"` : ''}
        title="${hint}"
      >
        <span class="equip-row-check">${countLabel}</span>
        <div class="equip-row-info">
          <span class="equip-row-name">${esc(displayName)}</span>
          ${stats?.Effect ? `<span class="equip-row-effect">${esc(stats.Effect)}</span>` : ''}
        </div>
        <div class="equip-row-meta">
          <span class="equip-row-slot">${slots}-slot</span>
          <span class="equip-row-cost">${cost === 0 ? 'Free' : `${cost}g`}</span>
        </div>
        ${count > 0 ? removeBtn(displayName, 'melee') : ''}
      </div>
    `
  }

  function rangedItem(displayName) {
    const stats = getRangedStats(displayName)
    const cost = stats ? (parseInt(stats.Cost) || 0) : 0
    const equipped = (eq.ranged || []).includes(displayName)
    const canAdd = !equipped && (eq.ranged || []).length < limits.rangedMax && rem >= cost
    const disabled = !canAdd && !equipped
    const reason = !canAdd && !equipped ? (limits.rangedMax === 0 ? 'No ranged slot' : "Can't afford") : ''

    return `
      <div class="equip-row ${equipped ? 'equip-row--on' : ''} ${disabled ? 'equip-row--off' : ''}"
        ${canAdd ? `data-action="toggle-equip" data-unit-id="${unitId}" data-item="${esc(displayName)}" data-cat="ranged"` : ''}
        title="${reason}"
      >
        <span class="equip-row-check">${equipped ? '✓' : ''}</span>
        <div class="equip-row-info">
          <span class="equip-row-name">${esc(displayName)}</span>
          <span class="equip-row-effect">${stats ? `${esc(stats.Effect || '')}${stats.Range ? ` · Range ${stats.Range}` : ''}` : ''}</span>
        </div>
        <div class="equip-row-meta">
          <span class="equip-row-cost">${cost === 0 ? 'Free' : `${cost}g`}</span>
        </div>
        ${equipped ? removeBtn(displayName, 'ranged') : ''}
      </div>
    `
  }

  function armourItem(displayName) {
    const stats = getArmourStats(displayName)
    const cost = stats ? (parseInt(stats.Cost) || 0) : 0
    const equipped = eq.armour === displayName
    const canAdd = !equipped && limits.armourMax > 0 && rem >= cost
    const disabled = !canAdd && !equipped
    const reason = !canAdd && !equipped ? (limits.armourMax === 0 ? 'No armour slot' : "Can't afford") : ''

    return `
      <div class="equip-row ${equipped ? 'equip-row--on' : ''} ${disabled ? 'equip-row--off' : ''}"
        ${canAdd ? `data-action="toggle-equip" data-unit-id="${unitId}" data-item="${esc(displayName)}" data-cat="armour"` : ''}
        title="${reason}"
      >
        <span class="equip-row-check">${equipped ? '✓' : ''}</span>
        <div class="equip-row-info">
          <span class="equip-row-name">${esc(displayName)}</span>
          ${stats ? `<span class="equip-row-effect">+${stats.Defense} Defense</span>` : ''}
        </div>
        <div class="equip-row-meta">
          <span class="equip-row-cost">${cost === 0 ? 'Free' : `${cost}g`}</span>
        </div>
        ${equipped ? removeBtn(displayName, 'armour') : ''}
      </div>
    `
  }

  const hasAny = available.melee.length > 0 || available.ranged.length > 0 || available.armour.length > 0

  return `
    <div class="modal-overlay" data-action="close-equip">
      <div class="modal equip-modal">
        <div class="modal-header">
          <div>
            <h3>${esc(unit.typeName)} — Equipment</h3>
            ${slotBar()}
          </div>
          <button class="modal-close" data-action="close-equip">✕</button>
        </div>
        <div class="modal-body equip-modal-body">
          ${!hasAny ? '<p class="no-equip-msg">No equipment available for this unit.</p>' : ''}

          ${available.melee.length > 0 ? `
            <div class="equip-group">
              <div class="equip-group-title">⚔ Melee Weapons</div>
              ${available.melee.map(meleeItem).join('')}
            </div>
          ` : ''}

          ${available.ranged.length > 0 ? `
            <div class="equip-group ${limits.rangedMax === 0 ? 'equip-group--unavail' : ''}">
              <div class="equip-group-title">🏹 Ranged Weapons${limits.rangedMax === 0 ? ' — no ranged slot' : ''}</div>
              ${limits.rangedMax > 0 ? available.ranged.map(rangedItem).join('') : ''}
            </div>
          ` : ''}

          ${available.armour.length > 0 ? `
            <div class="equip-group ${limits.armourMax === 0 ? 'equip-group--unavail' : ''}">
              <div class="equip-group-title">🔰 Armour${limits.armourMax === 0 ? ' — no armour slot' : ''}</div>
              ${limits.armourMax > 0 ? available.armour.map(armourItem).join('') : ''}
            </div>
          ` : ''}
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" data-action="close-equip">Done</button>
        </div>
      </div>
    </div>
  `
}

// ─────────────────────────────────────────────────────────────
// VIEW: VIEW WARBAND (read-only summary)
// ─────────────────────────────────────────────────────────────

function renderViewWarband() {
  const wb = currentWarband()
  if (!wb) return renderHome()

  const wbData = WARBANDS[wb.type]
  const spent = calcTotalSpent(wb)
  const rem = STARTING_GOLD - spent

  const heroes = wb.units.filter(u => u.category === 'hero')
  const henchmen = wb.units.filter(u => u.category === 'henchman')

  function unitRow(unit) {
    const unitDef = findUnitDef(wbData, unit.typeName, unit.category)
    const cost = calcUnitCost(unit, wbData)
    const eq = unit.equipment
    const allEquip = [
      ...(eq.melee || []).map(m => `⚔ ${m}`),
      ...(eq.ranged || []).map(r => `🏹 ${r}`),
      ...(eq.armour ? [`🔰 ${eq.armour}`] : []),
    ]
    return `
      <tr>
        <td class="view-unit-cell">
          <div class="view-unit-name">${esc(unit.typeName)}</div>
          ${allEquip.length ? `<div class="view-unit-equip">${allEquip.map(esc).join('  ·  ')}</div>` : ''}
        </td>
        ${unitDef ? `
          <td>${statVal(unitDef.Move)}"</td>
          <td>${statVal(unitDef.Melee)}</td>
          <td>${statVal(unitDef.Ranged)}</td>
          <td>${statVal(unitDef.Defense)}</td>
          <td>${statVal(unitDef.Agility)}</td>
          <td>${statVal(unitDef.Attacks)}</td>
          <td>${statVal(unitDef.Wounds)}</td>
        ` : `<td colspan="7">—</td>`}
        <td class="view-cost-cell">${cost}g</td>
      </tr>
    `
  }

  const thead = `
    <thead><tr>
      <th>Unit</th><th>Mov</th><th>Mel</th><th>Rng</th>
      <th>Def</th><th>Agi</th><th>Atk</th><th>Wnd</th><th>Cost</th>
    </tr></thead>
  `

  return `
    <div class="view-warband">
      <header class="view-header">
        <button class="btn btn-ghost" data-action="nav-builder">← Edit</button>
        <div class="view-header-center">
          <h1 class="view-title">${esc(wb.name)}</h1>
          <div class="view-type">${esc(wb.type)}</div>
        </div>
        <button class="btn btn-ghost" onclick="window.print()">🖨 Print</button>
      </header>

      <div class="view-summary-bar">
        <div class="summary-item">
          <span class="summary-label">Units</span>
          <span class="summary-value">${wb.units.length} / ${wbData?.['Max Units'] || '?'}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Spent</span>
          <span class="summary-value">${spent}g / ${STARTING_GOLD}g</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Remaining</span>
          <span class="summary-value ${rem < 0 ? 'text-danger' : ''}">${rem}g</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Rout At</span>
          <span class="summary-value">${wbData?.['Rout Threshold'] || '—'} down</span>
        </div>
      </div>

      ${heroes.length > 0 ? `
        <section class="view-unit-section">
          <h2>Heroes</h2>
          <div class="table-wrap">
            <table class="unit-table">${thead}<tbody>${heroes.map(unitRow).join('')}</tbody></table>
          </div>
        </section>
      ` : ''}

      ${henchmen.length > 0 ? `
        <section class="view-unit-section">
          <h2>Henchmen</h2>
          <div class="table-wrap">
            <table class="unit-table">${thead}<tbody>${henchmen.map(unitRow).join('')}</tbody></table>
          </div>
        </section>
      ` : ''}

      ${wb.units.length === 0 ? `
        <div class="view-empty">
          <p>No units in this warband.</p>
          <button class="btn btn-primary" data-action="nav-builder">Add Units</button>
        </div>
      ` : ''}

      ${wbData?.['Special Rules'] && Object.keys(wbData['Special Rules']).length > 0 ? `
        <section class="view-special-rules">
          <h2>Special Rules</h2>
          ${Object.entries(wbData['Special Rules']).map(([name, desc]) => `
            <div class="view-special-rule"><strong>${esc(name)}:</strong> ${esc(desc)}</div>
          `).join('')}
        </section>
      ` : ''}
    </div>
  `
}

// ─────────────────────────────────────────────────────────────
// MAIN RENDER
// ─────────────────────────────────────────────────────────────

function render() {
  const app = document.getElementById('app')
  if (!app) return

  switch (state.view) {
    case 'home':
      app.innerHTML = renderHome()
      break
    case 'select-type':
      app.innerHTML = renderHome() + renderSelectTypeModal()
      break
    case 'builder':
      app.innerHTML = renderBuilder()
      break
    case 'view-warband':
      app.innerHTML = renderViewWarband()
      break
    default:
      app.innerHTML = renderHome()
  }
}

// ─────────────────────────────────────────────────────────────
// EVENT HANDLING
// ─────────────────────────────────────────────────────────────

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]')
  if (!el) return

  const action = el.dataset.action

  switch (action) {
    case 'select-type':
      state.selectedType = el.dataset.type
      state.view = 'select-type'
      render()
      break

    case 'close-select-modal':
      // Skip if the action bubbled from empty modal content up to the overlay backdrop.
      // Only fire when clicking an explicit close button OR the bare backdrop itself.
      if (el.classList.contains('modal-overlay') && e.target.closest('.modal')) break
      state.view = 'home'
      state.selectedType = null
      render()
      break

    case 'create-warband': {
      const input = document.getElementById('wb-name-input')
      createWarband(el.dataset.type, input?.value || '')
      break
    }

    case 'open-builder':
      state.currentId = el.dataset.id
      state.view = 'builder'
      state.mobileTab = 'roster'
      state.equipModalUnitId = null
      render()
      window.scrollTo(0, 0)
      break

    case 'open-view':
      if (el.dataset.id) state.currentId = el.dataset.id
      state.view = 'view-warband'
      state.equipModalUnitId = null
      render()
      window.scrollTo(0, 0)
      break

    case 'delete-warband':
      if (confirm('Delete this warband? This cannot be undone.')) {
        deleteWarband(el.dataset.id)
      }
      break

    case 'nav-home':
      state.view = 'home'
      state.equipModalUnitId = null
      render()
      window.scrollTo(0, 0)
      break

    case 'nav-builder':
      state.view = 'builder'
      state.equipModalUnitId = null
      render()
      window.scrollTo(0, 0)
      break

    case 'buy-hero-slot': {
      const wb = currentWarband()
      if (!wb) break
      const cost = getNextHeroSlotCost(wb)
      if (cost === null || goldRemaining(wb) < cost) break
      mutateWarband(wb => { wb.heroSlotsPurchased = (wb.heroSlotsPurchased || 0) + 1 })
      break
    }

    case 'add-unit':
      addUnit(el.dataset.unitName, el.dataset.unitCat)
      break

    case 'remove-unit':
      removeUnit(el.dataset.unitId)
      break

    case 'set-tab':
      state.mobileTab = el.dataset.tab
      render()
      break

    case 'open-equip':
      state.equipModalUnitId = el.dataset.unitId
      render()
      break

    case 'close-equip':
      // Same backdrop-vs-content guard as close-select-modal above.
      if (el.classList.contains('modal-overlay') && e.target.closest('.modal')) break
      state.equipModalUnitId = null
      render()
      break

    case 'toggle-equip':
      toggleEquip(el.dataset.unitId, el.dataset.item, el.dataset.cat)
      break

    case 'remove-equip':
      removeEquip(el.dataset.unitId, el.dataset.item, el.dataset.cat)
      break
  }
})

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (state.equipModalUnitId) {
      state.equipModalUnitId = null
      render()
    } else if (state.view === 'select-type') {
      state.view = 'home'
      render()
    }
  }
  if (e.key === 'Enter' && state.view === 'select-type') {
    const input = document.getElementById('wb-name-input')
    if (input && document.activeElement === input) {
      createWarband(state.selectedType, input.value)
    }
  }
})

// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────

render()
