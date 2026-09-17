import type { ReactNode, CSSProperties } from 'react'
import './controls.css'

export function Pane({ title, children, style }: { title: string; children?: ReactNode; style?: CSSProperties }) {
  return <section className="w95-native-text" aria-label={title} style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
    <div className="w95-list-header">{title}</div>
    <div className="w95-inset" style={{ position: 'absolute', top: 22, bottom: 0, width: '100%', padding: 2, overflow: 'hidden' }}>{children}</div>
  </section>
}
