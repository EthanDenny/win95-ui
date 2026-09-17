import { useState } from 'react'
import { Demo, Toggle } from '../InteractiveDemo'
import { PixelScale } from '../components/PixelScale'
import { Taskbar } from '../components/Taskbar'
import { TaskbarButton } from '../components/TaskbarButton'
import { StartMenu } from '../components/StartMenu'
import { IconButton } from '../components/IconButton'
import { Icon } from '../components/Icon'
import { NativeText } from '../components/NativeText'
import type { StoryProps } from './entries'

export function TaskbarButtonStory({ scale }: StoryProps) {
  const [selected, setSelected] = useState(false), [start, setStart] = useState(false), [disabled, setDisabled] = useState(false)
  return <Demo title="Task / Start button" controls={<><Toggle title="Task button" label="Start button" value={start} onChange={setStart} /><Toggle title="Task button" label="Disabled" value={disabled} onChange={setDisabled} /></>}>
    <PixelScale scale={scale} width={153} height={22}><TaskbarButton start={start} icon={start ? '/icons/start-flag.png' : '/icons/0-16.png'} disabled={disabled} selected={selected} onClick={() => setSelected(!selected)}>{start ? 'Start' : 'My Computer'}</TaskbarButton></PixelScale>
  </Demo>
}
export function TaskbarStory({ scale }: StoryProps) {
  const [selected, setSelected] = useState(true), [start, setStart] = useState(false)
  return <Demo title="Desktop taskbar" controls={<span>{start ? 'Start pressed' : selected ? 'My Computer selected' : 'My Computer minimized'}</span>}>
    <PixelScale scale={scale} width={400} height={30}><Taskbar clock="12:00 PM" start={<TaskbarButton start icon="/icons/start-flag.png" selected={start} onClick={() => setStart(!start)}>Start</TaskbarButton>}
      tasks={<TaskbarButton icon="/icons/0-16.png" selected={selected} onClick={() => setSelected(!selected)}>My Computer</TaskbarButton>} /></PixelScale>
  </Demo>
}
export function StartMenuStory({ scale }: StoryProps) {
  const [disabled, setDisabled] = useState(false), [last, setLast] = useState('Choose an application')
  return <Demo title="Start menu" controls={<><Toggle title="Start menu" label="Disable Calculator" value={disabled} onChange={setDisabled} /><span aria-live="polite">{last}</span></>}>
    <PixelScale scale={scale} width={199} height={165}><StartMenu items={[
      { id: 'calculator', label: 'Calculator', icon: '/apps/calculator-small.png', disabled },
      { id: 'panel', label: 'Control Panel', icon: '/icons/6-32.png' },
      { id: 'browser', label: 'Internet Explorer', icon: '/icons/1-32.png' },
    ]} onSelect={setLast} onDismiss={() => setLast('Dismissed')} /></PixelScale>
  </Demo>
}
export function IconButtonStory({ scale }: StoryProps) {
  const [desktop, setDesktop] = useState(false), [disabled, setDisabled] = useState(false), [selected, setSelected] = useState(false), [count, setCount] = useState(0)
  return <Demo title="Desktop / Control Panel icon" controls={<><Toggle title="Icon button" label="Desktop style" value={desktop} onChange={setDesktop} /><Toggle title="Icon button" label="Disabled" value={disabled} onChange={setDisabled} /><span>{count} opens. Double-click to open.</span></>}>
    <PixelScale scale={scale} width={90} height={84}><div style={{ padding: 8, background: desktop ? '#008080' : '#fff' }}><IconButton icon="/icons/6-32.png" variant={desktop ? 'desktop' : 'panel'} selected={selected} disabled={disabled} onClick={() => setSelected(!selected)} onDoubleClick={() => setCount(count + 1)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); setCount(count + 1) } }}>Control Panel</IconButton></div></PixelScale>
  </Demo>
}
export function PixelScaleStory({ scale }: StoryProps) {
  return <PixelScale scale={scale} width={220} height={40}><div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8 }}><Icon name="Folder" /><NativeText>2 screen pixels per source pixel</NativeText></div></PixelScale>
}
