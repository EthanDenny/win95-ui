"""Validate the shipped web font against every source bitmap glyph."""
from pathlib import Path
import hashlib
import json
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
sources = json.loads((root / 'src/fonts/bitmap-fonts.json').read_text())
css = (root / 'src/components/fonts.css').read_text()
for key, source in sources.items():
  family, size = key.split(':')
  for bold in ([False, True] if family == 'ms-sans-serif' else [False]):
    filename = f'{family}-{size}' + ('-bold' if bold else '')
    font_path = root / f'public/fonts/{filename}.woff'
    version = hashlib.sha256(font_path.read_bytes()).hexdigest()[:12]
    assert f"url('/fonts/{filename}.woff?v={version}')" in css, f'Stale font URL: {filename}'
    font = TTFont(font_path)
    unit = font['head'].unitsPerEm / source['height']
    assert unit == 64
    assert font['hhea'].ascent == source['baseline'] * unit
    assert font['hhea'].descent == -(source['height'] - source['baseline']) * unit
    cmap = font.getBestCmap()
    # Regression: the FON default bars must not claim Unicode coverage.
    # Real apostrophes and ASCII punctuation must remain available.
    assert not set(map(ord, '€‚ƒ„…†‡ˆ‰Š‹ŒŽ“”•–—˜™š›œžŸ')) & set(cmap), filename
    assert set(map(ord, "‘’\"'-|?")) <= set(cmap), filename
    assert set(cmap) == {ord(char) for char in source['glyphs']}
    for char, original in source['glyphs'].items():
        name = cmap[ord(char)]
        glyph = font['glyf'][name]
        advance, bearing = font['hmtx'][name]
        assert advance == (original['advance'] + int(bold)) * unit, repr(char)
        assert bearing == getattr(glyph, 'xMin', 0), repr(char)
        coordinates, ends, flags = glyph.getCoordinates(font['glyf'])
        pixels = set()
        start = 0
        for end in ends:
            points = coordinates[start:end + 1]
            assert len(points) == 4 and all(flags[start:end + 1]), repr(char)
            xs, ys = [p[0] for p in points], [p[1] for p in points]
            assert all(v % unit == 0 for v in xs + ys), repr(char)
            for x in range(int(min(xs) / unit), int(max(xs) / unit)):
                for y in range(int(min(ys) / unit), int(max(ys) / unit)):
                    pixels.add((x, source['baseline'] - y - 1))
            start = end + 1
        expected = {(x, y) for y, row in enumerate(original['rows']) for x, value in enumerate(row) if value == '1'}
        if bold:
            expected |= {(x + 1, y) for x, y in expected.copy()}
        assert pixels == expected, repr(char)
    print(f'{filename}: {len(cmap)} glyphs: exact bitmap coverage, advances, bearings, and baseline preserved in WOFF.')
