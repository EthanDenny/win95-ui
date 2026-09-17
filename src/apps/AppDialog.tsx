import type { RefObject } from 'react'
import { Button } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { ColorSwatch } from '../components/ColorSwatch'
import { dialogRect, desktopColors } from './appCommands'
import { panelNames } from './model'
import type { AppId, AppWindow, DesktopApps } from './model'

export function AppDialog({ window: w, apps, activate, returnFocus }: { window: AppWindow; apps: DesktopApps; activate: (action: string) => void; returnFocus: RefObject<Partial<Record<AppId, HTMLElement>>> }) {
  const r = dialogRect(w)
  const notice = apps.notice?.app === w.id ? apps.notice : null
  const index = apps.applet
  const title = notice?.title ?? `${panelNames[index!]} Properties`
  const lines = notice?.lines ?? (index === 4 ? ['Background', 'Choose a color for your desktop.', 'Changes apply immediately.'] : index === 18 ? ['Microsoft Windows 95', '4.00.950', 'React desktop recreation · 640 x 480', 'Runs locally in your web browser.'] : index === 3 ? ['Date and time', new Date().toLocaleString(), 'The taskbar follows your system clock.', 'Change your clock in your computer settings.'] : [panelNames[index!], 'This applet is an informational preview.', 'Hardware and operating-system settings', 'are managed by your computer.'])
  return <Dialog title={title} width={r.width} height={r.height} restoreFocus={() => returnFocus.current[w.id]} onClose={() => activate('dialog-close')}
    style={{ position: 'absolute', left: r.x, top: r.y, zIndex: 20 }}
    actions={<Button data-dialog-default="" defaultButton onClick={() => activate('dialog-close')}>OK</Button>}>
    {lines.map((line, i) => <span key={i} style={{ position: 'absolute', left: 18, top: 35 + i * 21, whiteSpace: 'nowrap' }}>{line}</span>)}
    {index === 4 && !notice && desktopColors.map((color, i) => <ColorSwatch key={color} color={color} selected={apps.background === color}
      aria-label={`Desktop color ${['Teal', 'Green', 'Blue', 'Purple', 'Black', 'Gray'][i]}`} style={{ position: 'absolute', left: 18 + i * 48, top: 108 }} onClick={() => activate(`color:${color}`)} />)}
  </Dialog>
}
