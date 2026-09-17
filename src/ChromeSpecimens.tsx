import { CaptionButton } from './components/CaptionButton'
import { PixelScale } from './components/PixelScale'
import { TitleBar, WindowFrame } from './components/WindowChrome'
import { captionRects } from './theme'
import type { CaptionKind } from './theme'

export function CaptionSpecimens({ scale }: { scale: number }) {
  return <>{(['minimize', 'maximize', 'restore', 'close'] as CaptionKind[]).map(kind => <article className="sample-card" key={kind}>
    <h3>{kind[0].toUpperCase() + kind.slice(1)}</h3><div className="sample-stage"><PixelScale scale={scale} width={64} height={34}>
      <div inert style={{ width: 64, height: 34, background: '#000080', position: 'relative' }}>{[false, true].map(pressed => <CaptionButton key={String(pressed)} kind={kind} className={pressed ? 'w95-caption-forced-pressed' : ''} style={{ position: 'absolute', left: pressed ? 38 : 10, top: 10 }} />)}</div>
    </PixelScale></div>
  </article>)}{(['minimize', 'maximize', 'close'] as CaptionKind[]).map(kind => <article className="sample-card" key={`disabled-${kind}`}>
    <h3>Disabled {kind}</h3><div className="sample-stage"><PixelScale scale={scale} width={40} height={40}>
      <div inert style={{ width: 40, height: 40, background: '#c0c0c0', position: 'relative' }}><CaptionButton kind={kind} disabled style={{ position: 'absolute', left: 12, top: 12 }} /></div>
    </PixelScale></div>
  </article>)}</>
}
export function TitleSpecimens({ scale }: { scale: number }) {
  const captions = captionRects({ x: 0, y: 0, width: 244, height: 44 })
  return [true, false].map(active => <article className="sample-card" key={String(active)}><h3>{active ? 'Active window' : 'Inactive window'}</h3><div className="sample-stage"><PixelScale scale={scale} width={260} height={60}>
    <div inert style={{ width: 260, height: 60, background: '#008080', position: 'relative' }}>
      <WindowFrame style={{ position: 'absolute', left: 8, top: 8, width: 244, height: 44 }}>
        <TitleBar title="Welcome to Windows 95" active={active} style={{ position: 'absolute', left: 3, top: 3, width: 238, paddingRight: 56 }} />
        {(['minimize', 'maximize', 'close'] as const).map(kind => <CaptionButton key={kind} kind={kind} style={{ position: 'absolute', left: captions[kind].x, top: captions[kind].y }} />)}
      </WindowFrame>
    </div>
  </PixelScale></div></article>)
}
