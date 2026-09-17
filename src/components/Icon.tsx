import type { ComponentPropsWithRef } from 'react'
import { iconUrl } from '../icons'
import type { KitIconName } from '../icons'

type IconProps = Omit<ComponentPropsWithRef<'img'>, 'src' | 'width' | 'height'> & { size?: 16 | 32 } & (
  { name: KitIconName; src?: never } | { src: string; name?: never }
)
export function Icon({ name, src, size = 16, alt = '', style, ...props }: IconProps) {
  return <img {...props} src={src ?? iconUrl(name!, size)} width={size} height={size} alt={alt} draggable={false} style={{ imageRendering: 'pixelated', ...style }} />
}
