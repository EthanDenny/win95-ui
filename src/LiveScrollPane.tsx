import { ScrollArea } from './components/ScrollArea'
import { PixelScale } from './components/PixelScale'
const names = ['Billboards', "Bobby's Stats", 'Business Unit', 'Color Samples', 'Extra Templates', 'Financial Statistics', 'Mailing Lists', 'Old Program Files', 'Quarterly Stats', 'Reviews', 'Rolling Account', 'Smith Project', 'Templates', 'Work in progress', 'Year-end reports']
export function LiveScrollPane({ scale }: { scale: number }) {
  return <article className="sample-card"><h3>Interactive · arrows, track and thumb</h3><div className="sample-stage"><PixelScale scale={scale} width={240} height={148}>
    <div className="w95-inset w95-native-text" style={{ width: 240, height: 148, padding: 2 }}><ScrollArea label="Scrollable folder list" width={236} height={144} contentWidth={340} contentHeight={names.length * 16} horizontal vertical>
      {names.map((name, index) => <div key={name} style={{ position: 'absolute', left: 0, top: index * 16, width: 340, height: 16 }}><img src="/icons/2-16.png" alt="" width={16} height={16} style={{ position: 'absolute', left: 2, top: 0, imageRendering: 'pixelated' }} /><span style={{ position: 'absolute', left: 21, top: 1 }}>{name}</span><span style={{ position: 'absolute', left: 232, top: 1 }}>File Folder</span></div>)}
    </ScrollArea></div>
  </PixelScale></div><div className="sample-caption"><span>Drag, click, use the wheel, or focus and use arrow keys.</span></div></article>
}
