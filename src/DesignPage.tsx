import { useFixedPixelScale } from './useFixedPixelScale'
import { lazy, Suspense, useState } from 'react'
import { CaptionSpecimens, TitleSpecimens } from './ChromeSpecimens'
import { ChoiceSpecimens, TextInputSpecimens, DropdownSpecimens, NumberSpecimens, SpinnerSpecimens } from './FormSpecimens'
import { TreeSpecimens, ListSpecimens, FileSpecimens, SectionSpecimens, ScrollbarSpecimens } from './CollectionSpecimens'
import { TypographySpecimens, IconSpecimens, LabelSpecimens, SurfaceSpecimens, WindowSpecimens, TaskbarSpecimens } from './VisualSpecimens'
import { PixelScale } from './components/PixelScale'
import { Button, ButtonSpecimen } from './components/Button'
import { LiveScrollPane } from './LiveScrollPane'
import { FileListPreview } from './FileListPreview'
import { palette } from './theme'
import { useWin95Cursors } from './useWin95Cursors'
import './DesignPage.css'
const InteractiveGallery = lazy(() => import('./InteractiveGallery').then(module => ({ default: module.InteractiveGallery })))

function LiveButton({ scale }: { scale: number }) {
  const [clicks, setClicks] = useState(0)
  return <article className="sample-card"><h3>Interactive</h3><div className="sample-stage"><PixelScale scale={scale} width={75} height={23}><Button aria-label="Try the Windows 95 button" onClick={() => setClicks(value => value + 1)}>Button</Button></PixelScale></div><div className="sample-caption"><span aria-live="polite">{clicks ? `${clicks} clicks` : 'Click, hold, or focus with Tab'}</span></div></article>
}
function DesignPage() {
  const [interactive, setInteractive] = useState(() => localStorage.getItem('design-interactive') === 'true')
  const [sampleText, setSampleText] = useState('The quick brown fox. 0123456789')
  const scale = useFixedPixelScale()
  useWin95Cursors(scale)
  const groups = [
    { id: 'checkboxes', title: 'Checkboxes', content: <ChoiceSpecimens scale={scale} /> },
    { id: 'radios', title: 'Radio buttons', content: <ChoiceSpecimens scale={scale} radio /> },
    { id: 'inputs', title: 'Input fields', content: <><TextInputSpecimens scale={scale} /><DropdownSpecimens scale={scale} /></> },
    { id: 'dropdowns', title: 'Dropdown buttons', content: <DropdownSpecimens scale={scale} arrowOnly /> },
    { id: 'numbers', title: 'Number inputs', content: <NumberSpecimens scale={scale} /> },
    { id: 'spinners', title: 'Spinner buttons', content: <SpinnerSpecimens scale={scale} /> },
    { id: 'trees', title: 'Tree views', content: <TreeSpecimens scale={scale} /> },
    { id: 'lists', title: 'List views', content: <ListSpecimens scale={scale} /> },
    { id: 'file-lists', title: 'File dialog lists', content: <><FileSpecimens scale={scale} /><FileListPreview scale={scale} /></> },
    { id: 'sections', title: 'Sections and headers', content: <SectionSpecimens scale={scale} /> },
    { id: 'scrollbars', title: 'Scrollbars', content: <><ScrollbarSpecimens scale={scale} /><LiveScrollPane scale={scale} /></> },
    { id: 'labels', title: 'Labels', content: <LabelSpecimens scale={scale} /> },
    { id: 'windows', title: 'Windows', content: <WindowSpecimens scale={scale} /> },
    { id: 'taskbar', title: 'Taskbar', content: <TaskbarSpecimens scale={scale} /> },
    { id: 'surfaces', title: 'Surfaces', content: <SurfaceSpecimens scale={scale} /> },
    { id: 'icons', title: 'Icons', content: <IconSpecimens scale={scale} /> },
  ]
  return <main className="design-page"><header className="design-header"><h1>Components</h1><a href="/test/desktop">Desktop</a><a href="/test/components">Component catalog</a><label className="interactive-mode"><input type="checkbox" checked={interactive} onChange={event => { setInteractive(event.target.checked); localStorage.setItem('design-interactive', String(event.target.checked)) }} /> Interactive</label></header>
    {interactive ? <Suspense fallback={<p>Loading components…</p>}><InteractiveGallery scale={scale} /></Suspense> : <>
      <section id="typography" className="design-section"><h2>Typography</h2><label className="sample-text-label">Sample text<input value={sampleText} maxLength={80} onChange={event => setSampleText(event.target.value)} spellCheck={false} /></label><div className="sample-grid"><TypographySpecimens scale={scale} text={sampleText} /></div></section>
      <section id="window-chrome" className="design-section"><h2>Window chrome</h2><div className="sample-grid"><TitleSpecimens scale={scale} /></div><div className="sample-grid"><CaptionSpecimens scale={scale} /></div></section>
      <section id="buttons" className="design-section"><h2>Buttons</h2><div className="sample-grid">{(['normal', 'focused', 'pressed', 'preferred', 'disabled'] as const).map(state => <article className="sample-card" key={state}><h3>{state[0].toUpperCase() + state.slice(1)}</h3><div className="sample-stage"><PixelScale scale={scale} width={75} height={23}><ButtonSpecimen state={state}>Button</ButtonSpecimen></PixelScale></div></article>)}</div><div className="sample-grid"><LiveButton scale={scale} /></div></section>
      {groups.map(group => <section key={group.id} id={group.id} className="design-section"><h2>{group.title}</h2><div className="sample-grid">{group.content}</div></section>)}
    </>}
    <section id="palette" className="design-section"><h2>Palette</h2><div className="palette-grid">{Object.entries(palette).map(([name, color]) => <article className="palette-card" key={name}><h3>{name}</h3><div style={{ backgroundColor: color }} /><code>{color.toUpperCase()}</code></article>)}</div></section>
  </main>
}
export default DesignPage
