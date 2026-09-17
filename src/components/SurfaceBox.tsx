import type { ComponentPropsWithRef } from 'react'
import './controls.css'
export type SurfaceKind = 'Raised' | 'Sunken' | 'Window' | 'Status'
export function SurfaceBox({ kind = 'Raised', className = '', ...props }: ComponentPropsWithRef<'div'> & { kind?: SurfaceKind }) {
  return <div {...props} className={`${{ Raised: 'w95-raised', Sunken: 'w95-inset', Window: 'w95-window-frame', Status: 'w95-status-field' }[kind]} ${className}`} />
}
export function ColumnHeader({ className = '', ...props }: ComponentPropsWithRef<'button'>) {
  return <button {...props} type="button" className={`w95-list-header w95-native-text ${className}`} />
}
