import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const css = readFileSync(new URL('../src/components/controls.css', import.meta.url), 'utf8')
const component = readFileSync(new URL('../src/components/TextArea.tsx', import.meta.url), 'utf8')

test('textarea scroll content is isolated from its inset border', () => {
  assert.match(component, /<div className="w95-textarea-frame w95-inset"[^>]*style=\{\{ width, height \}\}>/)
  assert.match(component, /<textarea \{\.\.\.props\}[^>]*className=\{`w95-textarea w95-native-text/)
  assert.match(css, /\.w95-textarea-frame\s*\{[^}]*position:\s*relative;[^}]*overflow:\s*hidden;/s)
  assert.match(css, /textarea\.w95-textarea\s*\{[^}]*position:\s*absolute;[^}]*left:\s*4px;[^}]*top:\s*4px;[^}]*right:\s*20px;[^}]*bottom:\s*4px;/s)
})

test('textarea hides the browser scrollbar and synchronizes a Windows 95 scrollbar', () => {
  assert.match(component, /import \{ Scrollbar \} from '\.\/Scrollbar'/)
  assert.match(component, /<Scrollbar orientation="vertical"[^>]*total=\{scroll\.total\}[^>]*page=\{scroll\.page\}[^>]*value=\{scroll\.value\}/s)
  assert.match(component, /onScroll=\{event => \{ onScroll\?\.\(event\); measure\(\) \}\}/)
  assert.match(css, /textarea\.w95-textarea\s*\{[^}]*scrollbar-width:\s*none;/s)
  assert.match(css, /textarea\.w95-textarea::-webkit-scrollbar\s*\{\s*display:\s*none;/)
})

test('disabled textarea applies its face color to both frame and scrolling surface', () => {
  assert.match(component, /data-disabled=\{disabled \|\| undefined\}/)
  assert.match(css, /\.w95-textarea-frame\[data-disabled=true\]\s*\{[^}]*--inset-face:\s*#c0c0c0;/s)
  assert.match(css, /textarea\.w95-textarea:disabled\s*\{[^}]*background:\s*#c0c0c0;/s)
})
