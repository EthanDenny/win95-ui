"""Recover only the three pinned font files from PCjs's Windows 95 RTM image.

Usage: python3 scripts/recover-fonts.py /path/to/WIN95.json
The image URL, original paths, dates and hashes are in public/fonts/sources.json.
No emulation, mount, OS installation, or execution of the image is performed.
"""
import argparse
import hashlib
import json
from pathlib import Path
import struct

parser = argparse.ArgumentParser()
parser.add_argument('image', type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
sources = json.loads((root / 'public/fonts/sources.json').read_text())
image = json.loads(args.image.read_text())
entries = {}
for filename, source in sources.items():
    index, entry = next((i, f) for i, f in enumerate(image['fileTable']) if f['path'] == source['path'])
    assert entry['hash'] == source['md5'] and entry['date'] == source['date']
    entries[index] = (filename, bytearray(entry['size']))
for cylinder in image['diskData']:
    for head in cylinder:
        for sector in head:
            if sector.get('f') not in entries:
                continue
            _, output = entries[sector['f']]
            words = sector['d']
            words = words + [words[-1]] * (sector['l'] // 4 - len(words))
            raw = struct.pack('<' + 'I' * len(words), *(v & 0xffffffff for v in words))
            offset = sector['o']
            count = min(len(raw), len(output) - offset)
            if count > 0:
                output[offset:offset + count] = raw[:count]
# Verify all data before overwriting any project asset.
for filename, data in entries.values():
    assert hashlib.sha256(data).hexdigest() == sources[filename]['sha256'], filename
for filename, data in entries.values():
    (root / 'public/fonts' / filename).write_bytes(data)
    print(f'{filename}: original RTM file verified and recovered')
