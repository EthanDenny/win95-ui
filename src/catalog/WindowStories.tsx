import { useRef, useState } from 'react'
import { Demo, Toggle } from '../InteractiveDemo'
import { PixelScale } from '../components/PixelScale'
import { TitleBar, WindowFrame } from '../components/WindowChrome'
import { WindowChrome } from '../components/Window'
import { CaptionButton } from '../components/CaptionButton'
import { Button } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { TextInput } from '../components/TextInput'
import { StatusBar, StatusField } from '../components/StatusBar'
import { SizeGrip } from '../components/SizeGrip'
import { WindowTracking } from '../components/WindowTracking'
import type { CaptionKind } from '../theme'
import type { StoryProps } from './entries'

export function TitleBarStory({ scale }: StoryProps) {
  const [inactive, setInactive] = useState(false), [icon, setIcon] = useState(true)
  return <Demo title="Window title" controls={<><Toggle title="Title bar" label="Inactive" value={inactive} onChange={setInactive} /><Toggle title="Title bar" label="Icon" value={icon} onChange={setIcon} /></>}>
    <PixelScale scale={scale} width={260} height={18}><TitleBar title="My Computer" icon={icon ? '/icons/0-16.png' : undefined} active={!inactive} /></PixelScale>
  </Demo>
}
export function WindowFrameStory({ scale }: StoryProps) {
  return <PixelScale scale={scale} width={200} height={70}><WindowFrame style={{ width: 200, height: 70 }} /></PixelScale>
}
export function WindowChromeStory({ scale }: StoryProps) {
  const [inactive, setInactive] = useState(false), [disabled, setDisabled] = useState(false), [maximized, setMaximized] = useState(false), [last, setLast] = useState('Ready')
  return <Demo title="Complete window chrome" controls={<><Toggle title="Chrome" label="Inactive" value={inactive} onChange={setInactive} /><Toggle title="Chrome" label="Disabled" value={disabled} onChange={setDisabled} /><span>{last}</span></>}>
    <PixelScale scale={scale} width={280} height={60}><div style={{ position: 'relative', width: 280, height: 60 }}><WindowChrome title="My Computer" width={280} active={!inactive} disabled={disabled} maximized={maximized}
      onCaption={kind => { setLast(kind); if (kind === 'maximize' || kind === 'restore') setMaximized(!maximized) }} /></div></PixelScale>
  </Demo>
}
export function CaptionButtonStory({ scale }: StoryProps) {
  const [kind, setKind] = useState<CaptionKind>('close'), [disabled, setDisabled] = useState(false), [count, setCount] = useState(0)
  return <Demo title="Caption control" controls={<><label>Glyph <select value={kind} onChange={event => setKind(event.target.value as CaptionKind)}>{['minimize', 'maximize', 'restore', 'close'].map(value => <option key={value}>{value}</option>)}</select></label><Toggle title="Caption" label="Disabled" value={disabled} onChange={setDisabled} /><span>{count} activations</span></>}>
    <PixelScale scale={scale} width={36} height={34}><div style={{ padding: 10, background: '#000080', height: 34 }}><CaptionButton kind={kind} aria-label={`${kind} example`} disabled={disabled} onClick={() => setCount(count + 1)} /></div></PixelScale>
  </Demo>
}
export function DialogStory({ scale }: StoryProps) {
  const trigger = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false), [name, setName] = useState('Untitled'), [last, setLast] = useState('No result')
  return <Demo title="Modal dialog with focus return" controls={<span aria-live="polite">{last}. Open, Tab between fields and actions, or press Escape.</span>}>
    <PixelScale scale={scale} width={310} height={210}><div style={{ position: 'relative', width: 310, height: 210 }}>
      <div inert={open}><Button ref={trigger} width={90} onClick={() => setOpen(true)}>Open dialog</Button></div>
      {open && <Dialog restoreFocus={() => trigger.current} title="Save document" width={300} height={160} style={{ position: 'absolute', top: 36, left: 0 }} onClose={() => { setLast('Cancelled'); setOpen(false) }}
        actions={<><Button defaultButton data-dialog-default="" onClick={() => { setLast(`Saved ${name}`); setOpen(false) }}>OK</Button><Button onClick={() => { setLast('Cancelled'); setOpen(false) }}>Cancel</Button></>}>
        <label htmlFor="catalog-document-name" style={{ position: 'absolute', left: 16, top: 39 }}>File name:</label>
        <TextInput id="catalog-document-name" aria-label="Document name" width={260} value={name} style={{ position: 'absolute', left: 16, top: 59 }} onChange={event => setName(event.target.value)} />
      </Dialog>}
    </div></PixelScale>
  </Demo>
}
export function StatusBarStory({ scale }: StoryProps) {
  const [grip, setGrip] = useState(true)
  return <Demo title="Multiple status fields" controls={<Toggle title="Status bar" label="Size grip" value={grip} onChange={setGrip} />}>
    <PixelScale scale={scale} width={280} height={18}><StatusBar fields={[{ id: 'items', content: '20 object(s)' }, { id: 'size', content: '2.75 MB', width: 90 }]} grip={grip} /></PixelScale>
  </Demo>
}
export function StatusFieldStory({ scale }: StoryProps) {
  const [application, setApplication] = useState(false)
  return <Demo title="Recessed status field" controls={<Toggle title="Status field" label="Application border" value={application} onChange={setApplication} />}>
    <PixelScale scale={scale} width={180} height={18}><StatusField variant={application ? 'application' : 'standard'} style={{ height: 18 }}>Ready</StatusField></PixelScale>
  </Demo>
}
export function SizeGripStory({ scale }: StoryProps) {
  return <PixelScale scale={scale} width={36} height={30}><div style={{ position: 'relative', width: 36, height: 30, background: '#c0c0c0' }}><SizeGrip /></div></PixelScale>
}
export function WindowTrackingStory({ scale }: StoryProps) {
  const [visible, setVisible] = useState(true)
  return <Demo title="Move / resize outline" controls={<Toggle title="Outline" label="Visible" value={visible} onChange={setVisible} />}>
    <PixelScale scale={scale} width={220} height={90}><div style={{ position: 'relative', width: 220, height: 90, background: '#008080' }}><WindowTracking bounds={visible ? { x: 12, y: 12, width: 196, height: 66 } : null} /></div></PixelScale>
  </Demo>
}
