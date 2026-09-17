import { useRef, useState } from 'react'
import { Demo, Toggle } from './InteractiveDemo'
import { PixelScale } from './components/PixelScale'
import { Window } from './components/Window'
import { TaskbarButton } from './components/TaskbarButton'
import { Taskbar } from './components/Taskbar'
import { StatusBar } from './components/StatusBar'
import { Menu, MenuItem } from './components/Menu'

export function WindowDemo({ scale }: { scale: number }) {
  const [inactive, setInactive] = useState(false), [disabled, setDisabled] = useState(false), [withIcon, setWithIcon] = useState(true)
  const [position, setPosition] = useState({ x: 20, y: 16 })
  const [open, setOpen] = useState(true), [minimized, setMinimized] = useState(false), [maximized, setMaximized] = useState(false), [menu, setMenu] = useState(false)
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const r = maximized ? { x: 0, y: 0, width: 400, height: 204 } : { ...position, width: 264, height: 150 }
  const restore = () => { setOpen(true); setMinimized(false); setMenu(false) }
  return <Demo title="Window and taskbar" controls={<><Toggle title="Window" label="Inactive" value={inactive} onChange={setInactive} /><Toggle title="Window" label="Disable caption buttons" value={disabled} onChange={setDisabled} /><Toggle title="Window" label="Title icon" value={withIcon} onChange={setWithIcon} /><button onClick={() => { restore(); setMaximized(false); setPosition({ x: 20, y: 16 }) }}>Reset window</button><span aria-live="polite">{!open ? 'Closed' : minimized ? 'Minimized' : maximized ? 'Maximized' : 'Drag the title bar'}</span></>}>
    <PixelScale scale={scale} width={400} height={234}>
      <div className="w95-native-text" style={{ position: 'relative', width: 400, height: 234, background: '#fff' }}>
        {open && !minimized && <Window title="My Computer" label="window" icon={withIcon ? '/icons/0-16.png' : undefined} width={r.width} height={r.height} active={!inactive} captionDisabled={disabled} maximized={maximized}
          style={{ position: 'absolute', left: r.x, top: r.y }} onCaption={kind => kind === 'close' ? setOpen(false) : kind === 'minimize' ? setMinimized(true) : setMaximized(!maximized)}
          titleProps={{
            onDoubleClick: () => setMaximized(!maximized),
            onPointerDown: event => { if (maximized || event.button !== 0) return; event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); drag.current = { x: event.clientX, y: event.clientY, left: r.x, top: r.y } },
            onPointerMove: event => { if (drag.current) setPosition({ x: Math.max(0, Math.min(136, Math.round(drag.current.left + (event.clientX - drag.current.x) / scale))), y: Math.max(0, Math.min(54, Math.round(drag.current.top + (event.clientY - drag.current.y) / scale))) }) },
            onPointerUp: () => { drag.current = null }, onPointerCancel: () => { drag.current = null }, onLostPointerCapture: () => { drag.current = null },
            onKeyDown: event => { if (!maximized && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); setPosition(value => ({ x: Math.max(0, Math.min(136, value.x + (event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0))), y: Math.max(0, Math.min(54, value.y + (event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0))) })) } },
          }}>
          <span style={{ position: 'absolute', left: 12, top: 35 }}>Drag the title bar to move this window.</span>
          <StatusBar fields={[{ id: 'status', content: 'Ready' }]} style={{ position: 'absolute', left: 4, bottom: 4, width: r.width - 8 }} />
        </Window>}
        <Taskbar style={{ position: 'absolute', left: 0, top: 204, width: 400 }} clock="12:00 PM"
          start={<TaskbarButton start icon="/icons/start-flag.png" selected={menu} aria-label="Start menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>Start</TaskbarButton>}
          tasks={open && <TaskbarButton icon="/icons/0-16.png" selected={!minimized} aria-label="My Computer task" onClick={() => setMinimized(!minimized)}>My Computer</TaskbarButton>} />
        {menu && <Menu aria-label="Window actions" style={{ position: 'absolute', left: 2, top: 155, width: 144 }} onDismiss={() => setMenu(false)}>
          <MenuItem onClick={restore}>Open window</MenuItem><MenuItem onClick={() => { setOpen(false); setMenu(false) }}>Close window</MenuItem>
        </Menu>}
      </div>
    </PixelScale>
  </Demo>
}
