import type { AppControl } from './model'
export const calculatorButtons: AppControl[] = [
  ...['Back', 'CE', 'C'].map((label, i) => ({ id: `key:${label}`, label, x: 107 + i * 53, y: 93, width: 49, height: 28 })),
  ...['MC', 'MR', 'MS', 'M+'].map((label, i) => ({ id: `key:${label}`, label, x: 14, y: 127 + i * 34, width: 36, height: 28 })),
  ...['7', '8', '9', '/', 'sqrt', '4', '5', '6', '*', '%', '1', '2', '3', '-', '1/x', '0', '+/-', '.', '+', '='].map((label, i) => ({ id: `key:${label}`, label, x: 66 + i % 5 * 40, y: 127 + Math.floor(i / 5) * 34, width: 36, height: 28 })),
]
export function calculatorButtonColor(label: string) {
  if (['Back', 'CE', 'C'].includes(label)) return '#800000'
  if (['sqrt', '%', '1/x'].includes(label)) return '#000080'
  return ['MC', 'MR', 'MS', 'M+', '/', '*', '-', '+', '='].includes(label) ? '#ff0000' : '#0000ff'
}
