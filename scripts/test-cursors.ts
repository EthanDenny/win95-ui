import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { edgeCursors, holdResizeCursor } from '../src/resizeCursor.ts'

test('window edges select the correct horizontal, vertical and diagonal cursors', () => {
  assert.deepEqual(edgeCursors, { n: 'sizens', s: 'sizens', e: 'sizewe', w: 'sizewe', nw: 'sizenwse', se: 'sizenwse', ne: 'sizenesw', sw: 'sizenesw' })
})

test('resize cursor is released after pointer up, cancellation, focus loss and Escape', () => {
  for (const name of ['pointerup', 'pointercancel', 'blur', 'keydown']) {
    const attributes = new Map<string, string>()
    const root = { setAttribute: (key: string, value: string) => { attributes.set(key, value) }, removeAttribute: (key: string) => { attributes.delete(key) } }
    const events = new EventTarget()
    const release = holdResizeCursor(root, events, 'sizenwse')
    assert.equal(attributes.get('data-win95-resizing'), 'sizenwse')
    const event = new Event(name)
    if (name === 'keydown') Object.defineProperty(event, 'key', { value: 'Escape' })
    events.dispatchEvent(event)
    assert.equal(attributes.has('data-win95-resizing'), false)
    // Repeated cleanup must not clear a later drag.
    root.setAttribute('data-win95-resizing', 'sizewe')
    release()
    events.dispatchEvent(event)
    assert.equal(attributes.get('data-win95-resizing'), 'sizewe')
  }
})

test('unmount cleanup releases the cursor, and unrelated keys do not', () => {
  const attributes = new Map<string, string>()
  const root = { setAttribute: (key: string, value: string) => { attributes.set(key, value) }, removeAttribute: (key: string) => { attributes.delete(key) } }
  const events = new EventTarget()
  const release = holdResizeCursor(root, events, 'sizewe')
  const key = new Event('keydown')
  Object.defineProperty(key, 'key', { value: 'ArrowRight' })
  events.dispatchEvent(key)
  assert.equal(attributes.get('data-win95-resizing'), 'sizewe')
  release()
  assert.equal(attributes.size, 0)
})

test('the shared splitter gets its resize cursor and disabled controls retain theirs', () => {
  const css = readFileSync(new URL('../src/cursors.css', import.meta.url), 'utf8')
  assert.match(css, /#root \.w95-splitter\s*\{ cursor: var\(--win95-sizewe\)/)
  assert(css.indexOf('#root .w95-splitter') < css.indexOf('#root :disabled'))
  assert.match(css, /html\[data-win95-resizing\] \* \{ cursor: var\(--win95-drag-cursor\) !important/)
})
