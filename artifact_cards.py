"""
Generates the printable Artifact deck.

Renders builder/scripts/render-artifact-cards.mjs against static/jsondata/artifacts.json.

Run standalone, or via generate.py which calls generate_pdf().

Usage:
    python artifact_cards.py
"""

import subprocess
from pathlib import Path

BUILDER_DIR = Path('builder')
RENDER_SCRIPT = BUILDER_DIR / 'scripts' / 'render-artifact-cards.mjs'
OUTPUT_PDF = Path('static/img/artifacts.pdf')


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
