import { calculatorKey } from './calculator'
import { menus } from './chromeLayout'
import type { AppId } from './model'

type KeyStroke = { key: string; altKey?: boolean; ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean; isComposing?: boolean }

// Return app commands only; unhandled keys keep their native control behavior.
export function appShortcut(app: AppId, event: KeyStroke, editing = false): string | null {
  if (event.isComposing || event.key === 'Process' || event.metaKey) return null
  const key = event.key.toLowerCase()
  if (event.altKey && !event.ctrlKey) {
    if (event.key === 'F4') return 'close'
    if (app === 'browser') {
      if (key === 'd') return 'command:Open address'
      if (event.key === 'ArrowLeft') return 'tool:Back'
      if (event.key === 'ArrowRight') return 'tool:Forward'
      if (event.key === 'Home') return 'tool:Home'
    }
    const menu = menus[app].find(label => (label === 'Favorites' ? 'a' : label[0].toLowerCase()) === key)
    return menu ? `menu:${menu}` : null
  }
  if (event.altKey) return null
  if (event.ctrlKey) {
    if (app === 'browser') {
      if (key === 'l' || key === 'o') return 'command:Open address'
      if (key === 'r') return 'tool:Refresh'
      if (key === 'p') return 'tool:Print'
      if (key === 'd') return 'command:Add to Favorites'
    }
    if (editing) return null
    if (app === 'calculator') return ({ c: 'command:Copy', v: 'command:Paste', l: 'key:MC', r: 'key:MR', m: 'key:MS', p: 'key:M+' } as Record<string, string>)[key] ?? null
    return null
  }
  if (event.key === 'F10' && !event.shiftKey) return 'focus-menu'
  if (event.key === 'F1') return app === 'browser' ? 'command:Browser help' : `menu:Help`
  if (app === 'browser') {
    if (event.key === 'F5') return 'tool:Refresh'
    if (event.key === 'F6') return 'command:Open address'
    if (event.key === 'F4') return 'history'
    if (event.key === 'Escape') return 'tool:Stop'
  }
  if (editing) return null
  if (app === 'calculator') {
    const key = calculatorKey(event.key)
    return key ? `key:${key}` : null
  }
  return null
}
