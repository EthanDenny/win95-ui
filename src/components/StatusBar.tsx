import type { ComponentPropsWithRef, ReactNode } from 'react'
import { SizeGrip } from './SizeGrip'
import './controls.css'

export function StatusField({ className = '', variant = 'standard', ...props }: ComponentPropsWithRef<'div'> & { variant?: 'standard' | 'application' }) {
  return <div {...props} className={`${variant === 'application' ? 'w95-app-status' : 'w95-status-field'} w95-native-text ${className}`} />
}
export function StatusBar({ fields, grip = false, style, ...props }: Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  fields: { id: string; content: ReactNode; width?: number }[]; grip?: boolean
}) {
  return <div {...props} style={{ position: 'relative', display: 'flex', gap: 2, height: 18, background: '#c0c0c0', ...style }}>
    {fields.map(field => <StatusField key={field.id} style={{ flex: field.width === undefined ? 1 : 'none', width: field.width, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap' }}>{field.content}</StatusField>)}
    {grip && <SizeGrip />}
  </div>
}
