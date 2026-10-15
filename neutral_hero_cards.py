"""
Regenerates the printable Neutral Hero deck from the warband builder's card
export, so the deck matches the cards a player prints out of the builder.

Renders builder/src/pdf-export.js against static/jsondata/neutral_heroes.json.

Run standalone, or via generate.py which calls generate_pdf().

Usage:
    python neutral_hero_cards.py
"""

import subprocess
from pathlib import Path

BUILDER_DIR = Path('builder')
RENDER_SCRIPT = BUILDER_DIR / 'scripts' / 'render-neutral-hero-cards.mjs'
OUTPUT_PDF = Path('static/img/neutral_heroes.pdf')


def generate_pdf(output_pdf=OUTPUT_PDF):
    if not (BUILDER_DIR / 'node_modules' / 'jspdf').exists():
        raise SystemExit(
            f"Builder dependencies missing — run 'npm install' in {BUILDER_DIR}/"
        )
    subprocess.run(['node', str(RENDER_SCRIPT), str(output_pdf)], check=True)


def main():
    generate_pdf()


if __name__ == '__main__':
    main()
