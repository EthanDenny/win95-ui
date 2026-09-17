import { Toolbar, ToolbarButton } from '../components/Toolbar'
import { StatusField } from '../components/StatusBar'
import type { Ref } from 'react'
import { ScrollArea } from '../components/ScrollArea'
import { TextInput } from '../components/TextInput'
import { NativeText } from '../components/NativeText'
import { Button } from '../components/Button'
import { SizeGrip } from '../components/SizeGrip'
import { blankAddress } from './model'
import type { AppWindow, BrowserState } from './model'
import { browserTools } from './browserLayout'

export function BrowserView({ window: w, state, onAddress, onScroll, activate, addressRef }: {
  window: AppWindow; state: BrowserState; onAddress: (value: string) => void; onScroll: (value: number) => void; activate: (action: string) => void; addressRef: Ref<HTMLInputElement>
}) {
  const current = state.history[state.index]
  const blank = current === blankAddress || current === 'about:blank'
  const title = current === 'about:windows' ? 'Welcome to Windows 95' : current === 'about:help' ? 'Internet Explorer Help' : /^https?:/i.test(current) ? 'Visit this website' : 'Welcome to the Internet'
  const lines = current === 'about:help' ? ['Type about:home or about:windows in Address.', 'Use Back and Forward to revisit pages.', 'Internet addresses open in your modern browser.', 'This desktop includes working local pages.'] : current === 'about:windows' ? ['Windows 95 introduced the Start menu,', 'taskbar, and a new Explorer desktop.', 'Try Calculator and Control Panel from Start.', 'Drag title bars to arrange your workspace.'] : ['Explore your desktop, or type an address above.', 'These pages work locally without a network.', 'Use the scroll bar or mouse wheel to read more.', 'Open Control Panel to change the desktop color.']
  const pageHeight = w.height - 144
  return <>
    <div className="w95-browser-bands" style={{ position: 'absolute', left: 4, top: 42, width: w.width - 8, height: 72 }}>
      <div className="w95-toolbar-grip" style={{ left: 4, top: 4, height: 36 }} />
      <Toolbar aria-label="Browser toolbar" style={{ position: 'absolute', left: 14, top: 3, width: w.width - 67, height: 39, overflow: 'hidden' }}>
        {browserTools.map((label, i) => {
          const disabled = i === 0 ? state.index === 0 : i === 1 && state.index === state.history.length - 1
          return <ToolbarButton key={label} aria-label={label} disabled={disabled} style={{ position: 'absolute', left: i * 50 }} icon={`/apps/tool-${i}${i < 2 && !disabled ? '-enabled' : ''}.png`} dropdown={i === 6} onClick={() => activate(`tool:${label}`)}>{label}</ToolbarButton>
        })}
      </Toolbar>
      <img src="/apps/ie-logo.png" alt="Internet Explorer" style={{ position: 'absolute', right: 2, top: 2, imageRendering: 'pixelated' }} />
      <div className="w95-rule" style={{ position: 'absolute', left: 1, top: 42, width: w.width - 11 }} />
      <div className="w95-toolbar-grip" style={{ left: 4, top: 46, height: 22 }} />
      <div className="w95-toolbar-grip" style={{ right: 35, top: 46, height: 22 }} />
      <label htmlFor="browser-address" className="w95-native-text" style={{ position: 'absolute', left: 14, top: 51 }}>Address</label>
      <form onSubmit={event => { event.preventDefault(); activate('navigate') }} style={{ position: 'absolute', left: 56, top: 46 }}>
        <TextInput ref={addressRef} id="browser-address" aria-label="Address" width={w.width - 113} height={22} value={state.address} style={{ paddingRight: 19 }} spellCheck={false} autoComplete="off" onFocus={event => event.currentTarget.select()} onChange={event => onAddress(event.target.value)} />
        <Button className="w95-browser-history" aria-label="Address history" width={16} height={18} style={{ position: 'absolute', right: 2, top: 2 }} onClick={() => activate('history')}>{''}</Button>
      </form>
      <button type="button" className="w95-browser-links w95-native-text" style={{ position: 'absolute', right: 1, top: 47 }} onClick={() => activate('links')}>Links</button>
    </div>
    <div className="w95-inset" style={{ position: 'absolute', left: 4, top: 117, width: w.width - 8, height: w.height - 140, padding: 2 }}>
      <ScrollArea label="Web page" width={w.width - 12} height={pageHeight} contentWidth={w.width - 28} contentHeight={blank ? pageHeight : 480} vertical y={state.scroll} onScroll={(_x, y) => onScroll(y)}>
        <div className="w95-native-text" style={{ width: '100%', height: '100%', background: blank ? '#c0c0c0' : '#fff' }}>
          {!blank && <>
            <NativeText font={{ family: 'ms-sans-serif', size: 10, weight: 'bold' }} color="#000080" style={{ position: 'absolute', left: 16, top: 18 }}>{title}</NativeText>
            <NativeText style={{ position: 'absolute', left: 16, top: 42 }}>Microsoft Internet Explorer</NativeText>
            <hr style={{ position: 'absolute', left: 16, top: 63, width: w.width - 68, margin: 0, border: 0, height: 1, background: '#808080' }} />
            {[['About Windows 95', 'about:windows'], ['Browser help', 'about:help']].map(([text, address], index) => <a key={address} href={address} className="w95-page-link" style={{ position: 'absolute', left: 16, top: 76 + index * 27 }} onClick={event => { event.preventDefault(); activate(`page:${address}`) }}>{text}</a>)}
            {/^https?:\/\//i.test(current) && <a className="w95-page-link" href={current} target="_blank" rel="noreferrer" style={{ position: 'absolute', left: 16, top: 130 }}>Open website in your browser</a>}
            {lines.map((line, index) => <NativeText key={line} style={{ position: 'absolute', left: 16, top: 166 + index * 22 }}>{line}</NativeText>)}
            <NativeText style={{ position: 'absolute', left: 16, top: 363 }}>You have reached the end of this page.</NativeText>
          </>}
        </div>
      </ScrollArea>
    </div>
    <StatusField variant="application" style={{ position: 'absolute', left: 4, bottom: 4, width: w.width - 180, height: 17 }}>{state.stopped ? 'Stopped' : 'Done'}</StatusField>
    <StatusField variant="application" style={{ position: 'absolute', right: 73, bottom: 4, width: 101, height: 17 }} />
    <StatusField variant="application" style={{ position: 'absolute', right: 4, bottom: 4, width: 67, height: 17 }}><img src="/apps/browser-status.png" alt="" style={{ position: 'absolute', left: 1, top: 1, imageRendering: 'pixelated' }} /></StatusField>
    <SizeGrip />
  </>
}
