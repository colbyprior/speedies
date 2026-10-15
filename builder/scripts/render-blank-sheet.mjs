// Renders the blank printable warband sheet straight from the builder's PDF
// export, so the handout and the builder's export can never drift apart.
//
// Usage: node builder/scripts/render-blank-sheet.mjs [out.pdf]

import fs from 'node:fs'
import path from 'node:path'
import { generateWarbandPDF } from '../src/pdf-export.js'

const out = process.argv[2] || 'static/img/warbandsheet.pdf'

const doc = generateWarbandPDF({})  // no data — every cell printed empty

fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, Buffer.from(doc.output('arraybuffer')))
console.log(`Written: ${out}`)
