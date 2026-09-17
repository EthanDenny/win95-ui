import { drawBitmapText } from './reference/referenceText.ts'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fontChoices, fontRoles, getBitmapFont, measureBitmapText } from '../src/bitmapFont.ts'
import type { FontSpec } from '../src/bitmapFont.ts'
const output = 'public/reference/fonts'
mkdirSync(output, { recursive: true })
const fixtures: { id: string; source: string; text: string; font: FontSpec; x: number; y: number; color: string; background: string }[] = [
  { id: 'ui-regular', source: 'control-panel', text: 'Date/Time', font: fontRoles.ui, x: 243, y: 82, color: '#000000', background: '#ffffff' },
  { id: 'ui-bold', source: 'control-panel', text: 'Control Panel', font: fontRoles.uiBold, x: 24, y: 6, color: '#ffffff', background: '#000080' },
  { id: 'system-native-bold', source: 'calculator', text: 'Back', font: fontRoles.systemControl, x: 115, y: 99, color: '#800000', background: '#c0c0c0' },
  { id: 'fixedsys-document', source: 'notepad', text: 'This document provides', font: fontRoles.document, x: 7, y: 165, color: '#000000', background: '#ffffff' },
  { id: 'fixedsys-heading', source: 'notepad', text: 'How to Use This Document', font: fontRoles.document, x: 7, y: 240, color: '#000000', background: '#ffffff' },
]
const results = []
for (const fixture of fixtures) {
  const font = getBitmapFont(fixture.font), width = measureBitmapText(fixture.text, fixture.font), height = font.height
  const reference = createCanvas(width, height), actual = createCanvas(width, height), diff = createCanvas(width, height)
  reference.getContext('2d').drawImage(await loadImage(`public/reference/apps/${fixture.source}.png`), -fixture.x, -fixture.y)
  const ctx = actual.getContext('2d'); ctx.fillStyle = fixture.background; ctx.fillRect(0, 0, width, height)
  drawBitmapText(ctx as unknown as CanvasRenderingContext2D, fixture.text, 0, 0, fixture.font, fixture.color)
  const a = ctx.getImageData(0, 0, width, height).data, b = reference.getContext('2d').getImageData(0, 0, width, height).data
  const difference = diff.getContext('2d').createImageData(width, height)
  let different = 0
  for (let i = 0; i < a.length; i += 4) {
    const mismatch = a.slice(i, i + 4).some((value, j) => value !== b[i + j])
    different += Number(mismatch)
    difference.data.set(mismatch ? [255, 0, 128, 255] : [235, 235, 235, 255], i)
  }
  diff.getContext('2d').putImageData(difference, 0, 0)
  for (const [name, canvas] of [['source', reference], ['actual', actual], ['diff', diff]] as const) writeFileSync(`${output}/${fixture.id}-${name}.png`, canvas.toBuffer('image/png'))
  results.push({ ...fixture, width, height, different, pixels: width * height })
}
// The repertoire sheet demonstrates each supported family/size/weight using
// the actual renderer. It is not presented as an independent reference image.
const specimens = fontChoices.map((choice, index) => {
  const font = getBitmapFont(choice.font), chars = Object.keys(font.glyphs).join('')
  const lines = Array.from({ length: Math.ceil(chars.length / 32) }, (_, row) => chars.slice(row * 32, row * 32 + 32))
  const width = Math.max(...lines.map(line => measureBitmapText(line, choice.font))) + 16
  const height = lines.length * (font.height + 4) + 16
  const canvas = createCanvas(width, height), ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, width, height)
  lines.forEach((line, row) => drawBitmapText(ctx as unknown as CanvasRenderingContext2D, line, 8, 8 + row * (font.height + 4), choice.font))
  writeFileSync(`${output}/repertoire-${index}.png`, canvas.toBuffer('image/png'))
  return { ...choice, width, height, glyphs: Object.keys(font.glyphs).length, source: font.source, cellHeight: font.height }
})
writeFileSync(`${output}/results.json`, JSON.stringify({ fixtures: results, specimens }, null, 2) + '\n')
writeFileSync(`${output}/index.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><title>Windows 95 fonts</title><style>body{font:14px system-ui;background:white;color:black;margin:32px}p{max-width:850px;line-height:1.5}section{display:flex;gap:24px;flex-wrap:wrap;margin-bottom:30px}figure{margin:0}img{image-rendering:pixelated}figcaption{margin:8px 0}article{margin:32px 0}details img{max-width:100%}</style><h1>Windows 95 font verification</h1><p><a href="/test/design#typography">Typography components</a> · <a href="/fonts/README.md">Source files and verification notes</a></p><p>Original FON glyphs and advances, with explicit family selection: MS Sans Serif, System, and Fixedsys. System's bold weight is native. MS Sans Serif bold uses <a href="https://www.bitsavers.org/pdf/microsoft/windows_3.1/Windows_3.1_Guide_to_Programming_1992.pdf">Microsoft's documented GDI one-pixel overstrike</a> (printed page 423). No browser font rasterization or screenshot-derived glyphs.</p><p>These font-only crops use fixed reference coordinates and exact RGBA comparisons. No tolerance, masking, fitting, or automatic alignment. Samples are displayed at 2×; the comparison is performed at 1×. Sources are the original <a href="https://guidebookgallery.org/screenshots/win95/">Windows 95 screenshots</a>. All glyphs and metrics are additionally checked against the pinned FON files by the extraction script. These samples verify the displayed strings, not every Windows rendering configuration.</p>${results.map(r => `<article><h2>${getBitmapFont(r.font).family} — ${r.different} differing pixels</h2><p>${r.text} · ${r.width} × ${r.height} native pixels</p><section>${['source', 'actual', 'diff'].map(kind => `<figure><img alt="${kind} font sample" src="${r.id}-${kind}.png" width="${r.width * 2}" height="${r.height * 2}"><figcaption>${kind}</figcaption></figure>`).join('')}</section></article>`).join('')}<h2>Complete supported repertoire</h2><p>Native strikes are selected directly, without resizing. These sheets show rendered output for inspection.</p>${specimens.map((s, i) => `<details><summary>${s.label} · ${s.cellHeight} px cell · ${s.glyphs} glyphs · ${s.source}</summary><img alt="${s.label} repertoire" src="repertoire-${i}.png" width="${s.width}" height="${s.height}"></details>`).join('')}</html>`)
console.log(results.map(r => `${r.id}: ${r.different}/${r.pixels} differing pixels`).join('\n'))
if (results.some(r => r.different)) process.exitCode = 1
