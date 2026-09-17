import type { ReactNode } from 'react'
import { PixelScale } from './components/PixelScale'
export function Specimen({ title, scale, width, height, children, background = '#c0c0c0' }: { title: string; scale: number; width: number; height: number; children: ReactNode; background?: string }) {
  return <article className="sample-card"><h3>{title}</h3><div className="sample-stage"><PixelScale scale={scale} width={width} height={height}><div inert className="w95-native-text" style={{ position: 'relative', width, height, background, overflow: 'hidden' }}>{children}</div></PixelScale></div></article>
}
