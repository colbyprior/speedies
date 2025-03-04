import fileinput
import re

# fn = "test.md" # your filename

from pathlib import Path

for path in Path('docs').rglob('*.md'):
  print(str(path))
  r = re.compile(r'^.*]\(#')
  for line in fileinput.input(str(path), inplace=True):
    # match = r.match(line)
    match = re.search(r']\(#', line, re.IGNORECASE);
    newline = line.replace('\n', '')
    if match:
      newline = re.sub(r']\(#.*\)', lambda m: m.group(0).lower(), newline)
      newline = newline.replace("%20", "-")
    print(newline)
