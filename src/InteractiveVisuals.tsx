import { SplitPane } from './components/SplitPane'
import { Pane } from './components/Pane'
import { Label } from './components/Label'
import { Icon } from './components/Icon'
import { useState } from 'react'
import { Demo, Toggle } from './InteractiveDemo'
import { PixelScale } from './components/PixelScale'
import { NativeText } from './components/NativeText'
import { SurfaceBox, ColumnHeader } from './components/SurfaceBox'
import type { SurfaceKind } from './components/SurfaceBox'
import { kitIconNames } from './icons'
import { fontChoices, getBitmapFont } from './bitmapFont'

export function TypographyDemo({ scale }: { scale: number }) {
  const [choice, setChoice] = useState(0), [text, setText] = useState('The quick brown fox. 0123456789')
  const selected = fontChoices[choice], native = getBitmapFont(selected.font)
  return <Demo title="Typography" controls={<><label>Text <input aria-label="Typography text" value={text} onChange={event => setText(event.target.value)} /></label><label>Font <select aria-label="Typography font" value={choice} onChange={event => setChoice(Number(event.target.value))}>{fontChoices.map((item, index) => <option key={item.label} value={index}>{item.label}</option>)}</select></label><span>{native.height} px cell · {native.source}</span></>}>
    <PixelScale scale={scale} width={300} height={60}><div style={{ width: 300, height: 60, padding: 8, overflow: 'hidden', background: '#fff' }}><NativeText font={selected.font}>{text}</NativeText></div></PixelScale>
  </Demo>
}
export function LabelDemo({ scale }: { scale: number }) {
  const [icon, setIcon] = useState(false), [white, setWhite] = useState(false), [text, setText] = useState('Label')
  return <Demo title="Label" controls={<><label>Text <input aria-label="Label text" value={text} onChange={event => setText(event.target.value)} /></label><Toggle title="Label" label="Icon" value={icon} onChange={setIcon} /><Toggle title="Label" label="White text" value={white} onChange={setWhite} /></>}>
    <PixelScale scale={scale} width={160} height={40}><div style={{ position: 'relative', width: 160, height: 40, background: '#c0c0c0' }}><Label icon={icon ? 'Folder' : undefined} color={white ? '#fff' : '#000'} style={{ position: 'absolute', left: 8, top: 12 }}>{text}</Label></div></PixelScale>
  </Demo>
}
export function IconDemo({ scale }: { scale: number }) {
  const [name, setName] = useState<string>('My Computer'), [small, setSmall] = useState(false)
  return <Demo title="Icon" controls={<><label>Icon <select aria-label="Icon name" value={name} onChange={event => setName(event.target.value)}>{kitIconNames.map(name => <option key={name}>{name}</option>)}</select></label><Toggle title="Icon" label="Small (16 px)" value={small} onChange={setSmall} /></>}>
    <PixelScale scale={scale} width={48} height={48}><div style={{ width: 48, height: 48, padding: small ? 16 : 8, background: '#c0c0c0' }}><Icon name={name as typeof kitIconNames[number]} size={small ? 16 : 32} alt={name} style={{ display: 'block' }} /></div></PixelScale>
  </Demo>
}
export function SurfaceDemo({ scale }: { scale: number }) {
  const [kind, setKind] = useState<SurfaceKind>('Raised')
  return <Demo title="Border / surface" controls={<label>Style <select value={kind} onChange={event => setKind(event.target.value as SurfaceKind)}>{['Raised', 'Sunken', 'Window', 'Status'].map(value => <option key={value}>{value}</option>)}</select></label>}>
    <PixelScale scale={scale} width={160} height={60}><SurfaceBox kind={kind} style={{ position: 'relative', width: 160, height: 60, '--inset-face': '#c0c0c0' } as React.CSSProperties}><NativeText style={{ position: 'absolute', left: 12, top: 22 }}>{kind}</NativeText></SurfaceBox></PixelScale>
  </Demo>
}
export function SectionsDemo({ scale }: { scale: number }) {
  const [disabled, setDisabled] = useState(false), [sorted, setSorted] = useState(false)
  return <><Demo title="Column header" controls={<><Toggle title="Column header" label="Disabled" value={disabled} onChange={setDisabled} /><span>{sorted ? 'Descending' : 'Ascending'}</span></>}><PixelScale scale={scale} width={140} height={20}><ColumnHeader aria-label="Sort column" disabled={disabled} style={{ width: 140 }} onClick={() => setSorted(!sorted)}>Name {sorted ? '-' : '+'}</ColumnHeader></PixelScale></Demo>
    <Demo title="Split panes" controls={<span>Drag the divider, or focus it and use arrow keys.</span>}><PixelScale scale={scale} width={280} height={100}><SplitPane first={<Pane title="All Folders" />} second={<Pane title="Contents" />} /></PixelScale></Demo></>
}
