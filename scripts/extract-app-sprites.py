"""Extract original artwork only; window chrome/text are painted independently."""
from pathlib import Path
from PIL import Image
root = Path(__file__).resolve().parents[1]
out = root / 'public/apps'
out.mkdir(exist_ok=True)
refs = root / 'public/reference/apps'
for name, rect in [('calculator',(5,5,21,21)), ('control-panel',(5,6,21,22)), ('browser',(5,6,21,22))]:
    Image.open(refs / f'{name}.png').crop(rect).save(out / f'{name}-small.png')
panel = Image.open(refs / 'control-panel.png')
for i in range(19):
    x, y = 27 + (i % 5)*75, 46 + (i // 5)*75
    panel.crop((x,y,x+32,y+32)).save(out / f'applet-{i}.png')
browser = Image.open(refs / 'browser.png')
for i, x in enumerate([33,83,133,183,233,283,333,383]):
    browser.crop((328 if i == 6 else x,47,x+20,67)).save(out / f'tool-{i}.png')
browser.crop((433,44,474,84)).save(out / 'ie-logo.png')

browser.crop((410,301,424,316)).save(out / 'browser-status.png')

# Make the small window icons usable on inactive captions and desktop backgrounds.
# Only remove the navy background connected to the edge, leaving icon colors intact.
for name in ['calculator', 'control-panel', 'browser']:
    path = out / f'{name}-small.png'
    im = Image.open(path).convert('RGBA')
    pending = [(x,y) for x in range(im.width) for y in range(im.height) if x in (0,im.width-1) or y in (0,im.height-1)]
    seen = set()
    while pending:
        x,y = pending.pop()
        if (x,y) in seen or not (0 <= x < im.width and 0 <= y < im.height): continue
        seen.add((x,y))
        if im.getpixel((x,y))[:3] != (0,0,128): continue
        im.putpixel((x,y),(0,0,0,0))
        pending.extend([(x-1,y),(x+1,y),(x,y-1),(x,y+1)])
    im.save(path)
for i in [0,1]:
    im = Image.open(out / f'tool-{i}.png').convert('RGB')
    im.putdata([(0,0,0) if p == (128,128,128) else (192,192,192) if p == (255,255,255) else p for p in im.get_flattened_data()])
    im.save(out / f'tool-{i}-enabled.png')
