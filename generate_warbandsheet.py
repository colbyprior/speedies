"""
Regenerates the printable warband sheet from the warband builder's PDF export,
so the handout always matches what the builder produces.

Renders builder/src/pdf-export.js with no warband data, which prints the sheet
with every cell blank.

Run standalone, or via generate.py which calls main().

Usage:
    python generate_warbandsheet.py
"""

import subprocess
from pathlib import Path

BUILDER_DIR = Path('builder')
RENDER_SCRIPT = BUILDER_DIR / 'scripts' / 'render-blank-sheet.mjs'
OUTPUT_PDF = Path('static/img/warbandsheet.pdf')


def main():
    if not (BUILDER_DIR / 'node_modules' / 'jspdf').exists():
        raise SystemExit(
            f"Builder dependencies missing — run 'npm install' in {BUILDER_DIR}/"
        )
    subprocess.run(['node', str(RENDER_SCRIPT), str(OUTPUT_PDF)], check=True)


if __name__ == '__main__':
    main()
