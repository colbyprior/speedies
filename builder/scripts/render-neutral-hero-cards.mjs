// Renders the neutral hero deck from the builder's card export, so the deck and
// the warband cards a player prints from the builder stay in the same style.
//
// Usage: node builder/scripts/render-neutral-hero-cards.mjs [out.pdf]

import fs from 'node:fs'
import path from 'node:path'
import JSON5 from 'json5'
import { generateNeutralHeroCardsPDF } from '../src/pdf-export.js'

const DATA = 'static/jsondata'
const out  = process.argv[2] || 'static/img/neutral_heroes.pdf'

const read = name => JSON5.parse(fs.readFileSync(path.join(DATA, name), 'utf8'))

const heroes        = read('neutral_heroes.json')
const skills        = read('skills.json')
const rangedWeapons = read('ranged-weapons.json')
const rangedEffects = read('ranged-weapon-effects.json')
const aliases       = read('aliases.json')

const STAT_FIELDS = [
  ['mov', 'Move'], ['mel', 'Melee'], ['rgd', 'Ranged'], ['def', 'Defence'],
  ['agi', 'Agility'], ['mrl', 'Morale'], ['atk', 'Attacks'], ['wnd', 'Wounds'],
  ['inj', 'Injury'], ['prc', 'Piercing'],
]

// Aliased weapons ("Crossbow" on a card may point at a shared profile) resolve
// the same way the docs generator resolves them, but keep the card's own name.
function rangedProfile(name) {
  const direct = rangedWeapons[name]
  if (direct) return direct
  const alias = aliases['Ranged Weapons']?.[name]
  const profile = alias && rangedWeapons[alias]
  if (!profile) throw new Error(`Unknown ranged weapon: ${name}`)
  return profile
}

// Stats, equipment and skills — everything a stat card needs, shared by the
// heroes and by the minions they summon.
function buildProfile(name, hero) {
  const base_stats = {}
  for (const [key, field] of STAT_FIELDS) {
    const raw = String(hero[field] ?? '').trim()
    // '-' means the unit has no such stat; the card prints its own em dash
    if (raw && raw !== '-') base_stats[key] = raw
  }

  const special = []
  for (const skillName of String(hero.Skills || '').split(',').map(s => s.trim()).filter(Boolean)) {
    const desc = skills[skillName]?.Description
    special.push(desc ? `${skillName}: ${desc}` : skillName)
  }

  const weapon_rows = []
  if (hero['Ranged Weapon']) {
    const weaponName = hero['Ranged Weapon']
    const profile = rangedProfile(weaponName)
    weapon_rows.push({
      // Range sits in the row label — the stat grid has no column for it
      label: profile.Range ? `${weaponName} (${profile.Range})` : weaponName,
      stats: { inj: String(profile.Injury ?? ''), prc: String(profile.Piercing ?? '') },
    })
    for (const effect of String(profile.Effect || '').split(',').map(s => s.trim()).filter(Boolean)) {
      const desc = rangedEffects[effect]
      special.push(desc ? `${effect}: ${desc}` : effect)
    }
  }

  return {
    name,
    equipment:  hero['Melee Weapon'] || '',
    base_stats,
    weapon_rows,
    special,
  }
}

function buildNeutralHero(name, hero) {
  return {
    ...buildProfile(name, hero),
    badge: `${hero['Cost']}g`,
    // Opposed Type heroes name their natural enemy; Solo Type heroes have none
    ...(hero.Opposed ? { meta_label: 'Opposed by', meta_value: hero.Opposed } : {}),
    spells:     (hero.Spells || []).map(spell => ({
      roll:        spell.Roll,
      name:        spell.Name,
      description: spell.Description,
    })),
    cast_priority: hero['Cast Priority'] || [],
    event:      hero.Event     || [],
    logic:      hero.Logic     || [],
    patronage:  hero.Patronage || [],
    // Summoned units are not hired, so their card names their summoner instead
    minions: (hero.Minions || []).map(minion => ({
      ...buildProfile(minion.Name, minion),
      meta_label: 'Summoned by',
      meta_value: name,
    })),
  }
}

const cards = Object.entries(heroes)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, hero]) => buildNeutralHero(name, hero))

const doc = generateNeutralHeroCardsPDF(cards)

fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, Buffer.from(doc.output('arraybuffer')))
console.log(`Written: ${out} (${cards.length} heroes)`)
