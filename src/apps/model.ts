import { initialCalculator } from './calculator'
import type { CalculatorState } from './calculator'
import type { Rect } from '../theme'
export type AppId = 'calculator' | 'control-panel' | 'browser'
export type AppWindow = Rect & { id: AppId; minimized: boolean; maximized: boolean; restore?: Rect }
export type AppControl = Rect & { id: string; label: string; disabled?: boolean; kind?: 'address' | 'title' | 'scroll-thumb'; value?: string }
export const applications: Record<AppId, { title: string; width: number; height: number; icon: string }> = {
  calculator: { title: 'Calculator', width: 276, height: 272, icon: 'calculator' },
  'control-panel': { title: 'Control Panel', width: 415, height: 362, icon: 'Control Panel' },
  browser: { title: 'Internet Explorer', width: 480, height: 321, icon: 'Internet Explorer' },
}
export const appIds = Object.keys(applications) as AppId[]
export const blankAddress = 'C:\\WINDOWS\\SYSTEM\\BLANK.HTM'
export type BrowserState = { selection?: [number, number]; history: string[]; index: number; address: string; favorites: string[]; scroll: number; stopped: boolean }
export const initialBrowser = (): BrowserState => ({ history: [blankAddress], index: 0, address: blankAddress, favorites: ['about:home', 'about:windows'], scroll: 0, stopped: false })
export type DesktopApps = { focused: { app: AppId; id: string } | null; calculator: CalculatorState; browser: BrowserState; selection: number; panelScroll: number; applet: number | null; background: string; menu: { app: AppId; label: string } | null; notice: { app: AppId; title: string; lines: string[] } | null }
export const initialApps = (): DesktopApps => ({ focused: null, calculator: initialCalculator(), browser: initialBrowser(), selection: -1, panelScroll: 0, applet: null, background: '#008080', menu: null, notice: null })
export const panelNames = ['Accessibility Options', 'Add New Hardware', 'Add/Remove Programs', 'Date/Time', 'Display', 'Fonts', 'Keyboard', 'Mail and Fax', 'Microsoft Mail Postoffice', 'Modems', 'Mouse', 'Multimedia', 'Network', 'Passwords', 'Power', 'Printers', 'Regional Settings', 'Sounds', 'System']
export const panelLabels = [['Accessibility', 'Options'], ['Add New', 'Hardware'], ['Add/Remove', 'Programs'], ['Date/Time'], ['Display'], ['Fonts'], ['Keyboard'], ['Mail and Fax'], ['Microsoft Mail', 'Postoffice'], ['Modems'], ['Mouse'], ['Multimedia'], ['Network'], ['Passwords'], ['Power'], ['Printers'], ['Regional', 'Settings'], ['Sounds'], ['System']]
export function navigateBrowser(state: BrowserState, address: string): BrowserState {
  const trimmed = address.trim() || 'about:blank'
  const value = /^[\w-]+(?:\.[\w-]+)+(?:[/:].*)?$/.test(trimmed) ? `https://${trimmed}` : trimmed
  return { ...state, history: [...state.history.slice(0, state.index + 1), value], index: state.index + 1, address: value, scroll: 0, stopped: false }
}
export function travelBrowser(state: BrowserState, delta: number): BrowserState {
  const index = Math.max(0, Math.min(state.history.length - 1, state.index + delta))
  return { ...state, index, address: state.history[index], scroll: 0, stopped: false }
}
