import { ListView } from './components/ListView'
import { PixelScale } from './components/PixelScale'
import { TreeView } from './components/TreeView'
import { useId, useState } from 'react'
import { Demo, Toggle } from './InteractiveDemo'
import { FileListPreview } from './FileListPreview'
import { Scrollbar } from './components/Scrollbar'

export function CollectionDemo({ scale, kind }: { scale: number; kind: 'tree' | 'list' | 'directory' | 'details' | 'small-icons' }) {
  return kind === 'tree' ? <TreeDemo scale={scale} /> : <NativeCollectionDemo scale={scale} kind={kind} />
}

function NativeCollectionDemo({ scale, kind }: { scale: number; kind: 'list' | 'directory' | 'details' | 'small-icons' }) {
  const title = { list: 'List box', directory: 'Directory list', details: 'Details view', 'small-icons': 'Small-icon list' }[kind]
  const [disabled, setDisabled] = useState(false)
  const [active, setActive] = useState(true)
  const [selected, setSelected] = useState('Documents')
  const [directory, setDirectory] = useState('c:\\')
  const [descending, setDescending] = useState(false)
  const items = kind === 'directory'
    ? [{ label: '..', icon: 'Directory open' }, { label: directory, icon: 'Directory open', indent: 1 }, ...folders.map(label => ({ label, icon: 'Folder', indent: 2 }))]
    : (kind === 'details' ? [...folders].sort((a, b) => a.localeCompare(b) * (descending ? -1 : 1)) : folders).map(label => ({ label, icon: kind === 'list' ? undefined : 'Folder', detail: 'File Folder' }))
  const height = kind === 'details' ? 152 : 132
  return <Demo title={title} controls={<><Toggle title={title} label="Disabled" value={disabled} onChange={setDisabled} /><Toggle title={title} label="Inactive" value={!active} onChange={value => setActive(!value)} /><span>{kind === 'directory' ? 'Double-click a folder to enter it.' : kind === 'details' ? 'Click Name to sort.' : 'Click, use arrow keys, or type a name.'}</span></>}>
    <PixelScale scale={scale} width={260} height={height}>
      <ListView label={title} items={items} selected={items.findIndex(item => item.label === selected)} onSelect={index => setSelected(items[index].label)}
        layout={kind === 'directory' ? 'list' : kind} height={height} disabled={disabled} active={active} descending={descending} onSort={() => setDescending(!descending)}
        onActivate={index => {
          if (kind !== 'directory' || items[index].label === directory) return
          const label = items[index].label
          const parts = directory.replace(/\\$/, '').split('\\')
          const parent = parts.length > 1 ? parts.slice(0, -1).join('\\') : 'c:'
          const next = label === '..' ? `${parent}\\` : `${directory.replace(/\\$/, '')}\\${label}`
          setDirectory(next); setSelected(next)
        }} />
    </PixelScale>
  </Demo>
}

const folders = ['Documents', 'Programs', 'Settings', 'Pictures', 'Music', 'Projects', 'Templates', 'Work']
function TreeDemo({ scale }: { scale: number }) {
  const [disabled, setDisabled] = useState(false)
  const [active, setActive] = useState(true)
  const [selected, setSelected] = useState('Documents')
  const [expanded, setExpanded] = useState(['computer', 'drive'])
  const nodes = [{ id: 'computer', label: 'My Computer', icon: 'My Computer', children: [{ id: 'drive', label: 'C:\\', icon: 'Drive', children: folders.map(label => ({ id: label, label, icon: 'Folder', children: [{ id: `${label}-files`, label: `${label} files`, icon: 'Windows document' }] })) }] }]
  return <Demo title="Folder tree" controls={<><Toggle title="Folder tree" label="Disabled" value={disabled} onChange={setDisabled} /><Toggle title="Folder tree" label="Inactive" value={!active} onChange={value => setActive(!value)} /><span>Click +/−, double-click, or use the arrow keys.</span></>}>
    <PixelScale scale={scale} width={260} height={132}><TreeView label="Folder tree" nodes={nodes} selected={selected} onSelect={setSelected} expanded={expanded} onExpandedChange={setExpanded} disabled={disabled} active={active} /></PixelScale>
  </Demo>
}

export function FileDialogDemo({ scale }: { scale: number }) {
  const [disabled, setDisabled] = useState(false)
  return <Demo title="Column file list" controls={<Toggle title="Column file list" label="Disabled" value={disabled} onChange={setDisabled} />}><div className="embedded-file-list"><FileListPreview scale={scale} disabled={disabled} /></div></Demo>
}

export function ScrollbarDemo({ scale, vertical = false }: { scale: number; vertical?: boolean }) {
  const title = vertical ? 'Vertical scrollbar' : 'Horizontal scrollbar'
  const [disabled, setDisabled] = useState(false)
  const [value, setValue] = useState(0)
  const id = useId()
  return <Demo title={title} controls={<><Toggle title={title} label="Disabled" value={disabled} onChange={setDisabled} /><output id={id}>Position: {value} / 200</output></>}><Scrollbar orientation={vertical ? 'vertical' : 'horizontal'} length={160} total={300} page={100} value={value} scale={scale} controls={id} onChange={setValue} disabled={disabled} /></Demo>
}
