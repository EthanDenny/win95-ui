import { useState } from 'react'
import { dialogFiles } from './fileListData'
import { ListView } from './components/ListView'
import { PixelScale } from './components/PixelScale'

export function FileListPreview({ scale, disabled = false }: { scale: number; disabled?: boolean }) {
  const [selected, setSelected] = useState(2)
  return <article className="sample-card">
    <h3>File list · columns and horizontal scrolling</h3>
    <div className="sample-stage">
      <PixelScale scale={scale} width={380} height={128}>
        <ListView label="File dialog files" items={dialogFiles} selected={selected} onSelect={setSelected} width={380} height={128} layout="columns" disabled={disabled} />
      </PixelScale>
    </div>
    <div className="sample-caption"><span>Click a file, use arrow keys, or scroll horizontally.</span></div>
  </article>
}
