import { calculatorButtons, calculatorButtonColor } from '../../../src/apps/calculatorLayout'
import { createPainter, palette } from '../win95'
import { measureBitmapText, fontRoles } from '../../../src/bitmapFont'
import type { CalculatorState } from '../../../src/apps/calculator'
export function paintCalculator(ctx: CanvasRenderingContext2D, state: CalculatorState, pressed: string | null, domButtons = false) {
  const p = createPainter(ctx)
  p.fill(4, 46, 268, 1, palette.gray); p.fill(4, 47, 268, 1, palette.white)
  p.bevel({ x: 14, y: 61, width: 249, height: 26 }, true)
  p.fill(16, 63, 245, 22, palette.white)
  const label = state.display === 'Error' || state.display.includes('.') || /e/i.test(state.display) ? state.display : `${state.display}.`
  p.text(label, 255 - measureBitmapText(label), 67)
  p.bevel({ x: 14, y: 93, width: 36, height: 26 }, true)
  if (state.memory) p.text('M', 25, 99)
  if (domButtons) return
  calculatorButtons.forEach(r => {
    const down = pressed === r.id
    p.buttonFrame(r, down)

    p.text(r.label, r.x + Math.floor((r.width - measureBitmapText(r.label, fontRoles.systemControl)) / 2) + Number(down), r.y + 6 + Number(down), fontRoles.systemControl, calculatorButtonColor(r.label))
  })
}
