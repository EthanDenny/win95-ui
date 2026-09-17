import type { ReactNode } from 'react'
export function Demo({ title, controls, children }: { title: string; controls?: ReactNode; children: ReactNode }) {
  return <article className="interactive-demo"><h3>{title}</h3><div className="interactive-demo-body"><div className="sample-stage">{children}</div><div className="demo-options">{controls}</div></div></article>
}
export function Toggle({ title, label, value, onChange }: { title: string; label: string; value: boolean; onChange: (value: boolean) => void }) {
  return <label><input type="checkbox" aria-label={`${title}: ${label}`} checked={value} onChange={event => onChange(event.target.checked)} /> {label}</label>
}
