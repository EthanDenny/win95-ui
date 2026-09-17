import { createPainter, palette } from '../win95'
import type { Rect } from '../win95'
// Original application controls use COLOR_3DFACE inside a sunken edge,
// and COLOR_3DHILIGHT on a status-field bottom/right edge.
export function appEdges(ctx: CanvasRenderingContext2D) {
  const p = createPainter(ctx)
  const status = (r: Rect) => {
    p.fill(r.x, r.y, r.width, r.height, palette.white)
    p.fill(r.x, r.y, r.width - 1, r.height - 1, palette.gray)
    p.fill(r.x + 1, r.y + 1, r.width - 2, r.height - 2, palette.silver)
  }
  const sunken = (r: Rect, color: string = palette.silver) => {
    status(r)
    p.fill(r.x + 1, r.y + 1, r.width - 2, r.height - 2, palette.silver)
    p.fill(r.x + 1, r.y + 1, r.width - 3, r.height - 3, palette.black)
    p.fill(r.x + 2, r.y + 2, r.width - 4, r.height - 4, color)
  }
  return { status, sunken }
}
export function sizeGrip(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const p = createPainter(ctx)
  const rows = ['..............w.', '.............w..', '............wg..', '...........wgg..', '..........wgg...', '.........wgg.w..', '........wgg.wg..', '.......wgg.wgg..', '......wgg.wgg...', '.....wgg.wgg.w..', '....wgg.wgg.wg..', '...wgg.wgg.wgg..', '..wgg.wgg.wgg...', 'ww..............', '................']
  p.fill(width - 19, height - 18, 16, 15, palette.silver)
  p.mask(rows.map(row => row.replace(/[^w]/g, '0').replace(/w/g, '1')), width - 19, height - 18, palette.white)
  p.mask(rows.map(row => row.replace(/[^g]/g, '0').replace(/g/g, '1')), width - 19, height - 18, palette.gray)
}
