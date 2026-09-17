import { createCanvas, loadImage } from '@napi-rs/canvas'
import { mkdirSync, writeFileSync } from 'node:fs'

// Pre-scale original cursor bitmaps so the browser never needs a canvas.
mkdirSync('public/cursors/scaled', { recursive: true })
for (const name of ['arrow', 'ibeam', 'sizewe', 'sizens', 'sizenwse', 'sizenesw', 'no']) {
  const source = await loadImage(`public/cursors/${name}.png`)
  for (let scale = 2; scale <= 16; scale++) {
    const canvas = createCanvas(source.width * scale, source.height * scale)
    const context = canvas.getContext('2d')
    context.imageSmoothingEnabled = false
    context.drawImage(source, 0, 0, canvas.width, canvas.height)
    writeFileSync(`public/cursors/scaled/${name}-${scale}.png`, canvas.toBuffer('image/png'))
  }
}
