import { useState } from 'react'
import type { ComponentPropsWithRef } from 'react'
import { NativeText } from './NativeText'
import { fontRoles, getBitmapFont, measureBitmapText } from '../bitmapFont'
import type { FontRequest } from '../bitmapFont'
import type { ButtonState } from '../theme'
import './controls.css'

type FaceProps = { children: string; width?: number; height?: number; font?: FontRequest; color?: string }
export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'children' | 'color'> & FaceProps & { defaultButton?: boolean }

function ButtonFace({ children, width = 75, height = 23, font = fontRoles.ui, color, state }: FaceProps & { state: ButtonState }) {
  const offset = Number(state === 'pressed')
  return <>
    <span className="w95-button-frame" aria-hidden="true" />
    {children && <NativeText className="w95-button-label" font={font} color={color} disabled={state === 'disabled'}
      style={{ left: Math.floor((width - measureBitmapText(children, font)) / 2) + offset, top: Math.floor((height - getBitmapFont(font).height) / 2) + offset }}>{children}</NativeText>}
    {state === 'focused' && <span className="w95-button-focus" aria-hidden="true" />}
  </>
}

export function Button({ children, width = 75, height = 23, font, color, defaultButton = false, disabled = false, type = 'button', className = '', style, onPointerDown, onPointerUp, onPointerCancel, onPointerLeave, onPointerEnter, onKeyDown, onKeyUp, onFocus, onBlur, ...props }: ButtonProps) {
  const [pressed, setPressed] = useState(false)
  const [focused, setFocused] = useState(false)
  const state: ButtonState = disabled ? 'disabled' : pressed ? 'pressed' : focused ? 'focused' : defaultButton ? 'preferred' : 'normal'
  return <button {...props} type={type} disabled={disabled} className={`w95-button ${className}`} data-state={state} style={{ ...style, width, height }}
    onPointerDown={event => { if (event.button === 0) setPressed(true); onPointerDown?.(event) }}
    onPointerUp={event => { setPressed(false); onPointerUp?.(event) }}
    onPointerCancel={event => { setPressed(false); onPointerCancel?.(event) }}
    onPointerLeave={event => { setPressed(false); onPointerLeave?.(event) }}
    onPointerEnter={event => { if (event.buttons === 1 && event.currentTarget.matches(':active')) setPressed(true); onPointerEnter?.(event) }}
    onKeyDown={event => { if (event.key === ' ' || event.key === 'Enter') setPressed(true); onKeyDown?.(event) }}
    onKeyUp={event => { setPressed(false); onKeyUp?.(event) }}
    onFocus={event => { setFocused(event.currentTarget.matches(':focus-visible')); onFocus?.(event) }}
    onBlur={event => { setPressed(false); setFocused(false); onBlur?.(event) }}>
    <ButtonFace width={width} height={height} font={font} color={color} state={state}>{children}</ButtonFace>
  </button>
}

// Non-interactive specimens share the real button's CSS and label layout.
export function ButtonSpecimen({ state, width = 75, height = 23, ...props }: FaceProps & { state: ButtonState }) {
  return <span className="w95-button" data-state={state} role="img" aria-label={`${props.children}: ${state}`} style={{ width, height }}>
    <ButtonFace {...props} width={width} height={height} state={state} />
  </span>
}
