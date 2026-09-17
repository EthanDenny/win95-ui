import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calculate, initialCalculator } from '../src/apps/calculator.ts'
import { initialBrowser, navigateBrowser, travelBrowser } from '../src/apps/model.ts'
const run = (...keys: string[]) => keys.reduce(calculate, initialCalculator())
test('calculator handles chained arithmetic and repeated equals', () => {
  assert.equal(run('7', '+', '8', '=').display, '15')
  assert.equal(run('2', '+', '3', '*', '4', '=').display, '20')
  assert.equal(run('2', '+', '3', '=', '=').display, '8')
})
test('calculator handles fractions, percentage, sign, and unary functions', () => {
  assert.equal(run('0', '.', '1', '+', '0', '.', '2', '=').display, '0.3')
  assert.equal(run('2', '0', '0', '+', '1', '0', '%', '=').display, '220')
  assert.equal(run('9', 'sqrt', '+/-').display, '-3')
  assert.equal(run('4', '1/x').display, '0.25')
})
test('memory survives clear, and division by zero recovers', () => {
  assert.equal(run('9', 'MS', 'C', 'MR').display, '9')
  assert.equal(run('9', 'MS', '2', 'M+', 'MR').display, '11')
  assert.equal(run('9', '/', '0', '=').display, 'Error')
  assert.equal(run('9', '/', '0', '=', '7').display, '7')
  assert.equal(run('1', '2', 'Back').display, '1')
})
test('browser history truncates forward entries after a new navigation', () => {
  const home = navigateBrowser(initialBrowser(), 'about:home')
  const help = navigateBrowser(home, 'about:help')
  assert.equal(travelBrowser(help, -1).address, 'about:home')
  const windows = navigateBrowser(travelBrowser(help, -1), 'about:windows')
  assert.equal(windows.history.includes('about:help'), false)
  assert.equal(travelBrowser(windows, 100).index, windows.index)
  assert.equal(travelBrowser(windows, -100).index, 0)
  assert.equal(navigateBrowser(windows, 'example.com').address, 'https://example.com')
})
