import { useEffect, useRef, useState } from 'react'
import { Demo, Toggle } from '../InteractiveDemo'
import { PixelScale } from '../components/PixelScale'
import { Menu, MenuItem, MenuSeparator } from '../components/Menu'
import { MenuBar } from '../components/MenuBar'
import { Toolbar, ToolbarButton } from '../components/Toolbar'
import type { StoryProps } from './entries'

export function MenuStory({ scale }: StoryProps) {
  const [disabled, setDisabled] = useState(false), [last, setLast] = useState('No command selected')
  return <Demo title="Keyboard and pointer menu" controls={<><Toggle title="Menu" label="Disable Save" value={disabled} onChange={setDisabled} /><span aria-live="polite">{last}</span></>}>
    <PixelScale scale={scale} width={190} height={90}><Menu aria-label="Example commands" onDismiss={() => setLast('Dismissed')}>
      <MenuItem onClick={() => setLast('New')} shortcut="Ctrl+N">New</MenuItem>
      <MenuItem disabled={disabled} onClick={() => setLast('Save')} shortcut="Ctrl+S">Save</MenuItem>
      <MenuSeparator /><MenuItem onClick={() => setLast('Exit')}>Exit</MenuItem>
    </Menu></PixelScale>
  </Demo>
}
export function MenuItemStory({ scale }: StoryProps) {
  const [disabled, setDisabled] = useState(false), [clicks, setClicks] = useState(0)
  return <Demo title="Menu command" controls={<><Toggle title="Menu item" label="Disabled" value={disabled} onChange={setDisabled} /><span>{clicks} activations</span></>}>
    <PixelScale scale={scale} width={180} height={26}><Menu aria-label="Single command"><MenuItem disabled={disabled} onClick={() => setClicks(clicks + 1)} shortcut="Ctrl+O">Open</MenuItem></Menu></PixelScale>
  </Demo>
}
export function MenuSeparatorStory({ scale }: StoryProps) {
  return <PixelScale scale={scale} width={160} height={18}><Menu aria-label="Separator example"><MenuSeparator /></Menu></PixelScale>
}
export function MenuBarStory({ scale }: StoryProps) {
  const [selected, setSelected] = useState<string | null>(null), [last, setLast] = useState('Open a menu or use the keyboard')
  const bar = useRef<HTMLDivElement>(null), popup = useRef<HTMLDivElement>(null), keyboard = useRef(false)
  const labels = ['File', 'Edit', 'Help']
  useEffect(() => { if (selected) (keyboard.current ? popup.current?.querySelector('button') : popup.current)?.focus() }, [selected])
  const dismiss = () => { setSelected(null); bar.current?.querySelector<HTMLButtonElement>(`[data-menu-label="${selected}"]`)?.focus() }
  return <Demo title="Menu bar with popup" controls={<span aria-live="polite">{last}</span>}>
    <PixelScale scale={scale} width={260} height={100}><div style={{ width: 260, height: 100, position: 'relative' }}>
      <MenuBar ref={bar} aria-label="Example menu bar" selected={selected} items={labels.map(label => ({ label, style: { width: 45, height: 18 } }))} style={{ background: '#c0c0c0' }}
        onOpen={(label, fromKeyboard) => { keyboard.current = fromKeyboard; setSelected(selected === label ? null : label) }} onDismiss={dismiss} />
      {selected && <Menu ref={popup} aria-label={`${selected} commands`} style={{ position: 'absolute', top: 18, left: labels.indexOf(selected) * 45, width: 165 }} onDismiss={dismiss}
        onNavigate={direction => { keyboard.current = true; setSelected(labels[(labels.indexOf(selected) + direction + labels.length) % labels.length]) }}>
        {(selected === 'File' ? ['New', 'Open', 'Save'] : selected === 'Edit' ? ['Cut', 'Copy', 'Paste'] : ['About Windows']).map(label => <MenuItem key={label} onClick={() => { setLast(label); dismiss() }}>{label}</MenuItem>)}
      </Menu>}
    </div></PixelScale>
  </Demo>
}
export function ToolbarStory({ scale, single = false }: StoryProps & { single?: boolean }) {
  const [disabled, setDisabled] = useState(false), [last, setLast] = useState('Ready')
  return <Demo title={single ? 'Toolbar button' : 'Browser toolbar'} controls={<><Toggle title="Toolbar" label="Disabled" value={disabled} onChange={setDisabled} /><span>{last}</span></>}>
    <PixelScale scale={scale} width={single ? 49 : 150} height={39}><Toolbar aria-label="Example toolbar" style={{ background: '#c0c0c0' }}>{(single ? ['Home'] : ['Back', 'Forward', 'Home']).map((label, index) => <ToolbarButton key={label} icon={`/apps/tool-${single || index === 2 ? 4 : index}${!single && index < 2 ? '-enabled' : ''}.png`} disabled={disabled} onClick={() => setLast(label)}>{label}</ToolbarButton>)}</Toolbar></PixelScale>
  </Demo>
}
