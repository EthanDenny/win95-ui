import { drawBitmapText } from './reference/referenceText.ts'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createCanvas } from '@napi-rs/canvas'
import { fontChoices, fontRoles, getBitmapFont, measureBitmapText } from '../src/bitmapFont.ts'

test('native faces do not advertise missing-character bars as punctuation', () => {
  for (const { font } of fontChoices) {
    const { glyphs } = getBitmapFont(font)
    for (const char of '€‚ƒ„…†‡ˆ‰Š‹ŒŽ“”•–—˜™š›œžŸ') {
      assert.equal(glyphs[char], undefined, `${JSON.stringify(font)}: ${char}`)
    }
    for (const char of '‘’"\'-|?é') assert.ok(glyphs[char], char)
    assert.equal(measureBitmapText('—', font), measureBitmapText('?', font))
  }
})

test('font roles select native families, sizes, and intrinsic weights', () => {
  assert.equal(getBitmapFont(fontRoles.ui).source, 'SSERIFE.FON')
  assert.equal(getBitmapFont(fontRoles.systemControl).source, 'VGASYS.FON')
  assert.equal(getBitmapFont(fontRoles.systemControl).weight, 'bold')
  assert.equal(getBitmapFont(fontRoles.document).source, 'VGAFIX.FON')
  assert.equal(getBitmapFont(fontRoles.document).height, 15)
  assert.equal(getBitmapFont(fontRoles.systemControl).height, 16)
  assert.equal(getBitmapFont(fontRoles.ui).height, 13)
})
test('native System advances are not synthesized MS Sans Serif advances', () => {
  assert.equal(measureBitmapText('Back', fontRoles.systemControl), 32)
  assert.notEqual(measureBitmapText('Back', fontRoles.systemControl), measureBitmapText('Back', 10, true))
  assert.equal(measureBitmapText('Back', fontRoles.systemControl, true), 32)
  assert.equal(measureBitmapText('iiiWWW', fontRoles.document), 48)
})
test('native sizes are selected without scaling or silent font substitution', () => {
  assert.deepEqual(([8, 10, 12, 14, 18, 24] as const).map(size => getBitmapFont(size).height), [13, 16, 20, 24, 29, 37])
  assert.throws(() => getBitmapFont({ family: 'system', size: 8 } as never), /No native bitmap strike/)
  assert.throws(() => getBitmapFont({ family: 'fixedsys', size: 12, weight: 'bold' } as never), /Unsupported font weight/)
})
test('GDI bold is a one-pixel overstrike of the regular raster, with integer output', () => {
  const canvas = createCanvas(80, 20), ctx = canvas.getContext('2d')
  const expected = createCanvas(80, 20), expectedContext = expected.getContext('2d')
  const label = 'Menu'
  drawBitmapText(ctx as unknown as CanvasRenderingContext2D, label, 0, 0, fontRoles.uiBold)
  let x = 0
  for (const char of label) {
    drawBitmapText(expectedContext as unknown as CanvasRenderingContext2D, char, x, 0, fontRoles.ui)
    drawBitmapText(expectedContext as unknown as CanvasRenderingContext2D, char, x + 1, 0, fontRoles.ui)
    x += measureBitmapText(char, fontRoles.ui) + 1
  }
  assert.deepEqual(ctx.getImageData(0, 0, 80, 20).data, expectedContext.getImageData(0, 0, 80, 20).data)
})
