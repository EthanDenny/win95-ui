import { Menu, MenuItem } from '../components/Menu'
import { MenuBar } from '../components/MenuBar'
import { useEffect, useRef } from 'react'
import { menuRects } from './chromeLayout'
import { menuItems } from './appCommands'
import type { AppId, DesktopApps } from './model'

export function AppMenu({ app, apps, activate, close }: { app: AppId; apps: DesktopApps; activate: (action: string) => void; close: () => void }) {
  const bar = useRef<HTMLDivElement>(null)
  const popup = useRef<HTMLDivElement>(null)
  const keyboardOpen = useRef(false)
  const selected = apps.menu?.app === app ? apps.menu.label : null
  const rects = menuRects(app)
  const origin = rects.find(item => item.label === selected) ?? { x: 60, y: 89 }
  const restoreFocus = () => { close(); (selected === 'History' ? bar.current?.closest('section')?.querySelector<HTMLButtonElement>('[aria-label="Address history"]') : bar.current?.querySelector<HTMLButtonElement>(`[data-menu-label="${selected}"]`))?.focus() }
  const switchMenu = (direction: number) => { keyboardOpen.current = true; const index = rects.findIndex(item => item.label === selected); activate(`menu:${rects[(index + direction + rects.length) % rects.length].label}`) }
  useEffect(() => {
    if (selected) (keyboardOpen.current ? popup.current?.querySelector('button') : popup.current)?.focus()
    keyboardOpen.current = false
  }, [selected])
  return <div data-app-menu="">
    <MenuBar ref={bar} aria-label="Application menu" selected={selected} style={{ height: 0 }}
      items={rects.map(r => ({ label: r.label, mnemonic: r.label === 'Favorites' ? 'a' : undefined, style: { position: 'absolute', left: r.x, top: r.y, width: r.width, height: r.height } }))}
      onOpen={(label, keyboard) => { keyboardOpen.current = keyboard; activate(`menu:${label}`) }}
      onDismiss={() => { close(); bar.current?.closest<HTMLElement>('section')?.focus() }} />
    {selected && <Menu ref={popup} aria-label={selected} style={{ position: 'absolute', left: origin.x, top: origin.y + 18, width: 187, zIndex: 10 }}
      onNavigate={switchMenu} onDismiss={restoreFocus}>
      {menuItems(app, selected, apps).map(label => <MenuItem key={label} onClick={() => { popup.current?.closest<HTMLElement>('section')?.focus(); activate(`command:${label}`) }}>{label}</MenuItem>)}
    </Menu>}
  </div>
}
