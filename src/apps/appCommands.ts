import type { AppId, DesktopApps, AppWindow } from './model'
export function menuItems(id: AppId, label: string, apps: DesktopApps): string[] {
  if (id === 'calculator') return label === 'Edit' ? ['Copy', 'Paste'] : label === 'View' ? ['Standard'] : ['About Calculator']
  if (id === 'control-panel') return label === 'File' ? ['Open', 'Close'] : label === 'Edit' ? ['Select first item'] : label === 'View' ? ['Refresh'] : ['About Control Panel']
  if (label === 'History') return [...new Set(apps.browser.history)].slice(-7).reverse()
  return label === 'File' ? ['Open address', 'Close'] : label === 'Edit' ? ['Copy address'] : label === 'View' ? ['Refresh', 'Stop'] : label === 'Go' ? ['Back', 'Forward', 'Home'] : label === 'Favorites' ? ['Add to Favorites', ...apps.browser.favorites.slice(-7)] : ['Browser help', 'About Internet Explorer']
}
export function dialogRect(w: AppWindow) { const width = Math.min(338, w.width - 16); return { x: Math.floor((w.width - width) / 2), y: 50, width, height: 208 } }
export const desktopColors = ['#008080', '#008000', '#000080', '#800080', '#000000', '#808080']
