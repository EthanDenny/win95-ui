import type { CSSProperties } from 'react'
import { Button } from './Button'

export type SpinnerProps = {
  onStep: (direction: 1 | -1) => void
  disabled?: boolean
  upDisabled?: boolean
  downDisabled?: boolean
  width?: number
  height?: number
  label?: string
  style?: CSSProperties
}
export function Spinner({ onStep, disabled, upDisabled, downDisabled, width = 16, height = 20, label = 'Spinner', style }: SpinnerProps) {
  return <div style={{ width, height, ...style }}>
    {(['up', 'down'] as const).map(direction => <Button key={direction} className={`w95-arrow-button w95-arrow-${direction}`}
      aria-label={`${label} ${direction}`} width={width} height={direction === 'up' ? Math.ceil(height / 2) : Math.floor(height / 2)}
      disabled={disabled || (direction === 'up' ? upDisabled : downDisabled)} onClick={() => onStep(direction === 'up' ? 1 : -1)}>{''}</Button>)}
  </div>
}
