import { Button } from '../components/Button'
import { NativeText } from '../components/NativeText'
import { fontRoles } from '../bitmapFont'
import { calculatorButtons, calculatorButtonColor } from './calculatorLayout'
import type { CalculatorState } from './calculator'

export function CalculatorView({ state, activate }: { state: CalculatorState; activate: (action: string) => void }) {
  const label = state.display === 'Error' || state.display.includes('.') || /e/i.test(state.display) ? state.display : `${state.display}.`
  return <>
    <div className="w95-rule" style={{ position: 'absolute', left: 4, top: 46, width: 268 }} />
    <output aria-label="Calculator display" aria-live="polite" className="w95-inset" style={{ position: 'absolute', left: 14, top: 61, width: 249, height: 26 }}><NativeText style={{ position: 'absolute', right: 8, top: 6 }}>{label}</NativeText></output>
    <div className="w95-inset w95-memory" style={{ position: 'absolute', left: 14, top: 93, width: 36, height: 26 }}><NativeText style={{ position: 'absolute', left: 11, top: 6 }}>{state.memory ? 'M' : ''}</NativeText></div>
    {calculatorButtons.map(c => <Button key={c.id} width={c.width} height={c.height} style={{ position: 'absolute', left: c.x, top: c.y }} font={fontRoles.systemControl} color={calculatorButtonColor(c.label)} onClick={() => activate(c.id)}>{c.label}</Button>)}
  </>
}
