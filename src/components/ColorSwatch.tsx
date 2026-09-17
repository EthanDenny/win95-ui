import type { ComponentPropsWithRef } from 'react'
import './controls.css'

export function ColorSwatch({ color, selected = false, style, className = '', ...props }: ComponentPropsWithRef<'button'> & { color: string; selected?: boolean }) {
  return <button {...props} type="button" className={`w95-color-swatch w95-button ${className}`} data-state={selected ? 'pressed' : 'normal'} aria-pressed={selected} style={{ width: 40, height: 30, ...style }}>
    <span className="w95-button-frame" aria-hidden="true" /><span aria-hidden="true" style={{ position: 'absolute', inset: 4, background: color, opacity: props.disabled ? 0.5 : 1 }} />
  </button>
}
