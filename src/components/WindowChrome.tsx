import type { ComponentPropsWithRef } from 'react'
import './controls.css'
import { Icon } from './Icon'

export function TitleBar({ title, icon, active = true, className = '', style, ...props }: Omit<ComponentPropsWithRef<'div'>, 'children'> & { title: string; icon?: string; active?: boolean }) {
  return <div {...props} className={`w95-title-bar w95-native-text ${className}`} data-active={active} style={style}>
    {icon && <Icon src={icon} />}
    <span className="w95-title-text">{title}</span>
  </div>
}

export function WindowFrame({ className = '', ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={`w95-window-frame ${className}`} />
}
