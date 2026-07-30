import './style.css'
import JSON5 from 'json5'
import { generateWarbandPDF, generateCardsPDF } from './pdf-export.js'
import meleeData from '../../static/jsondata/melee-weapons.json'
import rangedData from '../../static/jsondata/ranged-weapons.json'
import armourData from '../../static/jsondata/armour.json'
import aliasData from '../../static/jsondata/aliases.json'
import skillsData from '../../static/jsondata/skills.json'
import spellsData from '../../static/jsondata/spells.json'
import rangedEffectsData from '../../static/jsondata/ranged-weapon-effects.json'
import neutralHeroesData from '../../static/jsondata/neutral_heroes.json'

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
const HERO_SLOT_COSTS = [60, 100, 140]

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
  const primaryArr = category === 'hero' ? (wbData.Heroes || []) : (wbData.Henchmen || [])
  const found = primaryArr.find(u => u.Name === typeName)
  if (found) return found
  // Fallback for promoted henchmen (category='hero' but name in Henchmen list)
  const otherArr = category === 'hero' ? (wbData.Henchmen || []) : (wbData.Heroes || [])
  return otherArr.find(u => u.Name === typeName) || null
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

function sortUnits(units, wbData) {
  const heroOrder = (wbData.Heroes || []).map(h => h.Name)
  const henchOrder = (wbData.Henchmen || []).map(h => h.Name)
  return [...units].sort((a, b) => {
    const aHero = a.category === 'hero'
    const bHero = b.category === 'hero'
    if (aHero !== bHero) return aHero ? -1 : 1
    const order = aHero ? heroOrder : henchOrder
    return order.indexOf(a.typeName) - order.indexOf(b.typeName)
  })
}

function hasShield(eq) {
  return (eq.melee || []).some(name => {
    const key = resolveAlias(name, 'Melee Weapons')
    return key === 'Shield' || key === 'Tower Shield'
  })
}

function isLightRanged(displayName) {
  const stats = getRangedStats(displayName)
  if (!stats || !stats.Effect) return false
  return stats.Effect.split(',').map(s => s.trim()).includes('Light')
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
  return BASE_HERO_SLOTS + (wb.heroSlotsPurchased || 0) + (wb.promotedHeroSlots || 0)
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

  const baseCost = parseInt(unitDef.Cost) || 0
  const cap = getUnitCap(unitDef)
  const count = warband.units.filter(u => u.typeName === unitDef.Name).length
  if (baseCost === 0 && count >= 1) return { ok: false, reason: 'Free units limited to one' }
  if (cap !== Infinity && count >= cap) return { ok: false, reason: 'At Cap' }

  if (!warband.campaignMode && goldRemaining(warband) < baseCost) return { ok: false, reason: "Can't Afford" }

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

function duplicateUnit(unitId) {
  const wb = currentWarband()
  if (!wb) return
  const unit = wb.units.find(u => u.id === unitId)
  if (!unit) return
  const wbData = WARBANDS[wb.type]
  const unitDef = findUnitDef(wbData, unit.typeName, unit.category)
  if (!unitDef) return
  const check = canAddUnit(wb, unitDef, unit.category)
  if (!check.ok) return
  const equipCost = calcUnitCost(unit, wbData) - (parseInt(unitDef.Cost) || 0)
  if (!wb.campaignMode && goldRemaining(wb) < (parseInt(unitDef.Cost) || 0) + equipCost) return
  mutateWarband(wb => {
    wb.units.push({
      id: uid(),
      typeName: unit.typeName,
      category: unit.category,
      equipment: {
        melee: [...unit.equipment.melee],
        ranged: [...unit.equipment.ranged],
        armour: unit.equipment.armour,
      },
    })
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
      if (!wb.campaignMode && goldRemaining(wb) < cost - oldCost) return
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
    const resolvedName = resolveAlias(itemName, 'Melee Weapons')
    const isShield = resolvedName === 'Shield' || resolvedName === 'Tower Shield'
    if (isShield && hasShield(eq)) {
      // Swap shields: remove the existing shield and add the new one
      const existingShield = eq.melee.find(n => {
        const r = resolveAlias(n, 'Melee Weapons')
        return r === 'Shield' || r === 'Tower Shield'
      })
      if (!existingShield || existingShield === itemName) return
      if (!wb.campaignMode && goldRemaining(wb) < getEquipCost(itemName, 'melee') - getEquipCost(existingShield, 'melee')) return
      mutateWarband(wb => {
        const u = wb.units.find(u => u.id === unitId)
        u.equipment.melee = u.equipment.melee.filter(n => n !== existingShield)
        u.equipment.melee.push(itemName)
      })
      return
    }
    if (isShield && (eq.ranged || []).some(r => !isLightRanged(r))) return
    if (!wb.campaignMode && goldRemaining(wb) < getEquipCost(itemName, 'melee')) return
    mutateWarband(wb => {
      wb.units.find(u => u.id === unitId).equipment.melee.push(itemName)
    })
  } else if (category === 'ranged') {
    const limits = getSlotLimits(unitDef, unit.category, eq)
    if (eq.ranged.includes(itemName)) return  // already equipped; use ✕ to remove
    if (eq.ranged.length >= limits.rangedMax) return
    if (hasShield(eq) && !isLightRanged(itemName)) return
    if (!wb.campaignMode && goldRemaining(wb) < getEquipCost(itemName, 'ranged')) return
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

function exportWarband(id) {
  const wb = state.savedWarbands.find(w => w.id === id)
  if (!wb) return
  const blob = new Blob([JSON.stringify(wb, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${wb.name.replace(/[^a-z0-9]/gi, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importWarband(file) {
  const reader = new FileReader()
  reader.onload = e => {
    try {
      const wb = JSON.parse(e.target.result)
      if (!wb.name || !wb.type || !Array.isArray(wb.units)) {
        alert('Invalid warband file.')
        return
      }
      if (!WARBANDS[wb.type]) {
        alert(`Unknown warband type: "${wb.type}". Make sure this file is for this version of the game.`)
        return
      }
      wb.id = uid()
      wb.createdAt = Date.now()
      state.savedWarbands.push(wb)
      persistState()
      render()
    } catch {
      alert('Could not read file. Make sure it is a valid warband JSON.')
    }
  }
  reader.readAsText(file)
}

// ─────────────────────────────────────────────────────────────
// CAMPAIGN MODE
// ─────────────────────────────────────────────────────────────

function enableCampaignMode() {
  mutateWarband(wb => { wb.campaignMode = true })
}

function updateCampaignField(field, value) {
  mutateWarband(wb => {
    if (!wb.campaign) wb.campaign = {}
    wb.campaign[field] = value
  })
}

function updateNeutralHeroName(idx, name) {
  mutateWarband(wb => {
    if (!wb.campaign) wb.campaign = {}
    if (!wb.campaign.neutralHeroes) wb.campaign.neutralHeroes = [{}, {}, {}]
    wb.campaign.neutralHeroes[idx] = { ...wb.campaign.neutralHeroes[idx], name }
  })
}

function updateNeutralHeroProgress(idx, delta) {
  mutateWarband(wb => {
    if (!wb.campaign) wb.campaign = {}
    if (!wb.campaign.neutralHeroes) wb.campaign.neutralHeroes = [{}, {}, {}]
    const nh = wb.campaign.neutralHeroes[idx] || {}
    nh.progress = Math.max(0, Math.min(12, (nh.progress || 0) + delta))
    wb.campaign.neutralHeroes[idx] = nh
  })
}

function updateUnitStat(unitId, stat, value) {
  const wb = currentWarband()
  if (!wb) return
  const u = wb.units.find(u => u.id === unitId)
  if (!u) return
  if (!u.statOverrides) u.statOverrides = {}
  if (value === '') delete u.statOverrides[stat]
  else u.statOverrides[stat] = clampStat(stat, value)
  persistState()
  // No render() — preserves input focus while typing
}

function updateUnitNotes(unitId, notes) {
  const wb = currentWarband()
  if (!wb) return
  const u = wb.units.find(u => u.id === unitId)
  if (!u) return
  u.notes = notes
  persistState()
}

function toggleUnitFlag(unitId, flag) {
  const wb = currentWarband()
  if (!wb) return
  const u = wb.units.find(u => u.id === unitId)
  if (!u) return
  u[flag] = !u[flag]
  persistState()
  render()
}

function updateUnitCustomName(unitId, name) {
  const wb = currentWarband()
  if (!wb) return
  const u = wb.units.find(u => u.id === unitId)
  if (!u) return
  u.customName = name.trim() || undefined
  persistState()
}

function addExtraSkill(unitId, skillName) {
  mutateWarband(wb => {
    const u = wb.units.find(u => u.id === unitId)
    if (!u) return
    if (!u.extraSkills) u.extraSkills = []
    if (!u.extraSkills.includes(skillName)) u.extraSkills.push(skillName)
  })
}

function removeExtraSkill(unitId, skillName) {
  mutateWarband(wb => {
    const u = wb.units.find(u => u.id === unitId)
    if (!u) return
    u.extraSkills = (u.extraSkills || []).filter(s => s !== skillName)
  })
}

function promoteToHero(unitId) {
  mutateWarband(wb => {
    const u = wb.units.find(u => u.id === unitId)
    if (!u || u.category !== 'henchman') return
    u.category = 'hero'
    u.promoted = true
    wb.promotedHeroSlots = (wb.promotedHeroSlots || 0) + 1
  })
}

function getAvailableSkillsForUnit(wbData, unit) {
  const availSkills = wbData['Available Skills']?.[unit.typeName] || {}
  const categoryMap = {
    Mel: 'Melee', Rng: 'Ranged', Def: 'Defence',
    Agi: 'Agility', Mrl: 'Morale', Special: wbData.Name,
  }
  const allowedTypes = new Set()
  for (const [short, val] of Object.entries(availSkills)) {
    if (String(val).toLowerCase() === 'x') {
      const type = categoryMap[short]
      if (type) allowedTypes.add(type)
    }
  }
  const unitDef = findUnitDef(wbData, unit.typeName, unit.category)
  const existingSkills = new Set([
    ...(unitDef?.Skills || []),
    ...(unit.extraSkills || []),
  ])
  return Object.entries(skillsData)
    .filter(([name, data]) => allowedTypes.has(data.Type) && !existingSkills.has(name))
    .map(([name]) => name)
    .sort((a, b) => a.localeCompare(b))
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

// Stats that have a minimum value of 5 in the game rules
const STAT_MIN5 = new Set(['Melee', 'Ranged', 'Defence', 'Agility', 'Morale'])

function clampStat(statName, value) {
  if (!STAT_MIN5.has(statName)) return value
  const n = parseInt(value)
  return isNaN(n) ? value : String(Math.max(5, n))
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
      <div class="section-title-row">
        <h2 class="section-title">Your Warbands</h2>
        <label class="btn btn-ghost btn-sm import-btn" title="Import warband from file">
          ↑ Import
          <input type="file" accept=".json" data-action="import-warband" style="display:none" />
        </label>
      </div>
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
                <button class="btn btn-ghost btn-sm" data-action="export-warband" data-id="${wb.id}" title="Export as file">↓</button>
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

      ${saved.length === 0 ? `
        <section class="home-section">
          <div class="section-title-row">
            <h2 class="section-title">Your Warbands</h2>
            <label class="btn btn-ghost btn-sm import-btn" title="Import warband from file">
              ↑ Import
              <input type="file" accept=".json" data-action="import-warband" style="display:none" />
            </label>
          </div>
        </section>
      ` : ''}

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
  const isCampaign = !!wb.campaignMode

  return `
    <div class="builder-view">
      <header class="builder-header">
        <button class="btn btn-ghost btn-back" data-action="nav-home">← Back</button>
        <div class="builder-header-center">
          <div class="builder-wb-name">${esc(wb.name)}</div>
          <div class="builder-wb-type">${esc(wb.type)}${isCampaign ? ' <span class="campaign-badge">⚔ Campaign</span>' : ''}</div>
        </div>
        <div class="builder-stats-row">
          ${isCampaign ? `
            <div class="stat-chip">
              <span class="stat-chip-label">Total</span>
              <span class="stat-chip-value">${spent}g</span>
            </div>
          ` : `
            <div class="stat-chip ${overBudget ? 'stat-chip--danger' : rem < 50 ? 'stat-chip--warn' : ''}">
              <span class="stat-chip-label">Gold</span>
              <span class="stat-chip-value">${rem}g</span>
            </div>
          `}
          <div class="stat-chip ${unitCount >= maxUnits ? 'stat-chip--danger' : ''}">
            <span class="stat-chip-label">Units</span>
            <span class="stat-chip-value">${unitCount}/${maxUnits}</span>
          </div>
        </div>
        ${isCampaign ? '' : `<button class="btn btn-outline btn-sm" data-action="enable-campaign">⚔ Campaign Mode</button>`}
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

      ${isCampaign ? renderCampaignInfo(wb) : ''}

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
          <span title="Defence">Def ${statVal(unitDef.Defence)}</span>
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
  const canBuySlot = nextSlotCost !== null && (wb.campaignMode || goldRemaining(wb) >= nextSlotCost)

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

function renderCampaignInfo(wb) {
  const c = wb.campaign || {}
  const neutralHeroes = c.neutralHeroes || [{}, {}, {}]
  const heroNames = Object.keys(neutralHeroesData)

  return `
    <div class="campaign-info">
      <div class="campaign-fields">
        <label class="campaign-field">
          <span class="campaign-field-label">Player</span>
          <input class="campaign-field-input" type="text" value="${esc(c.playerName || '')}"
            data-action="campaign-field" data-field="playerName" placeholder="Player name" />
        </label>
        <label class="campaign-field">
          <span class="campaign-field-label">Wins</span>
          <input class="campaign-field-input campaign-field-input--num" type="number" min="0" value="${c.wins || 0}"
            data-action="campaign-field" data-field="wins" />
        </label>
        <label class="campaign-field">
          <span class="campaign-field-label">Losses</span>
          <input class="campaign-field-input campaign-field-input--num" type="number" min="0" value="${c.losses || 0}"
            data-action="campaign-field" data-field="losses" />
        </label>
        <label class="campaign-field">
          <span class="campaign-field-label">Gold Reserve</span>
          <input class="campaign-field-input campaign-field-input--num" type="number" min="0" value="${c.goldReserve || 0}"
            data-action="campaign-field" data-field="goldReserve" />
        </label>
        <label class="campaign-field campaign-field--wide">
          <span class="campaign-field-label">Stored Equipment</span>
          <input class="campaign-field-input" type="text" value="${esc(c.storedEquipment || '')}"
            data-action="campaign-field" data-field="storedEquipment" placeholder="Items in storage..." />
        </label>
      </div>
      <div class="campaign-neutral-heroes">
        <div class="campaign-nh-title">Aligned Neutral Heroes</div>
        ${neutralHeroes.slice(0, 3).map((nh, i) => `
          <div class="campaign-nh-row">
            <select class="campaign-nh-select" data-action="neutral-hero-select" data-idx="${i}">
              <option value="">— None —</option>
              ${heroNames.map(name => `<option value="${esc(name)}" ${nh.name === name ? 'selected' : ''}>${esc(name)}</option>`).join('')}
            </select>
            <div class="campaign-nh-progress">
              <button class="btn btn-xs btn-ghost" data-action="neutral-hero-progress" data-idx="${i}" data-delta="-1">−</button>
              <div class="campaign-nh-pips">
                ${Array.from({length: 12}, (_, j) => `<span class="nh-pip${j < (nh.progress || 0) ? ' nh-pip--filled' : ''}"></span>`).join('')}
              </div>
              <span class="campaign-nh-count">${nh.progress || 0}/12</span>
              <button class="btn btn-xs btn-ghost" data-action="neutral-hero-progress" data-idx="${i}" data-delta="1">+</button>
            </div>
          </div>
        `).join('')}
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
      ${sortUnits(wb.units, wbData).map(unit => renderRosterUnit(unit, wb, wbData)).join('')}
    </div>
  `
}

function renderRosterUnit(unit, wb, wbData) {
  const unitDef = findUnitDef(wbData, unit.typeName, unit.category)
  if (!unitDef) return ''

  const cost = calcUnitCost(unit, wbData)
  const eq = unit.equipment
  const noEquip = hasNoEquipment(unitDef)
  const isCampaign = !!wb.campaignMode
  const isHero = unit.category === 'hero'

  const meleeItems = (eq.melee || []).map(m => ({
    name: m, icon: '⚔', cat: 'melee', cost: getEquipCost(m, 'melee'),
  }))
  const rangedItems = (eq.ranged || []).map(r => ({
    name: r, icon: '🏹', cat: 'ranged', cost: getEquipCost(r, 'ranged'),
  }))
  const armourItem = eq.armour ? [{
    name: eq.armour, icon: '🔰', cat: 'armour', cost: getEquipCost(eq.armour, 'armour'),
  }] : []
  const allEquip = [...meleeItems, ...rangedItems, ...armourItem]

  const STATS = ['Move','Melee','Ranged','Defence','Agility','Morale','Attacks','Wounds','Injury','Piercing']
  const SHORT = ['Mov','Mel','Rgd','Def','Agi','Mrl','Atk','Wnd','Inj','Prc']

  const statOverridesSection = isCampaign ? `
    <div class="campaign-stat-overrides">
      ${STATS.map((stat, i) => {
        const base = unitDef[stat] ?? ''
        const current = unit.statOverrides?.[stat] ?? base
        const changed = unit.statOverrides?.[stat] !== undefined
        return `<label class="stat-override-item${changed ? ' stat-override--changed' : ''}">
          <span class="stat-override-label">${SHORT[i]}</span>
          <input class="stat-override-input" type="text" value="${esc(String(current))}"
            data-action="stat-override" data-unit-id="${unit.id}" data-stat="${stat}" />
        </label>`
      }).join('')}
    </div>
  ` : ''

  const extraSkills = unit.extraSkills || []
  const availableSkills = isCampaign && isHero ? getAvailableSkillsForUnit(wbData, unit) : []

  const skillManagerSection = isCampaign && isHero ? `
    <div class="campaign-skill-manager">
      ${extraSkills.length > 0 ? `
        <div class="campaign-extra-skills">
          ${extraSkills.map(s => `
            <span class="campaign-skill-tag">
              ${esc(s)}
              <button class="skill-remove-btn" data-action="remove-extra-skill" data-unit-id="${unit.id}" data-skill="${esc(s)}">✕</button>
            </span>
          `).join('')}
        </div>
      ` : ''}
      ${availableSkills.length > 0 ? `
        <select class="campaign-skill-select" data-action="add-extra-skill" data-unit-id="${unit.id}">
          <option value="">+ Learn skill...</option>
          ${availableSkills.map(name => `<option value="${esc(name)}">${esc(name)}</option>`).join('')}
        </select>
      ` : (extraSkills.length > 0 ? '' : '<span class="campaign-no-skills">No learnable skills</span>')}
    </div>
  ` : ''

  const notesSection = isCampaign && isHero ? `
    <input class="campaign-notes-input" type="text"
      placeholder="Notes (injuries, blight...)"
      value="${esc(unit.notes || '')}"
      data-action="unit-notes" data-unit-id="${unit.id}" />
  ` : ''

  const promoteBtn = isCampaign && !isHero ? `
    <button class="btn btn-outline btn-xs" data-action="promote-hero" data-unit-id="${unit.id}" title="Promote to Hero">↑ Promote</button>
  ` : ''

  return `
    <div class="roster-unit${isCampaign ? ' roster-unit--campaign' : ''}">
      <div class="roster-unit-header">
        <div class="roster-unit-left">
          <span class="roster-unit-name">${esc(unit.typeName)}</span>
          ${unit.promoted ? '<span class="promoted-badge">promoted</span>' : ''}
          <span class="roster-unit-cat roster-cat--${unit.category}">${unit.category}</span>
        </div>
        <div class="roster-unit-right">
          <span class="roster-unit-cost">${cost}g</span>
          ${promoteBtn}
          <button class="btn btn-ghost btn-xs" data-action="duplicate-unit" data-unit-id="${unit.id}" title="Duplicate unit">⧉</button>
          <button class="btn btn-danger btn-xs" data-action="remove-unit" data-unit-id="${unit.id}" title="Remove unit">✕</button>
        </div>
      </div>
      <input class="unit-custom-name-input" type="text"
        placeholder="Name this unit (optional)"
        value="${esc(unit.customName || '')}"
        data-action="unit-custom-name" data-unit-id="${unit.id}" />
      <div class="unit-flags">
        <label class="unit-flag${unit.blight ? ' unit-flag--active' : ''}">
          <input type="checkbox" ${unit.blight ? 'checked' : ''}
            data-action="toggle-flag" data-unit-id="${unit.id}" data-flag="blight" />
          Blight
        </label>
        ${isHero ? `
          <label class="unit-flag${unit.deathtouched ? ' unit-flag--active unit-flag--death' : ''}">
            <input type="checkbox" ${unit.deathtouched ? 'checked' : ''}
              data-action="toggle-flag" data-unit-id="${unit.id}" data-flag="deathtouched" />
            Deathtouched
          </label>
        ` : ''}
      </div>
      ${statOverridesSection}
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
      ${skillManagerSection}
      ${notesSection}
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
    const resolvedMelee = resolveAlias(displayName, 'Melee Weapons')
    const isShieldItem = resolvedMelee === 'Shield' || resolvedMelee === 'Tower Shield'
    const shieldBlockedByShield = isShieldItem && hasShield(eq)
    const shieldBlockedByRanged = isShieldItem && (eq.ranged || []).some(r => !isLightRanged(r))
    const canAdd = (meleeUsed + slots) <= limits.meleeMax && (wb.campaignMode || rem >= cost) && !shieldBlockedByShield && !shieldBlockedByRanged
    const disabled = !canAdd && count === 0
    const countLabel = count === 0 ? '' : count === 1 ? '✓' : `×${count}`
    const hint = canAdd && count > 0 ? 'Add another (dual wield)' : shieldBlockedByShield ? 'Already carrying a shield' : shieldBlockedByRanged ? 'Incompatible with non-light ranged weapon' : !canAdd ? 'No slots available' : ''

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
    const shieldBlocked = hasShield(eq) && !isLightRanged(displayName)
    const canAdd = !equipped && (eq.ranged || []).length < limits.rangedMax && (wb.campaignMode || rem >= cost) && !shieldBlocked
    const disabled = !canAdd && !equipped
    const reason = !canAdd && !equipped ? (shieldBlocked ? 'Incompatible with shield' : limits.rangedMax === 0 ? 'No ranged slot' : "Can't afford") : ''

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
    const canAdd = !equipped && limits.armourMax > 0 && (wb.campaignMode || rem >= cost)
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
          ${stats ? `<span class="equip-row-effect">+${stats.Defence} Defence</span>` : ''}
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
// PDF EXPORT
// ─────────────────────────────────────────────────────────────

function buildUnitStats(unitDef, unit) {
  const get = s => unit?.statOverrides?.[s] ?? unitDef?.[s]
  const stats = {}
  const add = (key, s) => {
    const raw = get(s)
    if (raw != null && raw !== '') stats[key] = clampStat(s, String(raw))
  }
  add('mov', 'Move')
  const mov = parseInt(get('Move'))
  if (!isNaN(mov)) stats.run = String(mov + 3)
  add('mel', 'Melee')
  add('rgd', 'Ranged')
  add('def', 'Defence')
  add('agi', 'Agility')
  add('mrl', 'Morale')
  add('atk', 'Attacks')
  add('wnd', 'Wounds')
  add('inj', 'Injury')
  add('prc', 'Piercing')
  return stats
}

// Build weapon rows with calculated stats — mirrors the equipRows logic in renderViewWarband.
function buildWeaponRows(unitDef, unit, eq, maxRows) {
  const get = s => unit?.statOverrides?.[s] ?? unitDef?.[s]
  const baseMel = Math.max(5, parseInt(get('Melee'))    || 0)
  const baseDef = Math.max(5, parseInt(get('Defence'))  || 0)
  const baseInj = parseInt(get('Injury'))   || 0
  const basePrc = parseInt(get('Piercing')) || 0

  // Group melee weapons by name to collapse dual-wield into one row
  const meleeGroups = {}
  for (const name of (eq.melee || [])) meleeGroups[name] = (meleeGroups[name] || 0) + 1

  const rows = []
  for (const [name, count] of Object.entries(meleeGroups)) {
    if (rows.length >= maxRows) break
    const stats = getMeleeStats(name)
    const resolved = resolveAlias(name, 'Melee Weapons')
    const isShield = resolved === 'Shield' || resolved === 'Tower Shield'
    const s = {}
    if (stats) {
      if (isShield) {
        const m = (stats.Effect || '').match(/\+(\d+)\s*Def/)
        if (m) s.def = String(Math.max(5, baseDef - parseInt(m[1])))
      } else {
        const mel = parseInt(stats.Melee) || 0
        const inj = parseInt(stats.Injury) || 0
        const prc = parseInt(stats.Piercing) || 0
        if (mel !== 0) s.mel = String(Math.max(5, baseMel - mel))
        if (inj !== 0) s.inj = String(baseInj + inj)
        if (prc !== 0) s.prc = String(basePrc + prc)
      }
    }
    if (count > 1) {
      const baseAtk = parseInt(get('Attacks')) || 0
      s.atk = String(baseAtk + 1)
    }
    const label = count > 1 ? `2x ${name}` : name
    const effect = (stats?.Effect && !isShield) ? stats.Effect : ''
    rows.push({ label, stats: s, effect })
  }
  for (const name of (eq.ranged || [])) {
    if (rows.length >= maxRows) break
    const stats = getRangedStats(name)
    const s = {}
    if (stats) {
      const inj = parseInt(stats.Injury) || 0
      const prc = parseInt(stats.Piercing) || 0
      if (inj !== 0) s.inj = String(inj)
      if (prc !== 0) s.prc = String(prc)
    }
    const effectParts = [stats?.Range, stats?.Effect].filter(Boolean)
    const effectDesc = effectParts.length ? `${name}: ${effectParts.join(', ')}` : name
    rows.push({ label: name, stats: s, effect: effectDesc })
  }
  return rows
}

function buildPDFPayload(wb, wbData) {
  const sorted    = sortUnits(wb.units, wbData)
  const heroUnits = sorted.filter(u => u.category === 'hero')
  const henchUnits = sorted.filter(u => u.category === 'henchman')

  const heroes = heroUnits.map(unit => {
    const def = findUnitDef(wbData, unit.typeName, unit.category)
    const wRows = buildWeaponRows(def, unit, unit.equipment, 2)
    const skillNames = [...(def?.Skills || []), ...(unit.extraSkills || [])]
    const skillLines = skillNames.map(name => {
      const desc = skillsData[name]?.Description
      return desc ? `${name}: ${desc}` : name
    })
    return {
      name:           unit.customName || '',
      type:           unit.typeName,
      deathtouched:   unit.deathtouched ? 'Yes' : '',
      blight:         unit.blight ? 'Yes' : '',
      base_stats:     buildUnitStats(def, unit),
      advances:       wRows.map(w => w.stats),
      advance_labels: wRows.map(w => w.label),
      special: [...skillLines, ...wRows.map(w => w.effect)].filter(Boolean),
    }
  })

  // Group henchmen by type, count duplicates
  const henchGroups = {}
  for (const unit of henchUnits) {
    if (!henchGroups[unit.typeName]) {
      const def = findUnitDef(wbData, unit.typeName, unit.category)
      const wRows = buildWeaponRows(def, unit, unit.equipment, 3)
      const skillNames = [...(def?.Skills || []), ...(unit.extraSkills || [])]
      const skillLines = skillNames.map(name => {
        const desc = skillsData[name]?.Description
        return desc ? `${name}: ${desc}` : name
      })
      henchGroups[unit.typeName] = {
        name:           unit.customName || '',
        type:           unit.typeName,
        cap:            def?.['Type Cap'] || '',
        count:          0,
        base_stats:     buildUnitStats(def, unit),
        advances:       wRows.map(w => w.stats),
        advance_labels: wRows.map(w => w.label),
        special: [...skillLines, ...wRows.map(w => w.effect)].filter(Boolean),
      }
    }
    henchGroups[unit.typeName].count++
  }

  // Reference page: skills, ranged properties, special rules, spells
  const allSkills = new Set()
  const rangedWeapons = new Map()  // weapon display name → { range, effects[] }
  wb.units.forEach(unit => {
    const def = findUnitDef(wbData, unit.typeName, unit.category)
    ;[...(def?.Skills || []), ...(unit.extraSkills || [])].forEach(s => allSkills.add(s))
    for (const name of (unit.equipment?.ranged || [])) {
      if (!rangedWeapons.has(name)) {
        const stats = getRangedStats(name)
        if (stats) {
          const effects = stats.Effect
            ? stats.Effect.split(',').map(e => e.trim()).filter(Boolean)
            : []
          rangedWeapons.set(name, { range: stats.Range || '', effects })
        }
      }
    }
  })

  const skills = [...allSkills]
    .map(name => ({ name, desc: skillsData[name]?.Description }))
    .filter(e => e.desc)
    .sort((a, b) => a.name.localeCompare(b.name))

  const ranged_properties = [...rangedWeapons.entries()].map(([weaponName, { range, effects }]) => {
    const header = [range, ...effects].filter(Boolean).join(', ')
    const effectDescs = effects
      .map(e => rangedEffectsData[e] ? `${e}: ${rangedEffectsData[e]}` : null)
      .filter(Boolean)
      .join(' ')
    return { name: `${weaponName}: ${header}`, desc: effectDescs || undefined }
  })

  const special_rules = Object.entries(wbData?.['Special Rules'] || {})
    .map(([name, desc]) => ({ name, desc }))

  const spell_tables = (wbData?.['Magic Tables'] || [])
    .map(school => ({
      school,
      spells: Object.values(spellsData)
        .filter(s => s.School === school)
        .map(s => ({ name: s.Name, check: s.Check, description: s.Description })),
    }))
    .filter(t => t.spells.length > 0)

  const c = wb.campaign || {}
  const nhSlots = (c.neutralHeroes || [{}, {}, {}]).slice(0, 3)

  return {
    player_name:       c.playerName || '',
    warband_name:      wb.name,
    warband_type:      wb.type,
    gold:              c.goldReserve != null ? String(c.goldReserve) : String(goldRemaining(wb)),
    rout_threshold:    String(wbData?.['Rout Threshold'] || ''),
    max_units:         String(wbData?.['Max Units'] || ''),
    hero_slots:        String(getHeroSlots(wb)),
    wins:              c.wins != null ? String(c.wins) : '',
    losses:            c.losses != null ? String(c.losses) : '',
    stored_equipment:  c.storedEquipment || '',
    neutral_heroes:    nhSlots.map(nh => ({ name: nh.name || '', progress: nh.progress || 0 })),
    heroes,
    henchmen: Object.values(henchGroups).map(h => ({ ...h, count: String(h.count) })),
    skills,
    ranged_properties,
    special_rules,
    spell_tables,
  }
}

function exportToPDF() {
  const wb = currentWarband()
  if (!wb) return
  const wbData = WARBANDS[wb.type]

  const btn = document.querySelector('[data-action="export-pdf"]')
  if (btn) { btn.disabled = true; btn.textContent = 'Generating…' }

  try {
    const doc = generateWarbandPDF(buildPDFPayload(wb, wbData))
    const url = doc.output('bloburl')
    window.open(url, '_blank')
  } catch (e) {
    console.error('PDF generation failed:', e)
    alert('PDF generation failed — see browser console for details.')
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '📄 Export PDF' }
  }
}

function exportToCards() {
  const wb = currentWarband()
  if (!wb) return
  const wbData = WARBANDS[wb.type]

  const btn = document.querySelector('[data-action="export-cards"]')
  if (btn) { btn.disabled = true; btn.textContent = 'Generating…' }

  try {
    const doc = generateCardsPDF(buildPDFPayload(wb, wbData))
    const url = doc.output('bloburl')
    window.open(url, '_blank')
  } catch (e) {
    console.error('Card PDF generation failed:', e)
    alert('Card PDF generation failed — see browser console for details.')
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🃏 Export Cards' }
  }
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

  const sorted = sortUnits(wb.units, wbData)
  const heroes = sorted.filter(u => u.category === 'hero')
  const henchmen = sorted.filter(u => u.category === 'henchman')

  function equipRows(eq, unitDef, unit) {
    const rows = []
    const get = s => unit?.statOverrides?.[s] ?? unitDef?.[s]
    const baseMel = Math.max(5, parseInt(get('Melee'))    || 0)
    const baseDef = Math.max(5, parseInt(get('Defence'))  || 0)
    const baseInj = parseInt(get('Injury'))   || 0
    const basePrc = parseInt(get('Piercing')) || 0

    // cols: Unit(0) Mov(1) Run(2) Mel(3) Rgd(4) Def(5) Agi(6) Mrl(7) Atk(8) Wnd(9) Inj(10) Prc(11) Cost(12)
    function equipRow(icon, name, cells) {
      const cols = Array(13).fill('')
      cols[0] = `${icon} ${esc(name)}`
      Object.assign(cols, cells)
      return `<tr class="equip-row-view">${cols.map((v, i) =>
        `<td class="${i === 0 ? 'equip-row-name-cell' : 'equip-row-stats-cell'}">${v}</td>`
      ).join('')}</tr>`
    }

    for (const name of (eq.melee || [])) {
      const stats = getMeleeStats(name)
      if (!stats) continue
      const resolvedKey = resolveAlias(name, 'Melee Weapons')
      const isShieldItem = resolvedKey === 'Shield' || resolvedKey === 'Tower Shield'
      const cells = {}
      if (isShieldItem) {
        const m = (stats.Effect || '').match(/\+(\d+)\s*Def/)
        if (m) cells[5] = Math.max(5, baseDef - parseInt(m[1]))
      } else {
        const mel = parseInt(stats.Melee) || 0
        const inj = parseInt(stats.Injury) || 0
        const prc = parseInt(stats.Piercing) || 0
        if (mel !== 0) cells[3] = Math.max(5, baseMel - mel)
        if (inj !== 0) cells[10] = baseInj + inj
        if (prc !== 0) cells[11] = basePrc + prc
      }
      rows.push(equipRow('⚔', name, cells))
    }

    for (const name of (eq.ranged || [])) {
      const stats = getRangedStats(name)
      if (!stats) continue
      const cells = {}
      const inj = parseInt(stats.Injury) || 0
      const prc = parseInt(stats.Piercing) || 0
      if (inj !== 0) cells[10] = inj
      if (prc !== 0) cells[11] = prc
      const label = stats.Range ? `${esc(name)} (${esc(stats.Range)})` : esc(name)
      const effect = stats.Effect ? `<div class="equip-row-effect">${esc(stats.Effect)}</div>` : ''
      rows.push(`<tr class="equip-row-view">${Array(13).fill('').map((_, i) => {
        if (i === 0) return `<td class="equip-row-name-cell">🏹 ${label}${effect}</td>`
        return `<td class="equip-row-stats-cell">${cells[i] ?? ''}</td>`
      }).join('')}</tr>`)
    }

    if (eq.armour) {
      const stats = getArmourStats(eq.armour)
      const def = parseInt(stats?.Defence) || 0
      rows.push(equipRow('🔰', eq.armour, def ? { 5: Math.max(5, baseDef - def) } : {}))
    }

    return rows.join('')
  }

  function skillLink(name) {
    const anchor = name.toLowerCase().replace(/\s+/g, '-')
    return `<a class="skill-link" href="/Reference/Skill%20List#${anchor}" target="_blank" rel="noopener">${esc(name)}</a>`
  }

  function allSkillsForUnit(unit, unitDef) {
    return [...(unitDef?.Skills || []), ...(unit.extraSkills || [])]
  }

  function skillsHtml(unit, unitDef) {
    const skills = allSkillsForUnit(unit, unitDef)
    if (!skills.length) return ''
    return `<div class="view-unit-skills">${skills.map(skillLink).join(', ')}</div>`
  }

  function getStat(unit, unitDef, stat) {
    return unit.statOverrides?.[stat] ?? unitDef?.[stat]
  }

  function unitRow(unit) {
    const unitDef = findUnitDef(wbData, unit.typeName, unit.category)
    const cost = calcUnitCost(unit, wbData)
    const eq = unit.equipment
    const s = (stat) => getStat(unit, unitDef, stat)
    return `
      <tr>
        <td class="view-unit-cell">
          <div class="view-unit-name">
            ${unit.customName ? `<span class="view-unit-custom-name">${esc(unit.customName)}</span> <span class="view-unit-type">(${esc(unit.typeName)})</span>` : esc(unit.typeName)}
            ${unit.promoted ? ' <span class="view-promoted-badge">promoted</span>' : ''}
          </div>
          ${unit.blight || unit.deathtouched || unit.notes ? `<div class="view-unit-notes">
            ${unit.blight ? '<span class="view-flag view-flag--blight">Blight</span>' : ''}
            ${unit.deathtouched ? '<span class="view-flag view-flag--death">Deathtouched</span>' : ''}
            ${unit.notes ? esc(unit.notes) : ''}
          </div>` : ''}
        </td>
        ${unitDef ? (() => {
          const mov = parseInt(s('Move')) || 0
          return `
            <td>${statVal(s('Move'))}"</td>
            <td>${mov + 3}"</td>
            <td>${statVal(clampStat('Melee',   s('Melee')))}</td>
            <td>${statVal(clampStat('Ranged',  s('Ranged')))}</td>
            <td>${statVal(clampStat('Defence', s('Defence')))}</td>
            <td>${statVal(clampStat('Agility', s('Agility')))}</td>
            <td>${statVal(clampStat('Morale',  s('Morale')))}</td>
            <td>${statVal(s('Attacks'))}</td>
            <td>${statVal(s('Wounds'))}</td>
            <td>${statVal(s('Injury'))}</td>
            <td>${statVal(s('Piercing'))}</td>
          `
        })() : `<td colspan="11">—</td>`}
        <td class="view-cost-cell">${cost}g</td>
      </tr>
      ${equipRows(eq, unitDef, unit)}
      ${skillsHtml(unit, unitDef) ? `<tr class="equip-row-view skills-row-view"><td class="equip-row-name-cell" colspan="13">${skillsHtml(unit, unitDef)}</td></tr>` : ''}
    `
  }

  const thead = `
    <thead><tr>
      <th>Unit</th><th>Mov</th><th>Run</th><th>Mel</th><th>Rgd</th>
      <th>Def</th><th>Agi</th><th>Mrl</th><th>Atk</th><th>Wnd</th><th>Inj</th><th>Prc</th><th>Cost</th>
    </tr></thead>
  `

  function statChip(label, value) {
    return `<div class="unit-card-stat"><span class="unit-card-stat-label">${label}</span><span class="unit-card-stat-value">${value}</span></div>`
  }

  function viewUnitCard(unit) {
    const unitDef = findUnitDef(wbData, unit.typeName, unit.category)
    const cost = calcUnitCost(unit, wbData)
    const eq = unit.equipment
    const s = (stat) => getStat(unit, unitDef, stat)

    const statsHtml = unitDef ? (() => {
      const mov = parseInt(s('Move')) || 0
      return [
        statChip('Mov', `${statVal(s('Move'))}"`),
        statChip('Run', `${mov + 3}"`),
        statChip('Mel', statVal(s('Melee'))),
        statChip('Rgd', statVal(s('Ranged'))),
        statChip('Def', statVal(s('Defence'))),
        statChip('Agi', statVal(s('Agility'))),
        statChip('Mrl', statVal(s('Morale'))),
        statChip('Atk', statVal(s('Attacks'))),
        statChip('Wnd', statVal(s('Wounds'))),
        statChip('Inj', statVal(s('Injury'))),
        statChip('Prc', statVal(s('Piercing'))),
      ].join('')
    })() : '<span class="text-muted">—</span>'

    const equipLines = []
    for (const name of (eq.melee || [])) {
      const stats = getMeleeStats(name)
      if (!stats) continue
      const resolvedKey = resolveAlias(name, 'Melee Weapons')
      const isShieldItem = resolvedKey === 'Shield' || resolvedKey === 'Tower Shield'
      const parts = []
      if (isShieldItem) {
        const m = (stats.Effect || '').match(/\+(\d+)\s*Def/)
        if (m) parts.push(`Def +${m[1]}`)
      } else {
        const mel = parseInt(stats.Melee) || 0
        const inj = parseInt(stats.Injury) || 0
        const prc = parseInt(stats.Piercing) || 0
        if (mel !== 0) parts.push(`Mel ${mel > 0 ? '+' : ''}${mel}`)
        if (inj !== 0) parts.push(`Inj ${inj > 0 ? '+' : ''}${inj}`)
        if (prc !== 0) parts.push(`Prc ${prc > 0 ? '+' : ''}${prc}`)
        if (stats.Effect) parts.push(esc(stats.Effect))
      }
      equipLines.push(`<div class="unit-card-equip-line">⚔ ${esc(name)}${parts.length ? `<span class="unit-card-equip-stats"> · ${parts.join(' · ')}</span>` : ''}</div>`)
    }
    for (const name of (eq.ranged || [])) {
      const stats = getRangedStats(name)
      if (!stats) continue
      const parts = []
      if (stats.Range) parts.push(`Rng ${esc(stats.Range)}`)
      const inj = parseInt(stats.Injury) || 0
      const prc = parseInt(stats.Piercing) || 0
      if (inj !== 0) parts.push(`Inj ${inj > 0 ? '+' : ''}${inj}`)
      if (prc !== 0) parts.push(`Prc ${prc > 0 ? '+' : ''}${prc}`)
      if (stats.Effect) parts.push(esc(stats.Effect))
      equipLines.push(`<div class="unit-card-equip-line">🏹 ${esc(name)}${parts.length ? `<span class="unit-card-equip-stats"> · ${parts.join(' · ')}</span>` : ''}</div>`)
    }
    if (eq.armour) {
      const stats = getArmourStats(eq.armour)
      const def = parseInt(stats?.Defence) || 0
      equipLines.push(`<div class="unit-card-equip-line">🔰 ${esc(eq.armour)}${def ? `<span class="unit-card-equip-stats"> · Def +${def}</span>` : ''}</div>`)
    }

    return `
      <div class="unit-card">
        <div class="unit-card-header">
          <span class="unit-card-name">
            ${unit.customName ? `${esc(unit.customName)} <span class="view-unit-type">(${esc(unit.typeName)})</span>` : esc(unit.typeName)}
            ${unit.promoted ? ' <span class="view-promoted-badge">promoted</span>' : ''}
          </span>
          <span class="unit-card-cost">${cost}g</span>
        </div>
        ${unit.blight || unit.deathtouched || unit.notes ? `<div class="unit-card-notes">
          ${unit.blight ? '<span class="view-flag view-flag--blight">Blight</span>' : ''}
          ${unit.deathtouched ? '<span class="view-flag view-flag--death">Deathtouched</span>' : ''}
          ${unit.notes ? esc(unit.notes) : ''}
        </div>` : ''}
        <div class="unit-card-stats">${statsHtml}</div>
        ${skillsHtml(unit, unitDef) ? `<div class="unit-card-skills">${allSkillsForUnit(unit, unitDef).map(s => `<span class="unit-card-skill">${skillLink(s)}</span>`).join('')}</div>` : ''}
        ${equipLines.length ? `<div class="unit-card-equip">${equipLines.join('')}</div>` : ''}
      </div>
    `
  }

  function viewUnitSection(label, units) {
    if (!units.length) return ''
    return `
      <section class="view-unit-section">
        <h2>${label}</h2>
        <div class="table-wrap view-desktop">
          <table class="unit-table">${thead}<tbody>${units.map(unitRow).join('')}</tbody></table>
        </div>
        <div class="view-mobile unit-card-list">
          ${units.map(viewUnitCard).join('')}
        </div>
      </section>
    `
  }

  return `
    <div class="view-warband">
      <header class="view-header">
        <button class="btn btn-ghost" data-action="nav-builder">← Edit</button>
        <div class="view-header-center">
          <h1 class="view-title">${esc(wb.name)}</h1>
          <div class="view-type">${esc(wb.type)}</div>
        </div>
        <button class="btn btn-primary" data-action="export-pdf">📄 Export PDF</button>
        <button class="btn btn-outline" data-action="export-cards">🃏 Export Cards</button>
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

      ${viewUnitSection('Heroes', heroes)}
      ${viewUnitSection('Henchmen', henchmen)}

      <div class="view-page-break"></div>

      ${wb.units.length === 0 ? `
        <div class="view-empty">
          <p>No units in this warband.</p>
          <button class="btn btn-primary" data-action="nav-builder">Add Units</button>
        </div>
      ` : ''}

      ${(() => {
        const allEffects = new Set()
        wb.units.forEach(unit => {
          for (const name of (unit.equipment?.ranged || [])) {
            const stats = getRangedStats(name)
            if (stats?.Effect) stats.Effect.split(',').map(e => e.trim()).filter(Boolean).forEach(e => allEffects.add(e))
          }
        })
        const entries = [...allEffects]
          .map(name => ({ name, desc: rangedEffectsData[name] }))
          .filter(e => e.desc)
          .sort((a, b) => a.name.localeCompare(b.name))
        if (!entries.length) return ''
        return `
          <section class="view-special-rules">
            <h2>Ranged Properties</h2>
            ${entries.map(e => `
              <div class="view-special-rule"><strong>${esc(e.name)}:</strong> ${esc(e.desc)}</div>
            `).join('')}
          </section>
        `
      })()}

      ${wbData?.['Special Rules'] && Object.keys(wbData['Special Rules']).length > 0 ? `
        <section class="view-special-rules">
          <h2>Special Rules</h2>
          ${Object.entries(wbData['Special Rules']).map(([name, desc]) => `
            <div class="view-special-rule"><strong>${esc(name)}:</strong> ${esc(desc)}</div>
          `).join('')}
        </section>
      ` : ''}

      ${(() => {
        const allSkills = new Set()
        wb.units.forEach(unit => {
          const unitDef = findUnitDef(wbData, unit.typeName, unit.category)
          allSkillsForUnit(unit, unitDef).forEach(s => allSkills.add(s))
        })
        const entries = [...allSkills]
          .map(name => ({ name, desc: skillsData[name]?.Description }))
          .filter(e => e.desc)
          .sort((a, b) => a.name.localeCompare(b.name))
        if (!entries.length) return ''
        return `
          <section class="view-skills-glossary">
            <h2>Skills Reference</h2>
            ${entries.map(e => `
              <div class="view-special-rule"><strong>${esc(e.name)}:</strong> ${esc(e.desc)}</div>
            `).join('')}
          </section>
        `
      })()}

      ${(() => {
        const magicTables = wbData?.['Magic Tables'] || []
        if (!magicTables.length) return ''
        return magicTables.map(school => {
          const spells = Object.values(spellsData).filter(s => s.School === school)
          if (!spells.length) return ''
          return `
            <section class="view-special-rules">
              <h2>${esc(school)}</h2>
              <table class="unit-table spell-table">
                <thead><tr><th>Name</th><th>Difficulty</th><th>Description</th></tr></thead>
                <tbody>
                  ${spells.map(s => `
                    <tr>
                      <td class="spell-name-cell">${esc(s.Name)}</td>
                      <td class="spell-check-cell">${esc(s.Check)}</td>
                      <td class="spell-desc-cell">${esc(s.Description)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </section>
          `
        }).join('')
      })()}
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

    case 'export-warband':
      exportWarband(el.dataset.id)
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
      if (cost === null || (!wb.campaignMode && goldRemaining(wb) < cost)) break
      mutateWarband(wb => { wb.heroSlotsPurchased = (wb.heroSlotsPurchased || 0) + 1 })
      break
    }

    case 'enable-campaign':
      if (confirm('Switch to Campaign Mode?\n\nThis removes the gold budget limit and allows editing stats, adding skills, and promoting henchmen. This cannot be undone.')) {
        enableCampaignMode()
      }
      break

    case 'promote-hero':
      if (confirm('Promote this unit to Hero?\n\nThey will count as a hero and gain hero equipment slots.')) {
        promoteToHero(el.dataset.unitId)
      }
      break

    case 'remove-extra-skill':
      removeExtraSkill(el.dataset.unitId, el.dataset.skill)
      break

    case 'toggle-flag':
      toggleUnitFlag(el.dataset.unitId, el.dataset.flag)
      break

    case 'neutral-hero-progress':
      updateNeutralHeroProgress(parseInt(el.dataset.idx), parseInt(el.dataset.delta))
      break

    case 'add-unit':
      addUnit(el.dataset.unitName, el.dataset.unitCat)
      break

    case 'remove-unit':
      removeUnit(el.dataset.unitId)
      break

    case 'duplicate-unit':
      duplicateUnit(el.dataset.unitId)
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

    case 'export-pdf':
      exportToPDF()
      break

    case 'export-cards':
      exportToCards()
      break
  }
})

document.addEventListener('change', e => {
  const el = e.target
  const action = el.dataset?.action
  if (!action) return

  if (action === 'stat-override') {
    updateUnitStat(el.dataset.unitId, el.dataset.stat, el.value.trim())
  } else if (action === 'unit-notes') {
    updateUnitNotes(el.dataset.unitId, el.value)
  } else if (action === 'add-extra-skill') {
    if (el.value) addExtraSkill(el.dataset.unitId, el.value)
  } else if (action === 'unit-custom-name') {
    updateUnitCustomName(el.dataset.unitId, el.value)
  } else if (action === 'campaign-field') {
    updateCampaignField(el.dataset.field, el.value)
  } else if (action === 'neutral-hero-select') {
    updateNeutralHeroName(parseInt(el.dataset.idx), el.value)
  } else if (action === 'import-warband') {
    const file = el.files?.[0]
    if (file) importWarband(file)
    el.value = ''  // reset so same file can be re-imported
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
