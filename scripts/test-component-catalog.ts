import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'
import { entries } from '../src/catalog/entries'

test('every public component has exactly one catalog entry pointing to its source file', () => {
  const directory = new URL('../src/components/', import.meta.url)
  const exported = readdirSync(directory).filter(file => file.endsWith('.tsx')).flatMap(file => {
    const source = ts.createSourceFile(file, readFileSync(new URL(file, directory), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    return source.statements.filter(statement => ts.isFunctionDeclaration(statement) && statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword))
      .map(statement => `${(statement as ts.FunctionDeclaration).name!.text}:${file}`)
  }).sort()
  assert.deepEqual(entries.map(entry => `${entry.name}:${entry.file}`).sort(), exported)
  assert.equal(new Set(entries.map(entry => entry.name)).size, entries.length)
})

test('reusable components do not import app state or gallery examples', () => {
  const directory = new URL('../src/components/', import.meta.url)
  for (const file of readdirSync(directory).filter(file => file.endsWith('.tsx'))) {
    const source = ts.createSourceFile(file, readFileSync(new URL(file, directory), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue
      assert.doesNotMatch(statement.moduleSpecifier.text, /(?:apps\/|Interactive|Specimens|catalog\/|Page)/, `${file} depends on application or demo code`)
    }
  }
})
