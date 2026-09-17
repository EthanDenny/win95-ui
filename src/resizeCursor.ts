export type ResizeCursor = 'sizewe' | 'sizens' | 'sizenwse' | 'sizenesw'

export const edgeCursors = {
  n: 'sizens', s: 'sizens', e: 'sizewe', w: 'sizewe',
  nw: 'sizenwse', se: 'sizenwse', ne: 'sizenesw', sw: 'sizenesw',
} as const satisfies Record<string, ResizeCursor>

// Return a release function so unmounts and lost pointer capture also clean up.
export function holdResizeCursor(root: Pick<HTMLElement, 'setAttribute' | 'removeAttribute'>, events: EventTarget, cursor: ResizeCursor) {
  root.setAttribute('data-win95-resizing', cursor)
  let released = false
  const release = () => {
    if (released) return
    released = true
    root.removeAttribute('data-win95-resizing')
    for (const name of ['pointerup', 'pointercancel', 'blur']) events.removeEventListener(name, release, true)
    events.removeEventListener('keydown', onKey, true)
  }
  const onKey = (event: Event) => { if ((event as KeyboardEvent).key === 'Escape') release() }
  for (const name of ['pointerup', 'pointercancel', 'blur']) events.addEventListener(name, release, true)
  events.addEventListener('keydown', onKey, true)
  return release
}
