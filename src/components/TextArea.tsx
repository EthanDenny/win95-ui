import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ComponentPropsWithRef, Ref } from 'react'
import { Scrollbar } from './Scrollbar'
import './controls.css'

type ScrollState = { value: number; total: number; page: number }

function updateRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) ref.current = value
}

export function TextArea({ width = 300, height = 70, style, className = '', ref, id: suppliedId, disabled, onInput, onScroll, ...props }: ComponentPropsWithRef<'textarea'> & { width?: number; height?: number }) {
  const generatedId = useId()
  const id = suppliedId ?? generatedId
  const area = useRef<HTMLTextAreaElement>(null)
  const [scroll, setScroll] = useState<ScrollState>({ value: 0, total: 1, page: 1 })
  const setArea = useCallback((element: HTMLTextAreaElement | null) => {
    area.current = element
    updateRef(ref, element)
  }, [ref])
  const measure = useCallback(() => {
    const element = area.current
    if (!element) return
    const next = { value: element.scrollTop, total: Math.max(element.scrollHeight, element.clientHeight), page: element.clientHeight }
    setScroll(current => current.value === next.value && current.total === next.total && current.page === next.page ? current : next)
  }, [])
  useLayoutEffect(measure)
  useLayoutEffect(() => {
    const element = area.current!
    let active = true
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    void document.fonts.ready.then(() => { if (active) measure() })
    return () => { active = false; observer.disconnect() }
  }, [measure])
  const scrollTo = (value: number) => {
    area.current!.scrollTop = value
    measure()
  }
  return <div className="w95-textarea-frame w95-inset" data-disabled={disabled || undefined} style={{ width, height }}>
    <textarea {...props} ref={setArea} id={id} disabled={disabled} className={`w95-textarea w95-native-text ${className}`} style={style}
      onInput={event => { onInput?.(event); measure() }} onScroll={event => { onScroll?.(event); measure() }} />
    <div className="w95-textarea-scrollbar">
      <Scrollbar orientation="vertical" length={height - 4} total={scroll.total} page={scroll.page} value={scroll.value}
        scale={1} controls={id} onChange={scrollTo} disabled={disabled} />
    </div>
  </div>
}
