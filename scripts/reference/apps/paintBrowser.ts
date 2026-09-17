import { appEdges, sizeGrip } from './edges'
import { createCollectionPainter, scrollbarGeometry } from '../collectionControls'
import { measureBitmapText } from '../../../src/bitmapFont'
import { palette } from '../win95'
import { appSprite } from './assets'
import { blankAddress } from '../../../src/apps/model'
import type { AppControl, BrowserState } from '../../../src/apps/model'
import { browserTools } from '../../../src/apps/browserLayout'
export function browserControls(width: number, height: number, state: BrowserState): AppControl[] {
  const address = state.history[state.index]
  const blank = address === blankAddress || address === 'about:blank'
  const scroll = scrollbarGeometry({ x: width - 22, y: 119, width: 16, height: height - 144 }, 'vertical', { value: state.scroll, total: 480, page: height - 144 })
  return [
    ...browserTools.map((label, i) => ({ id: `tool:${label}`, label, x: 18 + i * 50, y: 45, width: 49, height: 38, disabled: (i === 0 && state.index === 0) || (i === 1 && state.index === state.history.length - 1) })).map(c => ({ ...c, width: Math.max(0, Math.min(c.width, width - 49 - c.x)) })).filter(c => c.width > 0),
    { id: 'address', kind: 'address', label: 'Address', value: state.address, x: 62, y: 92, width: width - 137, height: 15 },
    { id: 'history', label: 'Address history', x: width - 70, y: 92, width: 15, height: 16 },
    { id: 'links', label: 'Links', x: width - 41, y: 89, width: 36, height: 22 },
    ...(!blank ? [
      { ...scroll.thumb, id: 'scroll-thumb', label: 'Page scroll position', kind: 'scroll-thumb' as const },
      { ...scroll.before, id: 'scroll-page-up', label: 'Scroll one page up' },
      { ...scroll.after, id: 'scroll-page-down', label: 'Scroll one page down' },
      { id: 'scroll-up', label: 'Scroll page up', x: width - 22, y: 119, width: 16, height: 16 },
      { id: 'scroll-down', label: 'Scroll page down', x: width - 22, y: height - 40, width: 16, height: 16 },
      ...[
        { id: 'page:about:windows', label: 'About Windows 95', x: 22, y: 194 - state.scroll, width: 240, height: 21 },
        { id: 'page:about:help', label: 'Browser help', x: 22, y: 221 - state.scroll, width: 240, height: 21 },
        ...(/^https?:\/\//i.test(address) ? [{ id: 'external', label: 'Open website in your browser', x: 22, y: 248 - state.scroll, width: 290, height: 22 }] : []),
      ].filter(r => r.y >= 119 && r.y + r.height <= height - 25),
    ] : []),
  ]
}
export function paintBrowser(ctx: CanvasRenderingContext2D, width: number, height: number, state: BrowserState, pressed: string | null, editing = false, domControls = false) {
  const p = createCollectionPainter(ctx)
  const edges = appEdges(ctx)
  // Two toolbar bands share a sunken perimeter with raised inner edges.
  edges.status({ x: 4, y: 42, width: width - 8, height: 72 })
  p.fill(5, 43, width - 10, 69, palette.gray)
  p.fill(5, 43, width - 11, 69, palette.white)
  p.fill(6, 44, width - 12, 68, palette.silver)
  p.fill(6, 84, width - 12, 1, palette.gray)
  p.fill(5, 85, width - 11, 1, palette.white)
  p.fill(width - 49, 44, 1, 68, palette.gray)
  p.fill(width - 48, 44, 1, 68, palette.white)
  p.fill(width - 6, 43, 1, 70, palette.gray)
  p.fill(5, 85, width - 11, 1, palette.white)
  ;[{ x: 8, y: 46, height: 36 }, { x: 8, y: 88, height: 22 }, { x: width - 45, y: 88, height: 22 }].forEach(r => {
    ;[0, 3].forEach(dx => { p.fill(r.x + dx, r.y, 3, r.height, palette.gray); p.fill(r.x + dx, r.y, 2, r.height - 1, palette.white); p.fill(r.x + dx + 1, r.y + 1, 1, r.height - 2, palette.silver) })
  })
  p.fill(4, 112, width - 9, 1, palette.gray)
  p.clip({ x: 18, y: 45, width: width - 67, height: 39 }, () => {
  browserTools.forEach((label, i) => {
    const disabled = i === 0 ? state.index === 0 : i === 1 && state.index === state.history.length - 1
    const down = pressed === `tool:${label}`
    if (down && !disabled) p.buttonFrame({ x: 18 + i * 50, y: 45, width: 49, height: 38 }, true)
    appSprite(ctx, `tool-${i}${i < 2 && !disabled ? '-enabled' : ''}`, (i === 6 ? 328 : 33 + i * 50) + Number(down), 47 + Number(down))
    const x = 43 + i * 50 - Math.floor(measureBitmapText(label) / 2) + Number([1, 2, 4, 5].includes(i))
    if (disabled) p.text(label, x + 1, 69, 8, palette.white)
    p.text(label, x + Number(down), 68 + Number(down), 8, disabled ? palette.gray : palette.black)
  })
  p.mask(['1111111', '0111110', '0011100', '0001000'], 351, 57)
  })
  appSprite(ctx, 'ie-logo', width - 47, 44)
  p.text('Address', 18, 93)
  edges.sunken({ x: 60, y: 88, width: width - 113, height: 22 }, palette.white)
  if (!domControls) p.clip({ x: 62, y: 90, width: width - 133, height: 18 }, () => p.text(state.address, 63, 93))
  p.scrollArrow({ x: width - 71, y: 90, width: 16, height: 18 }, 'down')
  if (editing && !domControls) p.clip({ x: 62, y: 90, width: width - 133, height: 18 }, () => {
    const [start, end] = state.selection ?? [state.address.length, state.address.length]
    const x = 63 + measureBitmapText(state.address.slice(0, start))
    if (start === end) p.fill(x, 93, 1, 13, palette.black)
    else {
      const selected = state.address.slice(start, end)
      p.fill(x, 92, measureBitmapText(selected), 14, palette.navy)
      p.text(selected, x, 93, 8, palette.white)
    }
  })
  p.text('Links', width - 35, 93)
  edges.sunken({ x: 4, y: 117, width: width - 8, height: height - 140 })
  const current = state.history[state.index]
  const blank = current === blankAddress || current === 'about:blank'
  const viewport = { x: 6, y: 119, width: width - 28, height: height - 144 }
  p.fill(viewport.x, viewport.y, viewport.width, viewport.height, blank ? palette.silver : palette.white)
  p.scrollbar({ x: width - 22, y: 119, width: 16, height: height - 144 }, 'vertical', { value: state.scroll, total: blank ? 1 : 480, page: blank ? 1 : viewport.height })
  // IE's combo and scroll-arrow controls use a face-color outside edge
  // followed by a white highlight, unlike push buttons.
  ;[{ x: width - 71, y: 90, width: 16, height: 18 }, { x: width - 22, y: 119, width: 16, height: 16 }, { x: width - 22, y: height - 41, width: 16, height: 16 }].forEach(r => {
    p.fill(r.x, r.y, r.width - 1, 1, palette.silver)
    p.fill(r.x, r.y, 1, r.height - 1, palette.silver)
    p.fill(r.x + 1, r.y + 1, r.width - 3, 1, palette.white)
    p.fill(r.x + 1, r.y + 1, 1, r.height - 3, palette.white)
  })
  if (blank) {
    for (let y = 135; y < height - 41; y++) for (let x = width - 22; x < width - 6; x++) p.fill(x, y, 1, 1, (x + y) % 2 ? palette.silver : palette.white)
  }
  if (!blank) p.clip(viewport, () => {
    const y = 137 - state.scroll
    const title = current === 'about:windows' ? 'Welcome to Windows 95' : current === 'about:help' ? 'Internet Explorer Help' : /^https?:/i.test(current) ? 'Visit this website' : 'Welcome to the Internet'
    p.text(title, 22, y, 10, palette.navy, true)
    p.text('Microsoft Internet Explorer', 22, y + 24)
    p.fill(22, y + 45, width - 68, 1, palette.gray)
    ;['About Windows 95', 'Browser help'].forEach((label, i) => {
      p.text(label, 22, y + 58 + i * 27, 8, '#0000ff')
      p.fill(22, y + 70 + i * 27, measureBitmapText(label), 1, '#0000ff')
    })
    const lines = current === 'about:help' ? ['Type about:home or about:windows in Address.', 'Use Back and Forward to revisit pages.', 'Internet addresses open in your modern browser.', 'This desktop includes working local pages.'] : current === 'about:windows' ? ['Windows 95 introduced the Start menu,', 'taskbar, and a new Explorer desktop.', 'Try Calculator and Control Panel from Start.', 'Drag title bars to arrange your workspace.'] : ['Explore your desktop, or type an address above.', 'These pages work locally without a network.', 'Use the scroll bar or mouse wheel to read more.', 'Open Control Panel to change the desktop color.']
    if (/^https?:\/\//i.test(current)) { p.text('Open website in your browser', 22, y + 112, 8, '#0000ff'); p.fill(22, y + 124, 150, 1, '#0000ff') }
    lines.forEach((line, i) => p.text(line, 22, y + 148 + i * 22))
    p.text('You have reached the end of this page.', 22, y + 345)
  })
  edges.status({ x: 4, y: height - 21, width: width - 180, height: 17 })
  edges.status({ x: width - 174, y: height - 21, width: 101, height: 17 })
  edges.status({ x: width - 71, y: height - 21, width: 67, height: 17 })
  p.text(state.stopped ? 'Stopped' : 'Done', 7, height - 19)
  appSprite(ctx, 'browser-status', width - 70, height - 20)
  sizeGrip(ctx, width, height)
}
