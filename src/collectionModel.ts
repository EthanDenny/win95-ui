import type { Rect } from './theme'
export type Orientation = 'horizontal' | 'vertical'
export type ScrollPart = 'start' | 'end' | 'thumb' | 'before' | 'after'
export type ScrollState = { value: number; total: number; page: number; pressed?: ScrollPart; disabled?: boolean }
export const scrollSize = 16

export function scrollbarGeometry(r: Rect, orientation: Orientation, state: ScrollState) {
  const vertical = orientation === 'vertical'
  const length = vertical ? r.height : r.width
  const trackLength = Math.max(0, length - scrollSize * 2)
  const maximum = Math.max(0, state.total - state.page)
  const thumbLength = Math.min(trackLength, Math.max(8, Math.round(trackLength * state.page / Math.max(1, state.total))))
  const travel = trackLength - thumbLength
  const offset = maximum ? Math.round(travel * Math.max(0, Math.min(maximum, state.value)) / maximum) : 0
  const rect = (start: number, size: number): Rect => vertical
    ? { x: r.x, y: r.y + start, width: r.width, height: size }
    : { x: r.x + start, y: r.y, width: size, height: r.height }
  return {
    maximum, travel,
    start: rect(0, scrollSize), end: rect(length - scrollSize, scrollSize),
    track: rect(scrollSize, trackLength), thumb: rect(scrollSize + offset, thumbLength),
    before: rect(scrollSize, offset), after: rect(scrollSize + offset + thumbLength, travel - offset),
  }
}
export type TreeItem = { label: string; icon: string; children?: TreeItem[]; expanded?: boolean }
export type ListItem = { label: string; icon?: string; indent?: number }
export type TreeRow = { item: TreeItem; depth: number; last: boolean; ancestors: boolean[] }
export function flattenTree(items: TreeItem[], depth = 0, ancestors: boolean[] = []): TreeRow[] {
  return items.flatMap((item, index) => {
    const last = index === items.length - 1
    return [{ item, depth, last, ancestors }, ...(item.expanded && item.children
      ? flattenTree(item.children, depth + 1, [...ancestors, !last]) : [])]
  })
}
