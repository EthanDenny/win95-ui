import { useEffect, useRef } from 'react'
import { TaskbarButton } from '../components/TaskbarButton'
import { Taskbar } from '../components/Taskbar'
import { StartMenu } from '../components/StartMenu'
import { kitIconNames } from '../icons'
import { appIds, applications } from './model'
import type { AppId } from './model'
import type { DesktopState } from './desktopState'

function iconPath(id: AppId, size: 16 | 32) {
  return id === 'calculator' ? '/apps/calculator-small.png' : `/icons/${kitIconNames.indexOf(applications[id].icon as typeof kitIconNames[number])}-${size}.png`
}
export function DesktopTaskbar({ state, activate, open }: { state: DesktopState; activate: (app: AppId | null, action: string) => Promise<void>; open: (app: AppId) => void }) {
  const start = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const keyboardOpen = useRef(false)
  const active = state.windows.findLast(w => !w.minimized)?.id
  const taskIds = appIds.filter(id => state.windows.some(w => w.id === id))
  useEffect(() => {
    if (state.startOpen) (keyboardOpen.current ? menu.current?.querySelector('button') : menu.current)?.focus()
  }, [state.startOpen])
  const dismiss = () => { void activate(null, 'start'); start.current?.focus() }
  return <>
    <Taskbar className="desktop-taskbar-layer" style={{ position: 'absolute', left: 0, top: 450, width: 640 }} clock={state.clock}
      start={<TaskbarButton ref={start} start icon="/icons/start-flag.png" selected={state.startOpen} data-start-control="" aria-label="Start" aria-expanded={state.startOpen} aria-haspopup="menu"
        onClick={event => { keyboardOpen.current = event.detail === 0; void activate(null, 'start') }}>Start</TaskbarButton>}
      tasks={taskIds.map(id => <TaskbarButton key={id} icon={iconPath(id, 16)} selected={active === id} aria-label={`Task: ${applications[id].title}`} onClick={() => void activate(null, `task:${id}`)}>{applications[id].title}</TaskbarButton>)} />
    {state.startOpen && <StartMenu ref={menu} className="desktop-start-layer" data-start-control="" style={{ left: 2, top: 285 }}
      items={appIds.map(id => ({ id, label: applications[id].title, icon: iconPath(id, 32) }))} onDismiss={dismiss}
      onSelect={id => { if (id === 'show-desktop') { void activate(null, 'show-desktop'); start.current?.focus() } else open(id as AppId) }} />}
  </>
}
