import { panelNames } from './model'
import type { AppControl } from './model'
export function panelLayout(width: number, height: number) {
  const page = height - 69
  let columns = Math.max(1, Math.floor((width - 16) / 75))
  const overflow = Math.ceil(panelNames.length / columns) * 75 - 8 > page
  if (overflow) columns = Math.max(1, Math.floor((width - 32) / 75))
  const total = Math.ceil(panelNames.length / columns) * 75 - 8
  return { columns, page, total, maximum: Math.max(0, total - page), overflow, bar: { x: width - 22, y: 44, width: 16, height: page } }
}
export function panelControls(width: number, height = 362, scroll = 0): AppControl[] {
  const { columns } = panelLayout(width, height)
  return panelNames.map((label, i) => ({ id: `applet:${i}`, label, x: 8 + i % columns * 75, y: 45 + Math.floor(i / columns) * 75 - scroll, width: 71, height: 66 }))
}
