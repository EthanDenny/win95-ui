import { useState } from 'react'
import { applications, initialApps, navigateBrowser, travelBrowser, panelNames } from './model'
import type { AppId, AppWindow } from './model'
import type { DesktopState } from './desktopState'
import { panelLayout } from './panelLayout'
import { calculate } from './calculator'
const clock = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
const newWindow = (id: AppId): AppWindow => ({ id, x: id === 'calculator' ? 155 : id === 'browser' ? 124 : 100, y: id === 'calculator' ? 74 : id === 'browser' ? 56 : 35, width: applications[id].width, height: applications[id].height, minimized: false, maximized: false })
export function useDesktop() {
  const [state, setState] = useState<DesktopState>(() => ({ windows: [newWindow('calculator')], apps: initialApps(), startOpen: false, clock: clock(), pressed: null, editingAddress: false }))
  const focus = (id: AppId) => setState(s => {
    const w = s.windows.find(w => w.id === id)
    if (!w || s.windows.at(-1)?.id === id) return s
    return { ...s, windows: [...s.windows.filter(w => w.id !== id), w], apps: { ...s.apps, menu: null } }
  })
  function open(id: AppId) {
    setState(s => ({ ...s, startOpen: false, windows: [...s.windows.filter(w => w.id !== id), { ...(s.windows.find(w => w.id === id) ?? newWindow(id)), minimized: false }] }))
  }
  async function activate(app: AppId | null, id: string) {
    if (id.startsWith('open:')) { open(id.slice(5) as AppId); return }
    if (id === 'command:Copy' || id === 'command:Copy address') {
      try {
        await navigator.clipboard.writeText(id === 'command:Copy' ? state.apps.calculator.display : state.apps.browser.address)
        setState(s => ({ ...s, apps: { ...s.apps, menu: null } }))
      } catch {
        setState(s => ({ ...s, apps: { ...s.apps, menu: null, notice: { app: app!, title: 'Clipboard', lines: ['Clipboard access was not available.'] } } }))
      }
      return
    }
    if (id === 'command:Paste') {
      try {
        const value = (await navigator.clipboard.readText()).trim()
        if (value && Number.isFinite(Number(value))) setState(s => ({ ...s, apps: { ...s.apps, menu: null, calculator: { ...s.apps.calculator, display: String(Number(value)), fresh: true } } }))
      } catch { setState(s => ({ ...s, apps: { ...s.apps, menu: null, notice: { app: 'calculator', title: 'Clipboard', lines: ['Clipboard access was not available.', 'Enter numbers using the keyboard.'] } } })) }
      return
    }
    if (id === 'external') {
      const address = state.apps.browser.history[state.apps.browser.index]
      if (/^https?:\/\//i.test(address)) window.open(address, '_blank', 'noopener,noreferrer')
      return
    }
    setState(s => {
      const next = { ...s, pressed: null }
      const apps = { ...s.apps }
      next.apps = apps
      if (!app) {
        if (id === 'start') next.startOpen = !s.startOpen
        if (id === 'show-desktop') { next.windows = s.windows.map(w => ({ ...w, minimized: true })); next.startOpen = false }
        if (id.startsWith('task:')) {
          const target = id.slice(5) as AppId, w = s.windows.find(w => w.id === target)!
          const active = s.windows.findLast(w => !w.minimized)?.id
          next.windows = [...s.windows.filter(w => w.id !== target), { ...w, minimized: target === active && !w.minimized }]
        }
        return next
      }
      if (id.startsWith('menu:')) { const label = id.slice(5); apps.menu = apps.menu?.app === app && apps.menu.label === label ? null : { app, label }; return next }
      apps.menu = null
      if (id === 'close' || id === 'command:Close') { next.windows = s.windows.filter(w => w.id !== app); apps.notice = null; if (app === 'control-panel') apps.applet = null; return next }
      if (id === 'minimize') { next.windows = s.windows.map(w => w.id === app ? { ...w, minimized: true } : w); return next }
      if (id === 'maximize' && app !== 'calculator') {
        next.windows = s.windows.map(w => w.id !== app ? w : w.maximized ? { ...w, ...w.restore!, maximized: false, restore: undefined } : { ...w, restore: { x: w.x, y: w.y, width: w.width, height: w.height }, x: 0, y: 0, width: 640, height: 450, maximized: true })
        const resized = next.windows.find(w => w.id === app)!
        if (app === 'control-panel') apps.panelScroll = Math.min(apps.panelScroll, panelLayout(resized.width, resized.height).maximum)
        if (app === 'browser') apps.browser = { ...apps.browser, scroll: Math.min(apps.browser.scroll, 480 - (resized.height - 144)) }
        return next
      }
      if (id === 'dialog-close') { apps.applet = null; apps.notice = null; return next }
      if (app === 'calculator' && id.startsWith('key:')) apps.calculator = calculate(s.apps.calculator, id.slice(4))
      if (app === 'control-panel') {
        if (['scroll-up', 'scroll-down', 'scroll-page-up', 'scroll-page-down'].includes(id)) {
          const w = s.windows.find(w => w.id === app)!
          const layout = panelLayout(w.width, w.height)
          apps.panelScroll = Math.max(0, Math.min(layout.maximum, s.apps.panelScroll + (id.endsWith('up') ? -1 : 1) * (id.includes('page') ? layout.page : 25)))
        }
        if (id.startsWith('applet:')) apps.selection = Number(id.slice(7))
        if (id.startsWith('launch-applet:')) { apps.applet = Number(id.slice(14)); apps.selection = apps.applet }
        if (id === 'command:Open') apps.applet = Math.max(0, apps.selection)
        if (id === 'command:Select first item') apps.selection = 0
        if (id.startsWith('color:')) apps.background = id.slice(6)
      }
      if (app === 'browser') {
        const action = id.replace(/^(tool|command):/, '')
        if (action === 'Back' || action === 'Forward') apps.browser = travelBrowser(apps.browser, action === 'Back' ? -1 : 1)
        if (action === 'Home' || action === 'links') apps.browser = navigateBrowser(apps.browser, 'about:home')
        if (action === 'Search' || action === 'Browser help') apps.browser = navigateBrowser(apps.browser, 'about:help')
        if (action === 'Refresh') apps.browser = { ...apps.browser, scroll: 0, stopped: false }
        if (action === 'Stop') apps.browser = { ...apps.browser, stopped: true }
        if (action === 'Favorites' || action === 'history') apps.menu = { app, label: action === 'history' ? 'History' : 'Favorites' }
        if (action === 'Add to Favorites') apps.browser = { ...apps.browser, favorites: [...new Set([...apps.browser.favorites, apps.browser.history[apps.browser.index]])] }
        if (id.startsWith('page:') || (id.startsWith('command:') && [...apps.browser.favorites, ...apps.browser.history].includes(action))) apps.browser = navigateBrowser(apps.browser, id.startsWith('page:') ? id.slice(5) : action)
        if (id === 'navigate') apps.browser = navigateBrowser(apps.browser, apps.browser.address)
        if (['scroll-up', 'scroll-down', 'scroll-page-up', 'scroll-page-down'].includes(id)) {
          const height = s.windows.find(w => w.id === 'browser')!.height - 144
          apps.browser = { ...apps.browser, scroll: Math.max(0, Math.min(480 - height, apps.browser.scroll + (id.endsWith('up') ? -1 : 1) * (id.includes('page') ? height - 20 : 42))) }
        }
        if (action === 'Print') apps.notice = { app, title: 'Print', lines: ['No printer is connected to this desktop.', 'Use your browser to print external pages.'] }
      }
      if (id.includes('About ')) apps.notice = { app, title: applications[app].title, lines: ['Microsoft Windows 95', `${applications[app].title} recreation`, 'Original UI reference: GUIdebook Gallery.'] }
      return next
    })
  }
  return { state, setState, focus, open, activate, getClock: clock, panelNames }
}
