import type { ComponentPropsWithRef, ReactNode } from 'react'
import './controls.css'
import './choice-glyphs.css'

type ChoiceProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'size' | 'children'> & { children?: ReactNode }

function Choice({ children, type, className = '', style, ...props }: ChoiceProps & { type: 'checkbox' | 'radio' }) {
  return <label className={`w95-choice ${className}`} style={style}>
    <input {...props} type={type} className={`w95-choice-input w95-${type}`} />
    {children && <span className="w95-choice-label w95-native-text">{children}</span>}
  </label>
}

export function Checkbox(props: ChoiceProps) { return <Choice {...props} type="checkbox" /> }
export function Radio(props: ChoiceProps) { return <Choice {...props} type="radio" /> }
