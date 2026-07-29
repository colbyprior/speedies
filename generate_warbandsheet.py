"""
Regenerates warbandsheet.pdf using the current warbandsheet.png as the background,
preserving all original form fields from the committed PDF in git.

Usage:
    python generate_warbandsheet.py
"""

import subprocess
import pypdf
from pypdf.generic import DecodedStreamObject, NameObject, NumberObject
from PIL import Image, ImageOps
import io

ORIGINAL_PDF = 'static/img/warbandsheet.pdf'
NEW_PNG = 'static/img/warbandsheet.png'
OUTPUT_PDF = 'static/img/warbandsheet.pdf'

# Old image dimensions and measured border (from original embedded image)
OLD_W, OLD_H = 1754, 1240
OLD_CONTENT_W = 1706  # content width inside old image (border excluded)
OLD_CONTENT_H = 1148  # content height inside old image (border excluded)
OLD_BORDER = dict(left=24, right=23, top=44, bottom=47)

# Load original PDF from git to preserve field positions
original_pdf_bytes = subprocess.check_output(
    ['git', 'show', 'HEAD:static/img/warbandsheet.pdf']
)
reader = pypdf.PdfReader(io.BytesIO(original_pdf_bytes))
writer = pypdf.PdfWriter()
writer.clone_reader_document_root(reader)

page = writer.pages[0]

# Replace all content streams with just the image draw command
image_stream = DecodedStreamObject()
image_stream.set_data(b'q 841.9199829 0 0 595.3200684 0.3272705 -0.3272705 cm /Im0 Do Q')
page[NameObject('/Contents')] = writer._add_object(image_stream)

# Load new PNG and add a white border matching the old image's proportional margins
new_img = Image.open(NEW_PNG).convert('RGB')
pw, ph = new_img.size

border_l = int(OLD_BORDER['left']   / OLD_CONTENT_W * pw)
border_r = int(OLD_BORDER['right']  / OLD_CONTENT_W * pw)
border_t = int(OLD_BORDER['top']    / OLD_CONTENT_H * ph)
border_b = int(OLD_BORDER['bottom'] / OLD_CONTENT_H * ph)

print(f'New PNG: {pw} x {ph}')
print(f'Adding border: left={border_l}, right={border_r}, top={border_t}, bottom={border_b}')

new_img = ImageOps.expand(new_img, border=(border_l, border_t, border_r, border_b), fill='white')
new_img = new_img.resize((OLD_W, OLD_H), Image.LANCZOS)

buf = io.BytesIO()
new_img.save(buf, format='JPEG', quality=95)
jpeg_bytes = buf.getvalue()

# Replace the background image object
resources = page['/Resources'].get_object()
xobjects = resources['/XObject'].get_object()
img_obj = xobjects['/Im0'].get_object()
img_obj._data = jpeg_bytes
img_obj[NameObject('/Filter')] = NameObject('/DCTDecode')
img_obj[NameObject('/Width')] = NumberObject(OLD_W)
img_obj[NameObject('/Height')] = NumberObject(OLD_H)
img_obj[NameObject('/ColorSpace')] = NameObject('/DeviceRGB')
img_obj[NameObject('/BitsPerComponent')] = NumberObject(8)

writer.write(OUTPUT_PDF)
print(f'Written: {OUTPUT_PDF}')
