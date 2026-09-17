import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export function PixelScale({ scale, width, height, children }: { scale: number; width: number; height: number; children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const align = () => {
      const element = content.current!
      const bounds = element.parentElement!.getBoundingClientRect()
      const density = window.devicePixelRatio
      const x = Math.round(bounds.x * density) / density - bounds.x
      const y = Math.round(bounds.y * density) / density - bounds.y
      element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
    }
    align()
    window.addEventListener('resize', align)
    return () => window.removeEventListener('resize', align)
  }, [scale, width, height])
  return <div className="w95-scale" style={{ width: width * scale, height: height * scale }}><div ref={content} style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div></div>
}
