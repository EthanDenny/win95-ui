import { useEffect, useRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { TitleBar, WindowFrame } from './WindowChrome'

export function Dialog({ title, children, actions, onClose, restoreFocus, width = 300, height = 170, style, ...props }: Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'onKeyDown'> & {
  title: string; actions?: ReactNode; onClose: () => void; restoreFocus?: () => HTMLElement | null | undefined; width?: number; height?: number
}) {
  const element = useRef<HTMLDivElement>(null)
  const restore = useRef(restoreFocus)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    const previous = restore.current?.() ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null)
    const fallback = element.current?.closest('section')?.querySelector<HTMLElement>('[data-title]')
    const initial = element.current?.querySelector<HTMLElement>('[data-dialog-default]') ?? element.current?.querySelector<HTMLElement>('button:not(:disabled), input:not(:disabled), [tabindex="0"]')
    ;(initial ?? element.current)?.focus()
    return () => { mounted.current = false; queueMicrotask(() => { if (!mounted.current) (previous?.isConnected ? previous : fallback)?.focus() }) }
  }, [])
  return <WindowFrame {...props} ref={element} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className={`w95-native-text ${props.className ?? ''}`} style={{ width, height, ...style }}
    onKeyDown={event => {
      if (event.key === 'Escape' || event.altKey && event.key === 'F4') { event.preventDefault(); event.stopPropagation(); onClose() }
      if (event.key === 'Tab') {
        const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]')].filter(node => !node.closest('[inert], [hidden]') && node.getClientRects().length > 0)
        const index = focusable.indexOf(document.activeElement as HTMLElement)
        event.preventDefault()
        if (focusable.length) focusable[(index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length].focus()
        else event.currentTarget.focus()
      }
    }}>
    <TitleBar title={title} style={{ position: 'absolute', left: 3, top: 3, width: width - 6 }} />
    {children}
    {actions && <div style={{ position: 'absolute', right: 12, bottom: 13, display: 'flex', gap: 6 }}>{actions}</div>}
  </WindowFrame>
}
