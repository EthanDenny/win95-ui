import type { ComponentPropsWithRef, CSSProperties } from 'react'
import './controls.css'

export function Toolbar({ style, ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} role="toolbar" style={{ display: 'flex', gap: 1, height: 39, overflow: 'hidden', ...style }} />
}
export function ToolbarButton({ children, icon, dropdown = false, iconStyle, style, ...props }: Omit<ComponentPropsWithRef<'button'>, 'children'> & {
  children: string; icon: string; dropdown?: boolean; iconStyle?: CSSProperties
}) {
  return <button {...props} type="button" className={`w95-browser-tool w95-native-text ${props.className ?? ''}`} style={{ position: 'relative', ...style }}>
    <img src={icon} alt="" draggable={false} style={{ position: 'absolute', left: dropdown ? 10 : 15, top: 2, ...iconStyle }} />
    <span>{children}</span>{dropdown && <span className="w95-down-glyph" style={{ left: 33, top: 12 }} />}
  </button>
}
