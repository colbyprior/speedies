import fileinput
import re

from pathlib import Path

for path in Path('docs').rglob('*.md'):
  print(str(path))
  is_table = False
  for line in fileinput.input(str(path), inplace=True):
    newline = line.replace('\n', '')

    match_link = re.search(r']\(#', newline, re.IGNORECASE)
    if match_link:
      newline = re.sub(r']\(#.*\)', lambda m: m.group(0).lower(), newline)
      newline = newline.replace("%20", "-")

    match_table = re.search(r'^\|', newline, re.IGNORECASE)
    if match_table:
      is_table = True
    elif is_table and not match_table:
      if newline != '':
        newline = f"\n{newline}"
      is_table = False
    print(newline)
