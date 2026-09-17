import type { ComponentPropsWithRef } from 'react'
import { WindowChrome } from '../components/Window'
import { applications } from './model'
import type { AppWindow } from './model'

export function DesktopWindowChrome({ window: w, active, blocked, titleProps, onCaption }: {
  window: AppWindow; active: boolean; blocked: boolean; titleProps: ComponentPropsWithRef<'div'>; onCaption: (action: string) => void
}) {
  const title = w.id === 'browser' ? 'Microsoft Internet Explorer - Microsoft Internet Explorer' : applications[w.id].title
  return <WindowChrome title={title} label={applications[w.id].title} icon={`/apps/${w.id}-small.png`} width={w.width}
    active={active} inset={w.id === 'calculator' ? 3 : 4} maximized={w.maximized} disabled={blocked} maximizeDisabled={w.id === 'calculator'}
    frameClassName={w.id === 'browser' ? 'desktop-browser-frame' : ''} captionClassName={w.id === 'browser' ? 'w95-caption-browser' : ''}
    titleProps={{ ...titleProps, ...{ 'data-title': '' }, className: `desktop-title desktop-title-${w.id}`, style: { paddingLeft: 20 } }}
    onCaption={kind => onCaption(kind === 'restore' ? 'maximize' : kind)} />
}
