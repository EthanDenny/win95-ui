import { createCanvas, Image, loadImage } from '@napi-rs/canvas'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
class LocalImage extends Image {
  loaded: Promise<void> = Promise.resolve()
  set src(value: string) { this.loaded = new Promise((resolve, reject) => { this.onload = () => resolve(); this.onerror = reject }); super.src = readFileSync(resolve('public', value.replace(/^\//, ''))) }
  get naturalWidth() { return this.width }
  get naturalHeight() { return this.height }
  get complete() { return true }
  async decode() { await this.loaded }
}
Object.assign(globalThis, { Image: LocalImage })
const { iconsReady } = await import('./reference/kitIcons.ts')
const { appAssetsReady } = await import('./reference/apps/assets.ts')
const { paintApp } = await import('./reference/apps/render.ts')
const { appIds, applications, initialApps } = await import('../src/apps/model.ts')
await Promise.all([iconsReady, appAssetsReady])
const output = resolve('public/reference/comparisons')
mkdirSync(output, { recursive: true })
const results = []
for (const id of appIds) {
  const { width, height } = applications[id]
  const canvas = createCanvas(width, height)
  paintApp(canvas.getContext('2d') as unknown as CanvasRenderingContext2D, { id, x: 0, y: 0, width, height, minimized: false, maximized: false }, initialApps())
  writeFileSync(`${output}/${id}-actual.png`, canvas.toBuffer('image/png'))
  const source = createCanvas(width, height)
  source.getContext('2d').drawImage(await loadImage(resolve(`public/reference/apps/${id}.png`)), 0, 0)
  const expected = source.getContext('2d').getImageData(0, 0, width, height).data
  const actual = canvas.getContext('2d').getImageData(0, 0, width, height).data
  const diff = createCanvas(width, height), ctx = diff.getContext('2d'), pixels = ctx.createImageData(width, height)
  let different = 0
  const regions = { chrome: { total: 0, different: 0 }, content: { total: 0, different: 0 } }
  for (let i = 0; i < expected.length; i += 4) {
    const changed = expected[i] !== actual[i] || expected[i + 1] !== actual[i + 1] || expected[i + 2] !== actual[i + 2] || expected[i + 3] !== actual[i + 3]
    different += Number(changed)
    const region = Math.floor(i / 4 / width) < 42 ? regions.chrome : regions.content
    region.total++; region.different += Number(changed)
    pixels.data.set(changed ? [255, 0, 128, 255] : [expected[i] * .22, expected[i + 1] * .22, expected[i + 2] * .22, 255], i)
  }
  ctx.putImageData(pixels, 0, 0)
  writeFileSync(`${output}/${id}-diff.png`, diff.toBuffer('image/png'))
  results.push({ id, width, height, pixels: width * height, different, exactMatchPercent: +(100 * (1 - different / (width * height))).toFixed(3), regions })
}
writeFileSync(`${output}/results.json`, JSON.stringify(results, null, 2) + '\n')
console.log(JSON.stringify(results, null, 2))
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Windows 95 pixel comparison</title><style>body{font:14px system-ui;margin:32px;color:#111;background:white}article{margin:36px 0}section{display:flex;gap:20px;flex-wrap:wrap}figure{margin:0}img{image-rendering:pixelated;max-width:100%}figcaption{margin:8px 0}p{max-width:850px;line-height:1.5}</style><h1>Windows 95 desktop — pixel comparison</h1><p>Source screenshots: <a href="https://guidebookgallery.org/screenshots/win95/">GUIdebook Windows 95</a> (Calculator and Control Panel) and <a href="https://guidebookgallery.org/screenshots/win95osr2/">Windows 95 OSR2</a> (Internet Explorer 3). These results cover the retained canvas reference renderer in @napi-rs/canvas. The entire desktop now uses DOM and CSS and is checked separately in the browser. These percentages do not measure the migrated interface. Exact RGBA comparison at each source's original dimensions. No tolerance, alignment adjustment, masking, or excluded pixels. Magenta marks every mismatch. Icons are extracted original artwork; chrome, text and layout are independently painted. These offline painters remain only as historical references.</p><p>These are the initial active windows at their native sizes. Interactive states and settings dialogs are not covered by these source screenshots. Large flat areas and reused artwork contribute to the score; the percentages alone do not establish perceptual fidelity.</p>${results.map(r => `<article><h2>${applications[r.id].title} — ${r.exactMatchPercent}% identical pixels</h2><p>${r.different.toLocaleString()} differing pixels / ${r.pixels.toLocaleString()}. ${r.width} × ${r.height}. Chrome: ${r.regions.chrome.different} differences. Content: ${r.regions.content.different} differences.</p><section><figure><img alt="Original screenshot" src="../apps/${r.id}.png" width="${r.width}" height="${r.height}"><figcaption>Source</figcaption></figure><figure><img alt="Recreated window" src="${r.id}-actual.png" width="${r.width}" height="${r.height}"><figcaption>Implementation</figcaption></figure><figure><img alt="Pixel differences" src="${r.id}-diff.png" width="${r.width}" height="${r.height}"><figcaption>Exact pixel difference</figcaption></figure></section></article>`).join('')}</html>`
writeFileSync(`${output}/index.html`, html)
