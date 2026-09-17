import { menuItems, dialogRect, desktopColors } from '../../../src/apps/appCommands'
import { chromeControls, menuRects } from '../../../src/apps/chromeLayout'
import { calculatorButtons } from '../../../src/apps/calculatorLayout'
import { panelControls } from '../../../src/apps/panelLayout'
import { createPainter, palette } from '../win95'
import { paintChrome } from './chrome'
import { paintCalculator } from './paintCalculator'
import { paintPanel, panelScrollControls } from './paintPanel'
import { paintBrowser, browserControls } from './paintBrowser'
import { panelNames } from '../../../src/apps/model'
import type { AppControl, DesktopApps, AppWindow } from '../../../src/apps/model'
export function appControls(w: AppWindow, apps: DesktopApps): AppControl[] {
  const notice = apps.notice?.app === w.id
  if (notice || (w.id === 'control-panel' && apps.applet !== null)) {
    const r = dialogRect(w)
    return [
      { id: 'dialog-close', label: 'OK', x: r.x + r.width - 87, y: r.y + r.height - 36, width: 75, height: 23 },
      ...(w.id === 'control-panel' && apps.applet === 4 && !notice ? desktopColors.map((color, i) => ({ id: `color:${color}`, label: `Desktop color ${['Teal', 'Green', 'Blue', 'Purple', 'Black', 'Gray'][i]}`, x: r.x + 18 + i * 48, y: r.y + 108, width: 40, height: 30 })) : []),
    ]
  }
  const controls = [...chromeControls(w.id, w.width).map(c => c.id === 'maximize' && w.maximized ? { ...c, label: `Restore ${w.id === 'browser' ? 'Internet Explorer' : 'Control Panel'}` } : c), ...(w.id === 'calculator' ? calculatorButtons : w.id === 'control-panel' ? [...panelControls(w.width, w.height, apps.panelScroll).map(c => {
    const top = Math.max(44, c.y), bottom = Math.min(w.height - 25, c.y + c.height)
    return { ...c, y: top, height: Math.max(0, bottom - top) }
  }).filter(c => c.height > 0), ...panelScrollControls(w.width, w.height, apps.panelScroll)] : browserControls(w.width, w.height, apps.browser))]
  if (apps.menu?.app === w.id) {
    const r = menuRects(w.id).find(item => item.label === apps.menu!.label) ?? { x: 60, y: 89 }
    controls.push(...menuItems(w.id, apps.menu.label, apps).map((label, i) => ({ id: `command:${label}`, label, x: r.x + 3, y: r.y + 21 + i * 20, width: 181, height: 20 })))
  }
  return controls
}
export function paintApp(ctx: CanvasRenderingContext2D, w: AppWindow, apps: DesktopApps, active = true, pressed: string | null = null, editing = false, domControls = false) {
  ctx.save(); ctx.beginPath(); ctx.rect(w.x, w.y, w.width, w.height); ctx.clip(); ctx.translate(w.x, w.y)
  paintChrome(ctx, w.id, w.width, w.height, active, pressed, w.maximized, domControls)
  if (w.id === 'calculator') paintCalculator(ctx, apps.calculator, pressed, domControls && apps.notice?.app !== w.id)
  if (w.id === 'control-panel') paintPanel(ctx, w.width, w.height, apps.selection, apps.panelScroll)
  if (w.id === 'browser') paintBrowser(ctx, w.width, w.height, apps.browser, pressed, editing, domControls && apps.notice?.app !== w.id)
  const p = createPainter(ctx)
  if (apps.menu?.app === w.id) {
    const r = menuRects(w.id).find(item => item.label === apps.menu!.label) ?? { x: 60, y: 89 }
    const items = menuItems(w.id, apps.menu.label, apps)
    p.bevel({ x: r.x, y: r.y + 18, width: 187, height: items.length * 20 + 6 })
    items.forEach((item, i) => {
      const selected = pressed === `command:${item}`
      if (selected) p.fill(r.x + 3, r.y + 21 + i * 20, 181, 20, palette.navy)
      p.text(item, r.x + 17, r.y + 24 + i * 20, 8, selected ? palette.white : palette.black)
    })
  }
  const notice = apps.notice?.app === w.id ? apps.notice : null
  if (notice || (w.id === 'control-panel' && apps.applet !== null)) {
    const r = dialogRect(w)
    p.windowFrame(r)
    p.titleBar(r, notice?.title ?? `${panelNames[apps.applet!]} Properties`)
    const index = apps.applet
    const lines = notice?.lines ?? (index === 4 ? ['Background', 'Choose a color for your desktop.', 'Changes apply immediately.'] : index === 18 ? ['Microsoft Windows 95', '4.00.950', 'React desktop recreation · 640 x 480', 'Runs locally in your web browser.'] : index === 3 ? ['Date and time', new Date().toLocaleString(), 'The taskbar follows your system clock.', 'Change your clock in your computer settings.'] : [panelNames[index!], 'This applet is an informational preview.', 'Hardware and operating-system settings', 'are managed by your computer.'])
    lines.forEach((line, i) => p.text(line, r.x + 18, r.y + 35 + i * 21))
    if (index === 4 && !notice) desktopColors.forEach((color, i) => {
      const swatch = { x: r.x + 18 + i * 48, y: r.y + 108, width: 40, height: 30 }
      p.buttonFrame(swatch, apps.background === color); p.fill(swatch.x + 4, swatch.y + 4, 32, 22, color)
    })
    if (!domControls) p.pushButton({ x: r.x + r.width - 87, y: r.y + r.height - 36, width: 75, height: 23 }, 'OK', pressed === 'dialog-close' ? 'pressed' : 'preferred')
  }
  if (apps.focused?.app === w.id) {
    const control = appControls(w, apps).find(c => c.id === apps.focused!.id)
    if (control && !(domControls && (control.id.startsWith('key:') || control.id === 'dialog-close'))) p.focus(control)
  }
  ctx.restore()
}
