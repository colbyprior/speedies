// Renders artifact cards from the builder's card export style.
//
// Usage: node builder/scripts/render-artifact-cards.mjs [out.pdf]

import fs from 'node:fs'
import path from 'node:path'
import JSON5 from 'json5'
import { generateArtifactCardsPDF } from '../src/pdf-export.js'

const DATA = 'static/jsondata'
const out  = process.argv[2] || 'static/img/artifacts.pdf'

const read = name => JSON5.parse(fs.readFileSync(path.join(DATA, name), 'utf8'))

const artifacts = read('artifacts.json')
const skills    = read('skills.json')

function buildArtifact(name, artifact) {
  const special = []

  // Add description as main effect
  if (artifact.Description) {
    special.push(`Effect: ${artifact.Description}`)
  }

  // Add special rules if present
  if (artifact.Special) {
    special.push(`Special: ${artifact.Special}`)
  }

  // Add skills with their full descriptions
  if (artifact.Skills) {
    for (const skillName of artifact.Skills.split(',').map(s => s.trim()).filter(Boolean)) {
      const desc = skills[skillName]?.Description
      special.push(desc ? `${skillName}: ${desc}` : skillName)
    }
  }

  // Add equipment info
  let equipment = ''
  if (artifact['Melee Weapon']) {
    equipment = artifact['Melee Weapon']
  }

  return {
    name,
    meta_label: artifact.Cursed ? 'Cursed' : null,
    meta_value: artifact.Cursed ? 'Cannot unequip' : null,
    equipment: equipment,
    special,
  }
}

const cards = Object.entries(artifacts)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, artifact]) => buildArtifact(name, artifact))

const doc = generateArtifactCardsPDF(cards)

fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, Buffer.from(doc.output('arraybuffer')))
console.log(`Written: ${out} (${cards.length} artifacts)`)
