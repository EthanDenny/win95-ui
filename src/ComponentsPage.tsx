import { useEffect, useState } from 'react'
import { entries } from './catalog/entries'
import { stories } from './catalog/stories'
import { useFixedPixelScale } from './useFixedPixelScale'
import { useWin95Cursors } from './useWin95Cursors'
import './DesignPage.css'
import './ComponentsPage.css'

const sources = import.meta.glob<string>('./components/*.tsx', { query: '?raw', import: 'default', eager: true })
const groups = [...new Set(entries.map(entry => entry.group))]

function ComponentCard({ entry, scale }: { entry: typeof entries[number]; scale: number }) {
  const [revision, setRevision] = useState(0)
  const Story = stories[entry.name]
  return <section className="catalog-card" id={entry.name} aria-labelledby={`${entry.name}-heading`}>
    <header className="catalog-card-heading"><div><h2 id={`${entry.name}-heading`}><a href={`#${entry.name}`}>{entry.name}</a></h2><code>src/components/{entry.file}</code></div><button type="button" onClick={() => setRevision(revision + 1)} aria-label={`Reset ${entry.name}`}>Reset</button></header>
    <div className="catalog-example" key={revision}><Story scale={scale} /></div>
    <details className="catalog-source"><summary>Source</summary><pre><code>{sources[`./components/${entry.file}`]}</code></pre></details>
  </section>
}
export default function ComponentsPage() {
  const [query, setQuery] = useState(''), [group, setGroup] = useState('All')
  const scale = useFixedPixelScale()
  useWin95Cursors(scale)
  const visible = entries.filter(entry => (group === 'All' || entry.group === group) && `${entry.name} ${entry.file} ${entry.group}`.toLowerCase().includes(query.toLowerCase()))
  useEffect(() => {
    if (location.hash) requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView())
  }, [])
  return <main className="design-page components-page">
    <header className="design-header"><h1>Components</h1><a href="/test/desktop">Desktop</a><a href="/test/design">Design specimens</a><span>{entries.length} reusable components · 2× pixels</span></header>
    <div className="catalog-layout">
      <aside className="catalog-sidebar">
        <label>Find a component<input type="search" value={query} placeholder="Name or filename" onChange={event => setQuery(event.target.value)} /></label>
        <label>Group<select value={group} onChange={event => setGroup(event.target.value)}><option>All</option>{groups.map(group => <option key={group}>{group}</option>)}</select></label>
        <nav aria-label="Component list">{visible.map(entry => <a key={entry.name} href={`#${entry.name}`}>{entry.name}</a>)}</nav>
      </aside>
      <div className="catalog-content">
        {visible.length ? visible.map(entry => <ComponentCard key={entry.name} entry={entry} scale={scale} />) : <p>No components match “{query}”.</p>}
      </div>
    </div>
  </main>
}
