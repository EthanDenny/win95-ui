import type { ComponentPropsWithRef, CSSProperties, ReactNode } from 'react'
import { CaptionButton } from './CaptionButton'
import { TitleBar, WindowFrame } from './WindowChrome'
import type { CaptionKind } from '../theme'

export type WindowChromeProps = {
  title: string; label?: string; icon?: string; width: number; active?: boolean; inset?: number; maximized?: boolean
  disabled?: boolean; captionDisabled?: boolean; maximizeDisabled?: boolean; titleProps?: Omit<ComponentPropsWithRef<'div'>, 'title'>
  frameClassName?: string; captionClassName?: string; onCaption: (kind: CaptionKind) => void
}
export function WindowChrome({ title, label = title, icon, width, active = true, inset = 3, maximized, disabled, captionDisabled, maximizeDisabled, titleProps, frameClassName = '', captionClassName, onCaption }: WindowChromeProps) {
  return <>
    <WindowFrame className={frameClassName} aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
    <div aria-hidden="true" style={{ position: 'absolute', left: inset, top: inset, width: width - inset * 2, height: 18, zIndex: 2, pointerEvents: 'none', background: active ? '#000080' : '#808080' }} />
    <TitleBar {...titleProps} title={title} icon={icon} active={active} inert={disabled} tabIndex={disabled ? -1 : 0} role="group" aria-label={`Move ${label}`}
      style={{ position: 'absolute', left: inset, top: inset, width: width - inset - 59, zIndex: 2, ...titleProps?.style }} />
    {(['minimize', 'maximize', 'close'] as const).map((kind, index) => <CaptionButton key={kind} kind={kind === 'maximize' && maximized ? 'restore' : kind} className={captionClassName}
      data-window-control={kind}
      aria-label={`${kind === 'maximize' && maximized ? 'Restore' : kind[0].toUpperCase() + kind.slice(1)} ${label}`}
      disabled={disabled || captionDisabled || kind === 'maximize' && maximizeDisabled} style={{ position: 'absolute', left: width - [55, 39, 21][index] - (inset - 3), top: inset + 2, zIndex: 4 }} onClick={() => onCaption(kind === 'maximize' && maximized ? 'restore' : kind)} />)}
  </>
}
export function Window({ height, children, style, className = '', ...chrome }: WindowChromeProps & { height: number; children?: ReactNode; style?: CSSProperties; className?: string }) {
  return <section role="dialog" aria-label={chrome.label ?? chrome.title} className={`w95-native-text ${className}`} style={{ position: 'relative', width: chrome.width, height, ...style }}>
    <WindowChrome {...chrome} />{children}
  </section>
}
