import type { CSSProperties } from 'react'
import { Button } from './Button'
import type { ButtonProps } from './Button'
import { captionGlyphs } from '../captionGlyphs'

type CaptionKind = keyof typeof captionGlyphs
const images = Object.fromEntries(Object.entries(captionGlyphs).map(([kind, glyph]) => {
  const path = glyph.rows.flatMap((row, y) => [...row].flatMap((pixel, x) => pixel === '1' ? [`M${x} ${y}h1v1h-1z`] : [])).join('')
  const svg = (disabled: boolean) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${glyph.rows[0].length + 1}" height="${glyph.rows.length + 1}" shape-rendering="crispEdges">${disabled ? `<path fill="white" transform="translate(1 1)" d="${path}"/>` : ''}<path fill="${disabled ? '#808080' : 'black'}" d="${path}"/></svg>`)}")`
  return [kind, { normal: svg(false), disabled: svg(true) }]
}))

export function CaptionButton({ kind, disabled = false, className = '', style, ...props }: Omit<ButtonProps, 'children' | 'width' | 'height'> & { kind: CaptionKind }) {
  const glyph = captionGlyphs[kind]
  return <Button {...props} aria-label={props['aria-label'] ?? kind} className={`w95-caption ${className}`} width={16} height={14} disabled={disabled}
    style={{ ...style, '--caption-image': disabled ? images[kind].disabled : images[kind].normal, '--caption-x': `${glyph.x}px`, '--caption-y': `${glyph.y}px` } as CSSProperties}>{''}</Button>
}
