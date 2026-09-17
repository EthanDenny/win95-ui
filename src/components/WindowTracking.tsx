import './controls.css'
import type { Rect } from '../theme'
export function WindowTracking({ bounds }: { bounds: Rect | null }) {
  if (!bounds) return null
  return <div className="window-tracking" aria-hidden="true" style={{ left: bounds.x, top: bounds.y, width: bounds.width, height: bounds.height }}>
    {[{ left: 0, top: 0, width: bounds.width, height: 3 }, { left: 0, top: bounds.height - 3, width: bounds.width, height: 3 }, { left: 0, top: 3, width: 3, height: bounds.height - 6 }, { left: bounds.width - 3, top: 3, width: 3, height: bounds.height - 6 }].map((rect, index) => <span key={index} style={{ position: 'absolute', ...rect, backgroundPosition: `${-(bounds.x + rect.left)}px ${-(bounds.y + rect.top)}px` }} />)}
  </div>
}
