import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resizeEdges, resizeWindow } from '../src/apps/windowSizing.ts'
import { panelLayout, panelControls } from '../src/apps/panelLayout.ts'
import type { AppWindow } from '../src/apps/model.ts'
const window: AppWindow = { id: 'control-panel', x: 100, y: 35, width: 415, height: 362, minimized: false, maximized: false }
test('all eight resize directions preserve the opposite edges and use whole pixels', () => {
  for (const edge of resizeEdges) {
    const result = resizeWindow(window, edge, 12.4, 9.6)
    assert.deepEqual(result, {
      x: window.x + (edge.includes('w') ? 12 : 0),
      y: window.y + (edge.includes('n') ? 10 : 0),
      width: window.width + (edge.includes('e') ? 12 : edge.includes('w') ? -12 : 0),
      height: window.height + (edge.includes('s') ? 10 : edge.includes('n') ? -10 : 0),
    })
  }
})
test('resize respects minimum size and desktop work area', () => {
  assert.deepEqual(resizeWindow(window, 'nw', 999, 999), { x: 183, y: 137, width: 332, height: 260 })
  assert.deepEqual(resizeWindow(window, 'se', 999, 999), { x: 100, y: 35, width: 540, height: 415 })
  assert.deepEqual(resizeWindow(window, 'nw', -999, -999), { x: 0, y: 0, width: 515, height: 397 })
  assert.deepEqual(resizeWindow(window, 'se', -999, -999), { x: 100, y: 35, width: 332, height: 260 })
})
test('fixed and maximized windows cannot be resized', () => {
  const rect = { x: 100, y: 35, width: 415, height: 362 }
  assert.deepEqual(resizeWindow({ ...window, id: 'calculator' }, 'se', 99, 99), rect)
  assert.deepEqual(resizeWindow({ ...window, maximized: true }, 'nw', 99, 99), rect)
})
test('smaller Control Panel adds scrolling and keeps its last icon reachable', () => {
  assert.equal(panelLayout(415, 362).overflow, false)
  const layout = panelLayout(332, 260)
  assert.equal(layout.overflow, true)
  assert.equal(layout.columns, 4)
  const last = panelControls(332, 260, layout.maximum).at(-1)!
  assert.ok(last.y >= 44)
  assert.ok(last.y + last.height <= 260 - 25)
  assert.equal(panelLayout(640, 450).maximum, 0)
})
