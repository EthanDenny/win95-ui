import { getBitmapFont, fontRoles } from '../../src/bitmapFont'
import type { FontRequest } from '../../src/bitmapFont'
export function drawBitmapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, request: FontRequest = fontRoles.ui, color = '#000', bold = false) {
  const font = getBitmapFont(request, bold)
  let cursor = Math.round(x)
  const top = Math.round(y)
  context.fillStyle = color
  for (const char of text) {
    const glyph = (font.glyphs[char] ?? font.glyphs[/\s/.test(char) ? ' ' : '?'])
    glyph.rows.forEach((row, dy) => {
      for (let dx = 0; dx < row.length; dx++) {
        if (row[dx] !== '1') continue
        const start = dx
        while (row[dx + 1] === '1') dx++
        context.fillRect(cursor + start, top + dy, dx - start + 1, 1)
      }
    })
    cursor += glyph.advance
  }
}
