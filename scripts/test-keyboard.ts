import { test } from 'node:test'
import assert from 'node:assert/strict'
import { appShortcut } from '../src/apps/keyboard.ts'
import { calculate, initialCalculator } from '../src/apps/calculator.ts'

test('calculator keyboard arithmetic, equals, clear and memory use app commands', () => {
  let state = initialCalculator()
  for (const key of ['2', '+', '3', 'Enter']) {
    const action = appShortcut('calculator', { key })!
    state = calculate(state, action.slice(4))
  }
  assert.equal(state.display, '5')
  for (const event of [{ key: 'm', ctrlKey: true }, { key: 'Escape' }, { key: 'r', ctrlKey: true }, { key: 'F9' }]) {
    state = calculate(state, appShortcut('calculator', event)!.slice(4))
  }
  assert.equal(state.display, '-5')
  assert.equal(appShortcut('calculator', { key: ' ' }), null)
  assert.equal(appShortcut('calculator', { key: 'Backspace' }), 'key:Back')
  assert.equal(appShortcut('calculator', { key: 'Delete' }), 'key:CE')
})

test('native text editing, composition, and unsupported modifier combinations are preserved', () => {
  for (const key of ['c', 'v', 'x', 'a', 'z']) assert.equal(appShortcut('browser', { key, ctrlKey: true }, true), null)
  assert.equal(appShortcut('calculator', { key: 'c', ctrlKey: true }, true), null)
  assert.equal(appShortcut('calculator', { key: '2', isComposing: true }), null)
  assert.equal(appShortcut('calculator', { key: '2', ctrlKey: true, altKey: true }), null)
  assert.equal(appShortcut('browser', { key: 'l', metaKey: true }), null)
  assert.equal(appShortcut('browser', { key: 'Enter' }, true), null)
})

test('window and menu accelerators work without consuming native navigation', () => {
  assert.equal(appShortcut('calculator', { key: 'e', altKey: true }), 'menu:Edit')
  assert.equal(appShortcut('browser', { key: 'a', altKey: true }), 'menu:Favorites')
  assert.equal(appShortcut('browser', { key: 'f', altKey: true }, true), 'menu:File')
  assert.equal(appShortcut('control-panel', { key: 'F4', altKey: true }), 'close')
  assert.equal(appShortcut('control-panel', { key: 'F10' }), 'focus-menu')
  assert.equal(appShortcut('control-panel', { key: 'F10', shiftKey: true }), null)
  assert.equal(appShortcut('control-panel', { key: 'ArrowDown' }), null)
})

test('browser shortcuts target the recreated browser even while editing its address', () => {
  assert.equal(appShortcut('browser', { key: 'd', altKey: true }, true), 'command:Open address')
  assert.equal(appShortcut('browser', { key: 'o', ctrlKey: true }, true), 'command:Open address')
  assert.equal(appShortcut('browser', { key: 'ArrowLeft', altKey: true }, true), 'tool:Back')
  assert.equal(appShortcut('browser', { key: 'ArrowRight', altKey: true }), 'tool:Forward')
  assert.equal(appShortcut('browser', { key: 'F5' }, true), 'tool:Refresh')
  assert.equal(appShortcut('browser', { key: 'Escape' }), 'tool:Stop')
  assert.equal(appShortcut('browser', { key: 'p', ctrlKey: true }), 'tool:Print')
})
