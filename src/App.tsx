import { IconButton } from './components/IconButton'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { DISPLAY_HEIGHT, DISPLAY_WIDTH, fitDisplay, toDesktopPoint } from './display'
import { useWin95Cursors } from './useWin95Cursors'
import { useDesktop } from './apps/useDesktop'
import { appShortcut } from './apps/keyboard'
import { applications, appIds } from './apps/model'
import type { AppId, AppWindow } from './apps/model'
import { WindowResizeHandles } from './apps/WindowResizeHandles'
import { WindowTracking } from './components/WindowTracking'
import { DesktopTaskbar } from './apps/DesktopTaskbar'
import { DesktopWindowChrome } from './apps/DesktopWindowChrome'
import { CalculatorView } from './apps/CalculatorView'
import { ControlPanelView } from './apps/ControlPanelView'
import { BrowserView } from './apps/BrowserView'
import { AppMenu } from './apps/AppMenu'
import { AppDialog } from './apps/AppDialog'
import { panelLayout } from './apps/panelLayout'
import { kitIconNames } from './icons'
import type { Rect } from './theme'
import './App.css'

const getDisplay = () => fitDisplay(window.innerWidth, window.innerHeight, window.devicePixelRatio)
const bounds = (w: AppWindow, x: number, y: number) => ({ x: Math.max(0, Math.min(Math.round(x), 640 - w.width)), y: Math.max(0, Math.min(Math.round(y), 450 - w.height)) })
function App() {
  const { state, setState, focus, open, activate, getClock } = useDesktop()
  const [tracking, setTracking] = useState<Rect | null>(null)
  const [display, setDisplay] = useState(getDisplay)
  const shell = useRef<HTMLDivElement>(null)
  const addressInput = useRef<HTMLInputElement>(null)
  const dialogTriggers = useRef<Partial<Record<AppId, HTMLElement>>>({})
  const drag = useRef<{ id: AppId; pointer: number; dx: number; dy: number; window: AppWindow; bounds: Rect } | null>(null)
  useWin95Cursors(display.scale)
  useEffect(() => {
    const timer = window.setInterval(() => setState(s => { const clock = getClock(); return clock === s.clock ? s : { ...s, clock } }), 1000)
    const resize = () => setDisplay(getDisplay())
    let density: MediaQueryList
    const watch = () => { density?.removeEventListener('change', watch); resize(); density = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`); density.addEventListener('change', watch) }
    watch(); window.addEventListener('resize', resize)
    return () => { clearInterval(timer); window.removeEventListener('resize', resize); density.removeEventListener('change', watch) }
  }, [setState, getClock])
  const point = (event: PointerEvent) => toDesktopPoint({ x: event.clientX, y: event.clientY }, shell.current!.getBoundingClientRect())
  function startDrag(event: PointerEvent<HTMLDivElement>, w: AppWindow) {
    if (event.button !== 0 || w.maximized) return
    event.preventDefault(); const p = point(event)
    drag.current = { id: w.id, pointer: event.pointerId, dx: p.x - w.x, dy: p.y - w.y, window: w, bounds: w }
    event.currentTarget.focus(); setTracking(w); event.currentTarget.setPointerCapture(event.pointerId)
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    const d = drag.current
    if (!d || d.pointer !== event.pointerId) return
    const p = point(event); d.bounds = { ...d.window, ...bounds(d.window, p.x - d.dx, p.y - d.dy) }; setTracking(d.bounds)
  }
  const cancelDrag = () => { drag.current = null; setTracking(null) }
  const stop = () => { const d = drag.current; if (d) setState(s => ({ ...s, windows: s.windows.map(w => w.id === d.id ? { ...w, ...d.bounds } : w) })); cancelDrag() }
  useEffect(() => { const cancel = () => { drag.current = null; setTracking(null) }; window.addEventListener('blur', cancel); return () => window.removeEventListener('blur', cancel) }, [])
  const active = state.windows.findLast(w => !w.minimized)?.id
  useLayoutEffect(() => {
    const id = state.windows.findLast(w => !w.minimized)?.id
    const window = shell.current?.querySelector<HTMLElement>(`[data-app="${id}"]`)
    if (window && !window.contains(document.activeElement)) {
      const target = id === 'control-panel' ? window.querySelector<HTMLElement>('.w95-panel-icon[tabindex="0"]') : null
      const destination = target ?? window
      destination.focus({ preventScroll: true })
    }
  }, [state.windows])
  return <main className="display-viewport" aria-label="Windows 95 desktop">
    <div ref={shell} className="desktop-shell" style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT, left: display.left, top: display.top, background: state.apps.background, transform: `scale(${display.scale})` }} onPointerDownCapture={event => {
      if (!(event.target as Element).closest('[data-app-menu]')) setState(s => s.apps.menu ? { ...s, apps: { ...s.apps, menu: null } } : s)
      if (!(event.target as Element).closest('[data-start-control]')) setState(s => s.startOpen ? { ...s, startOpen: false } : s)
    }} onKeyDown={event => { if (event.key === 'Escape') { cancelDrag(); setState(s => ({ ...s, startOpen: false, apps: { ...s.apps, menu: null, notice: null, applet: null } })) } }}>
      <p className="sr-only">Double-click a desktop icon to open an app. Drag window title bars to move; drag window borders to resize. Release to apply or press Escape to cancel. Calculator is fixed-size.</p>
      {appIds.map((id, i) => <IconButton key={id} variant="desktop" icon={id === 'calculator' ? '/apps/calculator-small.png' : `/icons/${kitIconNames.indexOf(applications[id].icon as typeof kitIconNames[number])}-32.png`} aria-label={`Open ${applications[id].title}`} style={{ position: 'absolute', left: 8, top: 16 + i * 78 }} onDoubleClick={() => open(id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(id) } }}>
        {id === 'browser' ? <>Internet<br />Explorer</> : applications[id].title}
      </IconButton>)}
      {state.windows.filter(w => !w.minimized).map((w, index) => {
        const blocked = state.apps.notice?.app === w.id || w.id === 'control-panel' && state.apps.applet !== null
        const action = (id: string) => { if (!blocked && document.activeElement instanceof HTMLElement) dialogTriggers.current[w.id] = document.activeElement; if (id === 'command:Open address') { addressInput.current?.focus(); addressInput.current?.select() } void activate(w.id, id) }
        return <section key={w.id} data-app={w.id} tabIndex={-1} role="dialog" aria-label={applications[w.id].title} className="desktop-app-window" style={{ left: w.x, top: w.y, width: w.width, height: w.height, zIndex: 10 + index }} onPointerDownCapture={() => focus(w.id)} onFocusCapture={() => focus(w.id)}
          onKeyDown={event => {
            if (event.defaultPrevented || blocked || event.nativeEvent.isComposing) return
            if (tracking && event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancelDrag(); return }
            const target = event.target as HTMLElement
            const inMenu = !!target.closest('[role=menu],[role=menubar]')
            // Menus and resize tracking consume their own unmodified navigation keys.
            if (inMenu && !event.altKey && !event.ctrlKey && !/^F\d+$/.test(event.key)) return
            const editing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target.isContentEditable
            const command = appShortcut(w.id, event, editing)
            if (!command) return
            event.preventDefault(); event.stopPropagation()
            if (command === 'focus-menu') event.currentTarget.querySelector<HTMLButtonElement>('[role=menubar] button')?.focus()
            else if (command.startsWith('menu:')) event.currentTarget.querySelector<HTMLButtonElement>(`[data-menu-label="${command.slice(5)}"]`)?.click()
            else action(command)

          }}>
          <DesktopWindowChrome window={w} active={active === w.id} blocked={blocked} onCaption={action} titleProps={{ onPointerDown: e => startDrag(e, w), onPointerMove: move, onPointerUp: stop, onPointerCancel: cancelDrag, onLostPointerCapture: cancelDrag, onDoubleClick: () => action('maximize'), onKeyDown: event => {
            const directions: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
            const d = directions[event.key]; if (!d || w.maximized) return
            event.preventDefault(); const step = event.shiftKey ? 10 : 1
            setState(s => ({ ...s, windows: s.windows.map(current => current.id === w.id ? { ...current, ...bounds(current, current.x + d[0] * step, current.y + d[1] * step) } : current) }))
          } }} />
          {!blocked && <WindowResizeHandles window={w} point={point} onPreview={setTracking} onResize={rect => setState(s => ({ ...s, windows: s.windows.map(current => current.id === w.id ? { ...current, ...rect } : current), apps: { ...s.apps, panelScroll: w.id === 'control-panel' ? Math.min(s.apps.panelScroll, panelLayout(rect.width, rect.height).maximum) : s.apps.panelScroll, browser: w.id === 'browser' ? { ...s.apps.browser, scroll: Math.min(s.apps.browser.scroll, 480 - (rect.height - 144)) } : s.apps.browser } }))} />}
          <div className="w95-app-content" inert={blocked}>
            <AppMenu app={w.id} apps={state.apps} activate={action} close={() => setState(s => ({ ...s, apps: { ...s.apps, menu: null } }))} />
            {w.id === 'calculator' && <CalculatorView state={state.apps.calculator} activate={action} />}
            {w.id === 'control-panel' && <ControlPanelView window={w} selected={state.apps.selection} scroll={state.apps.panelScroll} onSelect={index => action(`applet:${index}`)} onOpen={index => action(`launch-applet:${index}`)} onScroll={value => setState(s => s.apps.panelScroll === value ? s : { ...s, apps: { ...s.apps, panelScroll: value } })} />}
            {w.id === 'browser' && <BrowserView window={w} state={state.apps.browser} activate={action} addressRef={addressInput} onAddress={address => setState(s => ({ ...s, apps: { ...s.apps, browser: { ...s.apps.browser, address } } }))} onScroll={value => setState(s => s.apps.browser.scroll === value ? s : { ...s, apps: { ...s.apps, browser: { ...s.apps.browser, scroll: value } } })} />}
          </div>
          {blocked && <AppDialog window={w} apps={state.apps} activate={action} returnFocus={dialogTriggers} />}
        </section>
      })}
      <WindowTracking bounds={tracking} />
      <DesktopTaskbar state={state} activate={activate} open={open} />
    </div>
  </main>
}
export default App
