import type { ComponentPropsWithRef, CSSProperties } from 'react'
import { getBitmapFont, measureBitmapText, fontRoles } from '../bitmapFont'
import type { FontRequest } from '../bitmapFont'
import './fonts.css'

function nativeFontStyle(font: FontRequest = fontRoles.ui): CSSProperties {
  const native = getBitmapFont(font)
  const spec = typeof font === 'number' ? { family: 'ms-sans-serif', size: font } : font
  const family = spec.family === 'ms-sans-serif' && spec.size === 8 ? 'Chat95 MS Sans Serif' : `Chat95 ${spec.family} ${spec.size}`
  return { fontFamily: `'${family}', sans-serif`, fontSize: native.height, lineHeight: `${native.height}px`, fontWeight: native.weight === 'bold' ? 700 : 400 }
}
export function NativeText({ children, font = fontRoles.ui, color = '#000', disabled = false, style, className = '', ...props }: Omit<ComponentPropsWithRef<'span'>, 'children'> & { children: string; font?: FontRequest; color?: string; disabled?: boolean }) {
  return <span {...props} className={`w95-native-text w95-text ${className}`} style={{ display: 'inline-block', whiteSpace: 'pre', width: measureBitmapText(children, font), height: getBitmapFont(font).height, ...nativeFontStyle(font), color: disabled ? '#808080' : color, textShadow: disabled ? '1px 1px #fff' : undefined, ...style }}>{children}</span>
}
