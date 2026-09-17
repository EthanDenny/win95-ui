import { measureBitmapText } from '../bitmapFont'
import { applications } from './model'
import type { AppControl, AppId } from './model'
export const menus: Record<AppId, string[]> = { calculator: ['Edit', 'View', 'Help'], 'control-panel': ['File', 'Edit', 'View', 'Help'], browser: ['File', 'Edit', 'View', 'Go', 'Favorites', 'Help'] }
export function menuRects(id: AppId): AppControl[] {
  let x = id === 'calculator' ? 7 : 8
  return menus[id].map(label => {
    const width = measureBitmapText(label) + 12
    const r = { id: `menu:${label}`, label, x, y: id === 'calculator' ? 24 : 25, width, height: 18 }
    x += width
    return r
  })
}
export function chromeControls(id: AppId, width: number): AppControl[] {
  const inset = id === 'calculator' ? 0 : 1
  return [
    { id: 'title', label: `Move ${applications[id].title}`, kind: 'title', x: 3, y: 3, width: width - 61, height: 18 },
    { id: 'minimize', label: `Minimize ${applications[id].title}`, x: width - 55 - inset, y: 5 + inset, width: 16, height: 14 },
    { id: 'maximize', label: `Maximize ${applications[id].title}`, x: width - 39 - inset, y: 5 + inset, width: 16, height: 14, disabled: id === 'calculator' },
    { id: 'close', label: `Close ${applications[id].title}`, x: width - 21 - inset, y: 5 + inset, width: 16, height: 14 },
    ...menuRects(id),
  ]
}
