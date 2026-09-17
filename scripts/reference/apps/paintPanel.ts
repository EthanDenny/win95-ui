import { panelLayout, panelControls } from '../../../src/apps/panelLayout'
import { createCollectionPainter, scrollbarGeometry } from '../collectionControls'
import { appEdges, sizeGrip } from './edges'
import { createPainter, palette } from '../win95'
import { measureBitmapText } from '../../../src/bitmapFont'
import { appSprite } from './assets'
import { panelNames, panelLabels } from '../../../src/apps/model'
import type { AppControl } from '../../../src/apps/model'
export function panelScrollControls(width: number, height: number, value: number): AppControl[] {
  const layout = panelLayout(width, height)
  if (!layout.overflow) return []
  const g = scrollbarGeometry(layout.bar, 'vertical', { value, total: layout.total, page: layout.page })
  return [
    { ...g.start, id: 'scroll-up', label: 'Scroll icons up' },
    { ...g.end, id: 'scroll-down', label: 'Scroll icons down' },
    { ...g.before, id: 'scroll-page-up', label: 'Scroll icons one page up' },
    { ...g.after, id: 'scroll-page-down', label: 'Scroll icons one page down' },
    { ...g.thumb, id: 'scroll-thumb', label: 'Icon scroll position', kind: 'scroll-thumb' },
  ]
}
export function paintPanel(ctx: CanvasRenderingContext2D, width: number, height: number, selection: number, scroll = 0) {
  const p = createPainter(ctx)
  const edges = appEdges(ctx)
  const layout = panelLayout(width, height)
  p.bevel({ x: 4, y: 42, width: width - 8, height: height - 65 }, true)
  p.fill(6, 44, width - 12, height - 69, palette.white)
  ctx.save(); ctx.beginPath(); ctx.rect(6, 44, width - 12 - (layout.overflow ? 16 : 0), height - 69); ctx.clip()
  panelControls(width, height, scroll).forEach((r, i) => {
    appSprite(ctx, `applet-${i}`, r.x + 19, r.y + 1)
    const lines = panelLabels[i]
    const labelWidth = Math.max(...lines.map(line => measureBitmapText(line))) + 4
    const labelX = r.x + Math.floor((r.width - labelWidth) / 2)
    if (selection === i) p.fill(labelX, r.y + 37, labelWidth, lines.length * 13, palette.navy)
    lines.forEach((line, j) => p.text(line, r.x + Math.floor((r.width - measureBitmapText(line)) / 2), r.y + 37 + j * 13, 8, selection === i ? palette.white : palette.black))
    if (selection === i || (selection === -1 && i === 0)) {
      const x = labelX, y = r.y + 37, width = labelWidth, height = lines.length * 13
      ctx.save(); ctx.globalCompositeOperation = 'difference'
      const color = palette.white
      for (let dy = 0; dy < height; dy++) for (let dx = 0; dx < width; dx++) {
        if ((dy === 0 || dy === height - 1 || dx === 0 || dx === width - 1) && (dx + dy) % 2 === 0) p.fill(x + dx, y + dy, 1, 1, color)
      }
      ctx.restore()
    }
  })
  ctx.restore()
  if (layout.overflow) createCollectionPainter(ctx).scrollbar(layout.bar, 'vertical', { value: scroll, total: layout.total, page: layout.page })
  edges.status({ x: 4, y: height - 21, width: width - 8, height: 17 })
  p.text(selection < 0 ? '20 object(s)' : panelNames[selection], 7, height - 19)
  sizeGrip(ctx, width, height)
}
