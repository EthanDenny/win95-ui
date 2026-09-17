export type CalculatorState = {
  display: string
  stored: number | null
  operator: string | null
  fresh: boolean
  memory: number
  repeat: { operator: string; operand: number } | null
}
export const initialCalculator = (): CalculatorState => ({ display: '0', stored: null, operator: null, fresh: true, memory: 0, repeat: null })
const format = (value: number) => Number.isFinite(value) ? String(Number(value.toPrecision(12))) : 'Error'
const apply = (a: number, b: number, op: string) => op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b
export function calculate(state: CalculatorState, key: string): CalculatorState {
  const next = { ...state }
  const value = Number(state.display)
  if (key === 'C') return { ...initialCalculator(), memory: state.memory }
  if (key === 'MC') return { ...next, memory: 0 }
  if (key === 'MR') return { ...next, display: format(state.memory), fresh: true }
  if (!Number.isFinite(value) && key !== 'CE' && !/^\d$/.test(key)) return next
  if (/^\d$/.test(key)) return { ...next, display: state.fresh || state.display === '0' || state.display === 'Error' ? key : (state.display.length < 15 ? state.display + key : state.display), fresh: false }
  if (key === '.') return { ...next, display: state.fresh ? '0.' : state.display.includes('.') ? state.display : state.display + '.', fresh: false }
  if (key === 'CE') return { ...next, display: '0', fresh: true }
  if (key === 'Back') return { ...next, display: state.fresh ? '0' : state.display.slice(0, -1).replace(/^-$|^$/, '0') }
  if (key === 'MS') return { ...next, memory: value, fresh: true }
  if (key === 'M+') return { ...next, memory: state.memory + value, fresh: true }
  if (key === '+/-') return { ...next, display: format(-value) }
  if (key === 'sqrt' || key === '1/x' || key === '%') return { ...next, display: format(key === 'sqrt' ? Math.sqrt(value) : key === '1/x' ? 1 / value : (state.stored ?? 1) * value / 100), fresh: true }
  if (['+', '-', '*', '/'].includes(key)) {
    const result = state.operator && state.stored !== null && !state.fresh ? apply(state.stored, value, state.operator) : value
    return { ...next, display: format(result), stored: result, operator: key, fresh: true, repeat: null }
  }
  if (key === '=') {
    const op = state.operator ?? state.repeat?.operator
    const operand = state.operator ? value : state.repeat?.operand
    if (!op || operand === undefined) return next
    return { ...next, display: format(apply(state.stored ?? value, operand, op)), stored: null, operator: null, fresh: true, repeat: { operator: op, operand } }
  }
  return next
}
export const calculatorKey = (key: string) => ({ Enter: '=', Escape: 'C', Backspace: 'Back', Delete: 'CE', F9: '+/-', ',': '.', '@': 'sqrt', r: '1/x', R: '1/x' })[key] ?? (/^[\d.+\-*/%=]$/.test(key) ? key : null)
