export type Point = { x: number; y: number }
export type Rect = Point & { width: number; height: number }
export type CaptionKind = 'minimize' | 'maximize' | 'restore' | 'close'
export type ButtonState = 'normal' | 'pressed' | 'focused' | 'preferred' | 'disabled'

export const palette = {
  desktop: '#008080', silver: '#c0c0c0', gray: '#808080', navy: '#000080',
  white: '#ffffff', light: '#dfdfdf', black: '#000000', info: '#ffffe1',
} as const
export const metrics = { titleHeight: 18, captionWidth: 16, captionHeight: 14, buttonWidth: 75, buttonHeight: 23, startWidth: 54, startHeight: 22 } as const
// Original Windows 95 caption glyph; see public/reference/README.md.
export { CLOSE_PIXELS } from './captionGlyphs'

export function captionRects(r: Rect) {
  return {
    minimize: { x: r.x + r.width - 55, y: r.y + 5, width: metrics.captionWidth, height: metrics.captionHeight },
    maximize: { x: r.x + r.width - 39, y: r.y + 5, width: metrics.captionWidth, height: metrics.captionHeight },
    close: { x: r.x + r.width - 21, y: r.y + 5, width: metrics.captionWidth, height: metrics.captionHeight },
  }
}
