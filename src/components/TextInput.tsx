import type { ComponentPropsWithRef } from 'react'
import './controls.css'

export type TextInputProps = Omit<ComponentPropsWithRef<'input'>, 'size'> & { width?: number; height?: number; borderless?: boolean }

// The input itself paints the frame, text, selection, and caret. There is no
// transparent input overlay or duplicate canvas editor to keep synchronized.
export function TextInput({ width = 180, height = 22, borderless = false, className = '', style, type = 'text', ...props }: TextInputProps) {
  return <input {...props} type={type} className={`w95-text-input ${borderless ? 'w95-text-input-borderless' : ''} ${className}`} style={{ ...style, width, height }} />
}
