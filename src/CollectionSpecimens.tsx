import { Specimen } from './Specimen'
import { ListView } from './components/ListView'
import { TreeView } from './components/TreeView'
import { ScrollArea } from './components/ScrollArea'
import { ColumnHeader } from './components/SurfaceBox'
import { Scrollbar } from './components/Scrollbar'
import { SplitPane } from './components/SplitPane'
import { Pane } from './components/Pane'

const noop = () => {}
const folders = ['Billboards', "Bobby's Stats", 'Business Unit', 'Color Samples', 'Extra Templates', 'Financial Statistics', 'Mailing Lists', 'Old Program Files', 'Quarterly Stats', 'Reviews', 'Rolling Account', 'Smith Project']
const tree = [{ id: 'computer', label: 'My Computer', icon: 'My Computer', children: [
  { id: 'floppy', label: '3½ Floppy (A:)', icon: 'Floppy drive' },
  { id: 'drive', label: "Paul's Hard Drive (C:)", icon: 'Drive', children: folders.map((label, index) => ({ id: label, label, icon: 'Folder', children: index % 3 === 1 ? [{ id: `${label}-docs`, label: 'Documents', icon: 'Folder' }] : undefined })) },
  { id: 'panel', label: 'Control Panel', icon: 'Control Panel' },
] }]
export function TreeSpecimens({ scale }: { scale: number }) {
  return [true, false].map(active => <Specimen key={String(active)} title={`Folder tree · ${active ? 'focused' : 'inactive'} selection`} scale={scale} width={250} height={276}>
    <div className="w95-list-header" style={{ width: 250, height: 21 }}>All Folders</div>
    <div id={`static-folders-${active}`} className={`w95-inset ${active ? 'w95-static-focus' : ''}`} style={{ position: 'absolute', top: 22, width: 250, height: 233 }}>
      <TreeView label="Folders" width={250} height={217} nodes={tree} expanded={['computer', 'drive']} onExpandedChange={noop} selected="drive" onSelect={noop} active={active} />
      <div style={{ position: 'absolute', top: 215, left: 2 }}><Scrollbar orientation="horizontal" scale={1} length={230} total={280} page={230} value={0} controls={`static-folders-${active}`} onChange={noop} /></div>
      <span style={{ position: 'absolute', left: 232, top: 215, width: 16, height: 16, background: '#c0c0c0' }} />
    </div>
    <div className="w95-status-field" style={{ position: 'absolute', left: 0, top: 258, width: 168, height: 18 }}>95 object(s)</div><div className="w95-status-field" style={{ position: 'absolute', left: 170, top: 258, width: 80, height: 18 }}>2.75MB</div>
  </Specimen>)
}
const entries = [['Business Unit', '', 'File Folder', '9/16/96'], ['Color Samples', '', 'File Folder', '9/16/96'], ['Readme.txt', '2KB', 'Text Document', '8/24/95'], ['Schedule.txt', '4KB', 'Text Document', '9/12/96'], ['Windows.bmp', '38KB', 'Bitmap Image', '8/24/95']]
export function ListSpecimens({ scale }: { scale: number }) {
  return <>
    <Specimen title="List box · selected row" scale={scale} width={160} height={118}><ListView label="Sounds" width={160} height={118} items={['Windows Default', 'Asterisk', 'Critical Stop', 'Exclamation', 'Question', 'Start Windows', 'Exit Windows'].map(label => ({ label }))} selected={2} onSelect={noop} /></Specimen>
    <Specimen title="List view · small icons" scale={scale} width={272} height={118}><ListView label="Small icons" width={272} height={118} layout="columns" columnWidth={140} rowHeight={18} items={folders.slice(0, 10).map(label => ({ label, icon: 'Folder' }))} selected={2} onSelect={noop} /></Specimen>
    <Specimen title="Details view · column headers" scale={scale} width={366} height={153}>
      <div className="w95-inset" style={{ width: 366, height: 153, padding: 2 }}><ScrollArea label="File details" width={362} height={149} contentWidth={393} contentHeight={133} horizontal vertical>
        <table className="w95-details-table"><colgroup>{[151, 52, 90, 100].map((width, i) => <col key={i} style={{ width }} />)}</colgroup><thead><tr>{['Name', 'Size', 'Type', 'Modified'].map(label => <th key={label}><ColumnHeader style={{ width: '100%' }}>{label}</ColumnHeader></th>)}</tr></thead>
          <tbody>{entries.map((entry, index) => <tr key={entry[0]}>{entry.map((cell, col) => <td key={col}>{col === 0 ? <><img src={`/icons/${index < 2 ? 2 : 13}-16.png`} alt="" width={16} height={16} /><span style={{ background: index === 2 ? '#000080' : undefined, color: index === 2 ? '#fff' : undefined }}>{cell}</span></> : cell}</td>)}</tr>)}</tbody>
        </table>
      </ScrollArea></div>
    </Specimen>
  </>
}
export function FileSpecimens({ scale }: { scale: number }) {
  const directories = [{ label: 'c:\\', icon: 'Directory open' }, { label: 'excel', icon: 'Directory open', indent: 1 }, ...['examples', 'excelcbt', 'library', 'setup'].map(label => ({ label, icon: 'Folder', indent: 2 }))]
  return <>{[false, true].map(selected => <Specimen key={String(selected)} title={selected ? 'File list · selected row' : 'File list · plain text'} scale={scale} width={140} height={112}><ListView label="Files" width={140} height={112} items={['filelist.txt', 'network.txt'].map(label => ({ label }))} selected={selected ? 0 : -1} onSelect={noop} /></Specimen>)}
    {[true, false].map(active => <Specimen key={String(active)} title={`Directories · ${active ? 'current folder' : 'inactive selection'}`} scale={scale} width={150} height={112}><ListView label="Directories" width={150} height={112} items={directories} selected={1} active={active} onSelect={noop} /></Specimen>)}</>
}
export function SectionSpecimens({ scale }: { scale: number }) {
  return <><Specimen title="Pane heading" scale={scale} width={220} height={21}><div className="w95-list-header" style={{ height: 21 }}>All Folders</div></Specimen>
    <Specimen title="Column header · normal / pressed" scale={scale} width={200} height={20}><div style={{ display: 'flex' }}><ColumnHeader style={{ width: 100 }}>Name</ColumnHeader><ColumnHeader className="w95-header-pressed" style={{ width: 100 }}>Name</ColumnHeader></div></Specimen>
    <Specimen title="Tree expanders · collapsed / expanded" scale={scale} width={49} height={25} background="#fff">{[false, true].map(expanded => <span key={String(expanded)} className="w95-tree-expander" data-expanded={expanded} style={{ left: expanded ? 32 : 8, top: 8 }} />)}</Specimen>
    <Specimen title="Split panes · recessed borders" scale={scale} width={220} height={80}><SplitPane width={220} height={80} first={<Pane title="All Folders" />} second={<Pane title="Contents" />} /></Specimen></>
}
export function ScrollbarSpecimens({ scale }: { scale: number }) {
  return <>{[false, true].map(vertical => <Specimen key={String(vertical)} title={`${vertical ? 'Vertical' : 'Horizontal'} · normal / pressed / unavailable`} scale={scale} width={vertical ? 64 : 200} height={vertical ? 200 : 64}>
    <span id={`scrollbar-specimen-${vertical}`} hidden />{[0, 1, 2].map(index => <div key={index} className={index === 1 ? 'w95-scroll-specimen-pressed' : ''} style={{ position: 'absolute', left: vertical ? index * 24 : 0, top: vertical ? 0 : index * 24 }}><Scrollbar orientation={vertical ? 'vertical' : 'horizontal'} scale={1} length={200} total={600} page={200} value={index === 1 ? 200 : 80} disabled={index === 2} controls={`scrollbar-specimen-${vertical}`} onChange={noop} /></div>)}
  </Specimen>)}</>
}
