import { TextArea } from '../components/TextArea'
import { useState } from 'react'
import { Demo, Toggle } from '../InteractiveDemo'
import { ButtonSpecimen } from '../components/Button'
import { ColorSwatch } from '../components/ColorSwatch'
import { ColumnHeader } from '../components/SurfaceBox'
import { ListView } from '../components/ListView'
import { SplitPane } from '../components/SplitPane'
import { Pane } from '../components/Pane'
import { NativeText } from '../components/NativeText'
import { PixelScale } from '../components/PixelScale'
import { ScrollbarDemo } from '../InteractiveCollections'
import type { ButtonState } from '../theme'
import type { StoryProps } from './entries'

export function ButtonSpecimenStory({ scale }: StoryProps) {
  const [state, setState] = useState<ButtonState>('normal')
  return <Demo title="Static state preview" controls={<label>State <select value={state} onChange={event => setState(event.target.value as ButtonState)}>{['normal', 'focused', 'pressed', 'preferred', 'disabled'].map(state => <option key={state}>{state}</option>)}</select></label>}>
    <PixelScale scale={scale} width={75} height={23}><ButtonSpecimen state={state}>Button</ButtonSpecimen></PixelScale>
  </Demo>
}
export function ColorSwatchStory({ scale }: StoryProps) {
  const [selected, setSelected] = useState(false), [disabled, setDisabled] = useState(false)
  return <Demo title="Color selection" controls={<Toggle title="Color swatch" label="Disabled" value={disabled} onChange={setDisabled} />}>
    <PixelScale scale={scale} width={40} height={30}><ColorSwatch color="#008080" aria-label="Teal" selected={selected} disabled={disabled} onClick={() => setSelected(!selected)} /></PixelScale>
  </Demo>
}
export function ColumnHeaderStory({ scale }: StoryProps) {
  const [disabled, setDisabled] = useState(false), [descending, setDescending] = useState(false)
  return <Demo title="Sortable header" controls={<><Toggle title="Column header" label="Disabled" value={disabled} onChange={setDisabled} /><span>{descending ? 'Descending' : 'Ascending'}</span></>}>
    <PixelScale scale={scale} width={140} height={20}><ColumnHeader disabled={disabled} style={{ width: 140 }} onClick={() => setDescending(!descending)}>Name</ColumnHeader></PixelScale>
  </Demo>
}
export function ListViewStory({ scale }: StoryProps) {
  const [layout, setLayout] = useState<'list' | 'small-icons' | 'details' | 'columns'>('list')
  const [selected, setSelected] = useState(-1), [disabled, setDisabled] = useState(false), [inactive, setInactive] = useState(false), [descending, setDescending] = useState(false)
  const [opened, setOpened] = useState('')
  const items = ['Documents', 'Music', 'Pictures', 'Programs', 'Projects', 'Settings', 'Templates', 'Work'].sort((a, b) => a.localeCompare(b) * (descending ? -1 : 1)).map(label => ({ label, icon: layout === 'list' ? undefined : 'Folder', detail: 'File Folder' }))
  return <Demo title="List, icons, details, and file columns" controls={<><label>Layout <select value={layout} onChange={event => { setLayout(event.target.value as typeof layout); setSelected(-1) }}>{['list', 'small-icons', 'details', 'columns'].map(value => <option key={value}>{value}</option>)}</select></label><Toggle title="List view" label="Disabled" value={disabled} onChange={setDisabled} /><Toggle title="List view" label="Inactive" value={inactive} onChange={setInactive} /><span aria-live="polite">{opened ? `Opened ${opened}` : 'Select with mouse or keyboard. Double-click to open.'}</span></>}>
    <PixelScale scale={scale} width={260} height={132}><ListView label="Example files" layout={layout} items={items} selected={selected} onSelect={setSelected} onActivate={index => setOpened(items[index].label)} disabled={disabled} active={!inactive} columnWidth={130} descending={descending} onSort={() => { setDescending(!descending); setSelected(-1) }} /></PixelScale>
  </Demo>
}
export function SplitPaneStory({ scale }: StoryProps) {
  const [disabled, setDisabled] = useState(false), [split, setSplit] = useState(120)
  return <Demo title="Resizable panes" controls={<><Toggle title="Split pane" label="Disabled" value={disabled} onChange={setDisabled} /><span>Divider: {split} px. Drag or use arrow keys.</span></>}>
    <PixelScale scale={scale} width={280} height={100}><SplitPane split={split} onSplitChange={setSplit} disabled={disabled}
      first={<Pane title="Folders"><NativeText>Documents</NativeText></Pane>} second={<Pane title="Contents"><NativeText>Readme.txt</NativeText></Pane>} /></PixelScale>
  </Demo>
}
export function PaneStory({ scale }: StoryProps) {
  return <PixelScale scale={scale} width={180} height={80}><Pane title="All Folders"><NativeText style={{ margin: 6 }}>Documents</NativeText></Pane></PixelScale>
}
export function ScrollbarStory({ scale }: StoryProps) {
  const [vertical, setVertical] = useState(false)
  return <><label className="catalog-variant"><input type="checkbox" checked={vertical} onChange={event => setVertical(event.target.checked)} /> Vertical</label><ScrollbarDemo scale={scale} vertical={vertical} /></>
}

export function TextAreaStory({ scale }: StoryProps) {
  const [value, setValue] = useState('A message with\nmore than one line.'), [disabled, setDisabled] = useState(false)
  return <Demo title="Multiline text" controls={<Toggle title="Text area" label="Disabled" value={disabled} onChange={setDisabled} />}>
    <PixelScale scale={scale} width={280} height={70}><TextArea aria-label="Multiline text" width={280} height={70} value={value} disabled={disabled} onChange={event => setValue(event.target.value)} /></PixelScale>
  </Demo>
}
