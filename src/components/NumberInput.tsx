import type { ComponentPropsWithRef, CSSProperties } from 'react'
import { TextInput } from './TextInput'
import { Spinner } from './Spinner'

type NumberInputProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'> & {
  value: string
  onChange: (value: string) => void
  min?: number
  max?: number
  step?: number
  width?: number
  height?: number
  containerStyle?: CSSProperties
}
export function NumberInput({ value, onChange, min = -Infinity, max = Infinity, step = 1, width = 100, height = 22, containerStyle, disabled, readOnly, style, onKeyDown, ...props }: NumberInputProps) {
  const number = Number(value) || 0
  const change = (direction: number) => onChange(String(Math.max(min, Math.min(max, Number((number + direction * step).toFixed(10))))))
  return <div style={{ position: 'relative', width, height, ...containerStyle }}>
    <TextInput {...props} role="spinbutton" inputMode="decimal" width={width} height={height} disabled={disabled} readOnly={readOnly} value={value}
      aria-valuenow={value !== '' && Number.isFinite(Number(value)) ? Number(value) : undefined}
      aria-valuemin={Number.isFinite(min) ? min : undefined} aria-valuemax={Number.isFinite(max) ? max : undefined}
      style={{ paddingRight: 18, ...style }} onChange={event => { if (/^-?\d*(\.\d*)?$/.test(event.target.value)) onChange(event.target.value) }}
      onKeyDown={event => {
        onKeyDown?.(event)
        if (!event.defaultPrevented && !disabled && !readOnly && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
          event.preventDefault(); change(event.key === 'ArrowUp' ? 1 : -1)
        }
      }} />
    <Spinner label={props['aria-label'] ?? 'Number'} height={height - 4} disabled={disabled || readOnly} upDisabled={number >= max} downDisabled={number <= min}
      onStep={change} style={{ position: 'absolute', right: 2, top: 2 }} />
  </div>
}
