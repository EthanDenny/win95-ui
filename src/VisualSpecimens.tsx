import { Specimen } from './Specimen'
import { NativeText } from './components/NativeText'
import { SurfaceBox } from './components/SurfaceBox'
import type { SurfaceKind } from './components/SurfaceBox'
import { WindowFrame, TitleBar } from './components/WindowChrome'
import { CaptionButton } from './components/CaptionButton'
import { TaskbarButton } from './components/TaskbarButton'
import { fontChoices, getBitmapFont } from './bitmapFont'
import { captionRects } from './theme'
import { kitIconNames } from './icons'

export function TypographySpecimens({ scale, text }: { scale: number; text: string }) {
  return fontChoices.map(choice => <Specimen key={choice.label} title={choice.label} scale={scale} width={310} height={getBitmapFont(choice.font).height + 20} background="#fff"><NativeText font={choice.font} style={{ position: 'absolute', left: 10, top: 10 }}>{text}</NativeText></Specimen>)
}
export function IconSpecimens({ scale }: { scale: number }) {
  return kitIconNames.map((name, index) => <Specimen key={name} title={name} scale={scale} width={84} height={56}>{([32, 16] as const).map(size => <img key={size} src={`/icons/${index}-${size}.png`} alt={name} width={size} height={size} style={{ position: 'absolute', left: size === 32 ? 10 : 58, top: size === 32 ? 12 : 20, imageRendering: 'pixelated' }} />)}</Specimen>)
}
export function LabelSpecimens({ scale }: { scale: number }) {
  return [false, true].flatMap(white => [false, true].map(icon => <Specimen key={`${white}-${icon}`} title={`${white ? 'White' : 'Black'} text${icon ? ' · With icon' : ''}`} scale={scale} width={80} height={icon ? 76 : 38}>{icon && <img src="/icons/2-32.png" alt="" width={32} height={32} style={{ position: 'absolute', left: 24, top: 9, imageRendering: 'pixelated' }} />}<NativeText color={white ? '#fff' : '#000'} style={{ position: 'absolute', left: 27, top: icon ? 47 : 12 }}>Label</NativeText></Specimen>))
}
export function SurfaceSpecimens({ scale }: { scale: number }) {
  return (['Raised', 'Sunken', 'Window', 'Status'] as SurfaceKind[]).map(kind => <Specimen key={kind} title={{ Raised: 'Raised border', Sunken: 'Sunken border', Window: 'Window frame', Status: 'Status bar recess' }[kind]} scale={scale} width={160} height={60}><SurfaceBox kind={kind} style={{ width: 160, height: 60, '--inset-face': '#c0c0c0' } as React.CSSProperties} /></Specimen>)
}
export function WindowSpecimens({ scale }: { scale: number }) {
  const captions = captionRects({ x: 0, y: 0, width: 244, height: 144 })
  return [false, true].flatMap(filled => [true, false].map(icon => <Specimen key={`${filled}-${icon}`} title={`${filled ? 'Icon view' : 'Empty window'} · ${icon ? 'With icon' : 'Without icon'}`} scale={scale} width={260} height={filled ? 160 : 100}>
    <WindowFrame style={{ position: 'absolute', left: 8, top: 8, width: 244, height: filled ? 144 : 84 }}>
      <TitleBar title="Title" icon={icon ? '/icons/2-16.png' : undefined} style={{ position: 'absolute', left: 3, top: 3, width: 238 }} />
      {(['minimize', 'maximize', 'close'] as const).map(kind => <CaptionButton key={kind} kind={kind} style={{ position: 'absolute', left: captions[kind].x, top: captions[kind].y }} />)}
      {filled && <div className="w95-inset" style={{ position: 'absolute', left: 4, top: 24, width: 236, height: 94 }}>{[13, 14, 1, 4, 15, 23, 19, 21].map((icon, index) => <div key={index} style={{ position: 'absolute', left: 12 + index % 4 * 56, top: 6 + Math.floor(index / 4) * 42, width: 42, height: 38 }}><img src={`/icons/${icon}-16.png`} alt="" width={16} height={16} style={{ position: 'absolute', left: 5, imageRendering: 'pixelated' }} /><span style={{ position: 'absolute', top: 18 }}>Label</span></div>)}</div>}
      <div className="w95-status-field" style={{ position: 'absolute', left: 4, right: 4, bottom: 4, height: 17 }}>0 object(s)</div>
    </WindowFrame>
  </Specimen>))
}
export function TaskbarSpecimens({ scale }: { scale: number }) {
  return <><Specimen title="Start flag" scale={scale} width={40} height={38}><img src="/icons/start-flag.png" alt="Windows" style={{ position: 'absolute', left: 12, top: 12, imageRendering: 'pixelated' }} /></Specimen>
    {[false, true].map(selected => <Specimen key={`start-${selected}`} title={`Start button${selected ? ' · pressed' : ''}`} scale={scale} width={54} height={22}><TaskbarButton start icon="/icons/start-flag.png" selected={selected}>Start</TaskbarButton></Specimen>)}
    {[false, true].map(selected => <Specimen key={`task-${selected}`} title={selected ? 'Selected window button' : 'Window button'} scale={scale} width={144} height={44}><TaskbarButton icon="/icons/2-16.png" selected={selected} style={{ position: 'absolute', left: 12, top: 10, width: 120, height: 24 }}>Label</TaskbarButton></Specimen>)}
    <Specimen title="Taskbar" scale={scale} width={640} height={32}><div style={{ position: 'absolute', top: 0, width: 640, height: 1, background: '#fff' }} /><TaskbarButton start icon="/icons/start-flag.png" style={{ position: 'absolute', left: 2, top: 5 }}>Start</TaskbarButton>{[0, 1, 2].map(i => <TaskbarButton key={i} icon="/icons/2-16.png" selected={i === 0} style={{ position: 'absolute', left: 60 + i * 124, top: 4, width: 120, height: 24 }}>Label</TaskbarButton>)}<div className="w95-status-field" style={{ position: 'absolute', left: 553, top: 4, width: 83, height: 24 }}><img src="/icons/2-16.png" alt="" width={16} height={16} style={{ position: 'absolute', left: 5, top: 4, imageRendering: 'pixelated' }} /><span style={{ position: 'absolute', left: 25, top: 5 }}>10:36 PM</span></div></Specimen>
  </>
}
