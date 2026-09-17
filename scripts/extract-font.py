"""Extract complete native font strikes; no resizing or screenshot-derived glyphs.

Requires monobit==0.54.0. Source checksums are pinned in public/fonts/sources.json.
Run with --check to validate generated data without modifying it.
"""
import argparse
import hashlib
import json
from pathlib import Path
import monobit

root = Path(__file__).resolve().parent.parent
sources = json.loads((root / 'public/fonts/sources.json').read_text())
output = {}
for filename, source in sources.items():
    path = root / 'public/fonts' / filename
    assert hashlib.sha256(path.read_bytes()).hexdigest() == source['sha256'], filename
    for font in monobit.load(path):
        glyphs = {}
        missing = font.get_default_glyph()
        for char in font.get_chars():
            if not char.value or ord(char.value) < 32 or ord(char.value) == 127:
                continue
            glyph = font.get_glyph(char)
            # These FONs map unsupported Windows-1252 characters to the default
            # solid bar. Advertising them in WOFF prevents browser fallback.
            if glyph.pixels == missing.pixels:
                continue
            rows = [''.join(str(bit) for bit in row) for row in glyph.pixels.as_matrix()]
            glyphs[char.value] = {'advance': int(glyph.advance_width), 'rows': rows}
            assert glyph.left_bearing == 0
            assert len(rows) == font.line_height
        point_size = int(font.point_size)
        output[f"{source['family']}:{point_size}"] = {
            'family': font.family, 'size': point_size, 'weight': font.weight,
            'height': int(font.line_height), 'ascent': int(font.ascent),
            'descent': int(font.descent), 'baseline': int(font.line_height - font.descent),
            'internalLeading': int(font.line_height - font.ascent - font.descent), 'dpi': [font.dpi.x, font.dpi.y],
            'source': filename, 'copyright': font.copyright,
            'glyphs': glyphs,
        }
serialized = json.dumps(output, ensure_ascii=True, separators=(',', ':')) + '\n'
path = root / 'src/fonts/bitmap-fonts.json'
parser = argparse.ArgumentParser()
parser.add_argument('--check', action='store_true')
if parser.parse_args().check:
    assert path.read_text() == serialized, 'Generated font data differs from the original FON files.'
    print('Verified all source hashes, native glyph pixels, advances, and vertical metrics.')
else:
    path.write_text(serialized)
    print(f'Extracted {len(output)} native font strikes from {len(sources)} original FON files.')
