import type { Rect } from '../win95'
import { createPainter, palette } from '../win95'
import { measureBitmapText } from '../../../src/bitmapFont'
import { paintApp } from './render'
import { appSprite } from './assets'
import { appIds, applications } from '../../../src/apps/model'
import type { AppId } from '../../../src/apps/model'
export const TASKBAR_Y = 450
import type { DesktopState } from '../../../src/apps/desktopState'
export function appIcon(ctx: CanvasRenderingContext2D, id: AppId, x: number, y: number, size: 16 | 32) {
  if (id === 'calculator') appSprite(ctx, 'calculator-small', x, y, size, size)
  else createPainter(ctx).icon(applications[id].icon, x, y, size)
}
export function drawDesktop(ctx: CanvasRenderingContext2D, state: DesktopState, tracking: Rect | null = null, domWindows = false) {
  const p = createPainter(ctx)
  p.fill(0, 0, 640, 480, state.apps.background)
  appIds.forEach((id, i) => {
    appIcon(ctx, id, 28, 19 + i * 78, 32)
    const labels = id === 'control-panel' ? ['Control Panel'] : id === 'browser' ? ['Internet', 'Explorer'] : ['Calculator']
    labels.forEach((line, j) => {
      const x = 44 - Math.floor(measureBitmapText(line) / 2), y = 55 + i * 78 + j * 13
      p.text(line, x + 1, y + 1); p.text(line, x, y, 8, palette.white)
    })
  })
  const active = state.windows.findLast(w => !w.minimized)?.id
  if (!domWindows) state.windows.filter(w => !w.minimized).forEach(w => paintApp(ctx, w, state.apps, w.id === active, state.pressed?.app === w.id ? state.pressed.id : null, state.editingAddress))
  if (!domWindows) {
    p.fill(0, TASKBAR_Y, 640, 30, palette.silver)
    p.fill(0, TASKBAR_Y, 640, 1, palette.light); p.fill(0, TASKBAR_Y + 1, 640, 1, palette.white)
    p.startButton(2, 454, state.startOpen || state.pressed?.id === 'start')
    p.fill(59, 454, 1, 22, palette.gray); p.fill(60, 454, 1, 22, palette.white)
    // Stable task order while activation changes the window stacking order.
    appIds.filter(id => state.windows.some(w => w.id === id)).forEach((id, i) => {
      const x = 64 + i * 157
      p.taskButton({ x, y: 454, width: 153, height: 22 }, id === active)
      appIcon(ctx, id, x + 4, 457, 16)
      p.text(applications[id].title, x + 24, 458, 8, palette.black, id === active)
    })
    p.recess({ x: 548, y: 454, width: 89, height: 22 }); p.text(state.clock, 557, 458)
    if (state.startOpen) {
      p.windowFrame({ x: 2, y: 285, width: 199, height: 165 })
      p.fill(5, 288, 22, 159, palette.gray)
      p.text('95', 9, 429, 8, palette.white, true)
      appIds.forEach((id, i) => {
        const y = 292 + i * 37
        if (state.pressed?.id === `open:${id}`) p.fill(28, y, 169, 36, palette.navy)
        appIcon(ctx, id, 33, y + 2, 32); p.text(applications[id].title, 71, y + 10, 8, state.pressed?.id === `open:${id}` ? palette.white : palette.black)
      })
      p.fill(30, 408, 163, 1, palette.gray); p.fill(30, 409, 163, 1, palette.white)
      p.text('Show Desktop', 41, 424)
    }
  }
  if (tracking) drawTrackingFrame(ctx, tracking)
}

export function drawTrackingFrame(ctx: CanvasRenderingContext2D, tracking: Rect) {
  const p = createPainter(ctx)
  const { x, y, width, height } = tracking
  ctx.save()
  ctx.globalCompositeOperation = 'difference'
  for (let dy = 0; dy < height; dy++) for (let dx = 0; dx < width; dx++) {
    if ((dx < 3 || dy < 3 || dx >= width - 3 || dy >= height - 3) && (x + dx + y + dy) % 2 === 0) p.fill(x + dx, y + dy, 1, 1, palette.white)
  }
  ctx.restore()
}
