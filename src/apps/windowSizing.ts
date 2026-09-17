import type { AppWindow } from './model'
import type { Rect } from '../theme'

export type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se'
export const resizeEdges: ResizeEdge[] = ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se']
export const resizeLabels: Record<ResizeEdge, string> = { n: 'top', s: 'bottom', e: 'right', w: 'left', nw: 'top left', ne: 'top right', sw: 'bottom left', se: 'bottom right' }
export const canResize = (w: AppWindow) => w.id !== 'calculator' && !w.maximized

export function resizeWindow(w: AppWindow, edge: ResizeEdge, dx: number, dy: number): Rect {
  if (!canResize(w)) return { x: w.x, y: w.y, width: w.width, height: w.height }
  const minimum = w.id === 'browser' ? { width: 260, height: 230 } : { width: 332, height: 260 }
  let left = w.x, top = w.y, right = w.x + w.width, bottom = w.y + w.height
  if (edge.includes('w')) left = Math.max(0, Math.min(right - minimum.width, left + Math.round(dx)))
  if (edge.includes('e')) right = Math.min(640, Math.max(left + minimum.width, right + Math.round(dx)))
  if (edge.includes('n')) top = Math.max(0, Math.min(bottom - minimum.height, top + Math.round(dy)))
  if (edge.includes('s')) bottom = Math.min(450, Math.max(top + minimum.height, bottom + Math.round(dy)))
  return { x: left, y: top, width: right - left, height: bottom - top }
}
