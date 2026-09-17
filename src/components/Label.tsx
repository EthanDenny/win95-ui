import type { ComponentPropsWithRef } from 'react'
import { NativeText } from './NativeText'
import { Icon } from './Icon'
import type { KitIconName } from '../icons'

export function Label({ children, icon, color, disabled, style, ...props }: Omit<ComponentPropsWithRef<'label'>, 'children' | 'color'> & {
  children: string; icon?: KitIconName; color?: string; disabled?: boolean
}) {
  return <label {...props} style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 4, ...style }}>
    {icon && <Icon name={icon} />}<NativeText color={color} disabled={disabled}>{children}</NativeText>
  </label>
}
