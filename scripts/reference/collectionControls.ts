import { scrollbarGeometry } from '../../src/collectionModel'
import type { Orientation, ScrollState, ListItem, TreeRow } from '../../src/collectionModel'
export * from '../../src/collectionModel'
import { measureBitmapText } from '../../src/bitmapFont'
import { createPainter, palette } from './win95'
import type { Rect } from './win95'

export function createCollectionPainter(context: CanvasRenderingContext2D) {
  const p = createPainter(context)
  const clip = (r: Rect, draw: () => void) => {
    context.save()
    context.beginPath()
    context.rect(r.x, r.y, r.width, r.height)
    context.clip()
    draw()
    context.restore()
  }
  const checker = (r: Rect, inverted = false) => {
    p.fill(r.x, r.y, r.width, r.height, inverted ? palette.black : palette.silver)
    for (let y = 0; y < r.height; y++) {
      for (let x = y % 2; x < r.width; x += 2) p.fill(r.x + x, r.y + y, 1, 1, inverted ? palette.gray : palette.white)
    }
  }
  const scrollArrow = (r: Rect, direction: 'up' | 'down' | 'left' | 'right', pressed = false, disabled = false) => {
    if (pressed) {
      p.fill(r.x, r.y, r.width, r.height, palette.gray)
      p.fill(r.x + 1, r.y + 1, r.width - 2, r.height - 2, palette.silver)
    } else p.buttonFrame(r)
    const rows = {
      up: ['0001000', '0011100', '0111110', '1111111'],
      down: ['1111111', '0111110', '0011100', '0001000'],
      left: ['0001', '0011', '0111', '1111', '0111', '0011', '0001'],
      right: ['1000', '1100', '1110', '1111', '1110', '1100', '1000'],
    }[direction]
    const x = r.x + Math.floor((r.width - rows[0].length) / 2) + Number(pressed)
    const y = r.y + Math.floor((r.height - rows.length) / 2) + Number(pressed)
    if (disabled) p.mask(rows, x + 1, y + 1, palette.white)
    p.mask(rows, x, y, disabled ? palette.gray : palette.black)
  }
  const scrollbar = (r: Rect, orientation: Orientation, state: ScrollState) => {
    const geometry = scrollbarGeometry(r, orientation, state)
    const disabled = state.disabled || geometry.maximum === 0
    checker(geometry.track)
    if (!disabled && (state.pressed === 'before' || state.pressed === 'after')) checker(geometry[state.pressed], true)
    scrollArrow(geometry.start, orientation === 'vertical' ? 'up' : 'left', state.pressed === 'start', disabled)
    scrollArrow(geometry.end, orientation === 'vertical' ? 'down' : 'right', state.pressed === 'end', disabled)
    if (!disabled) p.buttonFrame(geometry.thumb)
  }
  const pane = (r: Rect) => {
    p.bevel(r, true)
    p.fill(r.x + 2, r.y + 2, r.width - 4, r.height - 4, palette.white)
  }
  const header = (r: Rect, label: string, pressed = false) => {
    // Header controls use a shallow raised edge rather than a dialog-button border.
    p.fill(r.x, r.y, r.width, r.height, palette.gray)
    if (!pressed) {
      p.fill(r.x, r.y, r.width - 1, r.height - 1, palette.white)
      p.fill(r.x + 1, r.y + 1, r.width - 2, r.height - 2, palette.silver)
    } else p.fill(r.x + 1, r.y + 1, r.width - 1, r.height - 1, palette.silver)
    clip({ x: r.x + 2, y: r.y + 1, width: r.width - 4, height: r.height - 2 }, () => {
      p.text(label, r.x + 6 + Number(pressed), r.y + Math.floor((r.height - 13) / 2) + Number(pressed))
    })
  }
  const label = (value: string, x: number, y: number, selected = false, focused = false, active = true) => {
    const width = measureBitmapText(value) + 4
    if (selected) p.fill(x, y, width, 16, active ? palette.navy : palette.silver)
    p.text(value, x + 2, y + 1, 8, selected && active ? palette.white : palette.black)
    if (focused) {
      // Draw directly on the label boundary. The normal button focus helper is inset.
      const color = selected && active ? palette.white : palette.black
      for (let dx = 0; dx < width; dx += 2) { p.fill(x + dx, y, 1, 1, color); p.fill(x + dx, y + 15, 1, 1, color) }
      for (let dy = 0; dy < 16; dy += 2) { p.fill(x, y + dy, 1, 1, color); p.fill(x + width - 1, y + dy, 1, 1, color) }
    }
  }
  const expander = (x: number, y: number, expanded: boolean) => {
    p.fill(x, y, 9, 9, palette.gray)
    p.fill(x + 1, y + 1, 7, 7, palette.white)
    p.fill(x + 2, y + 4, 5, 1, palette.black)
    if (!expanded) p.fill(x + 4, y + 2, 1, 5, palette.black)
  }
  const listBox = (r: Rect, items: ListItem[], selected = -1, focused = false, active = true) => {
    clip(r, () => items.forEach((item, index) => {
      const y = r.y + index * 16
      const x = r.x + 2 + (item.indent ?? 0) * 8
      const highlighted = index === selected
      if (highlighted) p.fill(r.x, y, r.width, 16, active ? palette.navy : palette.silver)
      if (item.icon) p.icon(item.icon, x, y, 16)
      p.text(item.label, x + (item.icon ? 18 : 0), y + 1, 8, highlighted && active ? palette.white : palette.black)
      if (highlighted && focused) p.focus({ x: r.x - 2, y: y - 2, width: r.width + 4, height: 20 }, active ? palette.white : palette.black)
    }))
  }
  const columnList = (r: Rect, items: ListItem[], columnWidth: number, offset = 0, selected = -1, focused = false, active = true) => {
    const rows = Math.max(1, Math.floor(r.height / 16))
    clip(r, () => items.forEach((item, index) => {
      const x = r.x + Math.floor(index / rows) * columnWidth - offset
      const y = r.y + index % rows * 16
      clip({ x, y, width: columnWidth, height: 16 }, () => {
        if (item.icon) p.icon(item.icon, x, y, 16)
        label(item.label, x + (item.icon ? 16 : 0), y, index === selected, index === selected && focused, active)
      })
    }))
  }
  const tree = (r: Rect, rows: TreeRow[], selected: string, active = true, focused = active) => {
    clip(r, () => rows.forEach(({ item, depth, last, ancestors }, index) => {
      const y = r.y + index * 16
      const x = r.x + depth * 19
      const vertical = (column: number, height: number) => {
        for (let dy = 0; dy < height; dy += 2) p.fill(column, y + dy, 1, 1, palette.gray)
      }
      ancestors.forEach((continues, level) => { if (continues) vertical(r.x + level * 19 + 7, 16) })
      if (depth > 0) {
        vertical(x + 7, last ? 9 : 16)
        for (let dx = 7; dx < 20; dx += 2) p.fill(x + dx, y + 8, 1, 1, palette.gray)
      }
      if (item.children?.length) expander(x + 3, y + 4, !!item.expanded)
      p.icon(item.icon, x + 19, y, 16)
      label(item.label, x + 36, y, item.label === selected, item.label === selected && focused, active)
    }))
  }
  return { ...p, clip, checker, scrollbar, scrollArrow, pane, header, label, expander, tree, listBox, columnList }
}
