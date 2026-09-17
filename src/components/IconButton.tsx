import type { ComponentPropsWithRef, ReactNode } from 'react'
import './controls.css'
import './desktop-controls.css'

export function IconButton({ icon, children, variant = 'panel', selected, style, className = '', ...props }: Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  icon: string; children: ReactNode; variant?: 'panel' | 'desktop'; selected?: boolean
}) {
  return <button {...props} type="button" className={`w95-${variant === 'desktop' ? 'desktop' : 'panel'}-icon w95-native-text ${className}`}
    aria-pressed={selected} style={{ position: 'relative', ...style }}>
    <img src={icon} alt="" width={32} height={32} draggable={false} /><span>{children}</span>
  </button>
}
