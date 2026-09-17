import fontData from './fonts/bitmap-fonts.json'

export type FontSize = 8 | 10 | 12 | 14 | 18 | 24
export type FontSpec =
  | { family: 'ms-sans-serif'; size: FontSize; weight?: 'regular' | 'bold' }
  | { family: 'system'; size: 10; weight?: 'bold' }
  | { family: 'fixedsys'; size: 12; weight?: 'regular' }
export type FontRequest = FontSize | FontSpec

type Glyph = { advance: number; rows: string[] }
type BitmapFont = { family: string; size: number; weight: string; height: number; ascent: number; descent: number; baseline: number; internalLeading: number; source: string; glyphs: Record<string, Glyph> }
const fonts: Record<string, BitmapFont> = fontData
const boldFonts = new Map<string, BitmapFont>()

// Font roles select a family and a native strike, not an arbitrary CSS size.
export const fontRoles = {
  ui: { family: 'ms-sans-serif', size: 8, weight: 'regular' },
  uiBold: { family: 'ms-sans-serif', size: 8, weight: 'bold' },
  systemControl: { family: 'system', size: 10, weight: 'bold' },
  document: { family: 'fixedsys', size: 12, weight: 'regular' },
  banner: { family: 'ms-sans-serif', size: 24, weight: 'regular' },
} as const satisfies Record<string, FontSpec>

export const fontChoices: { label: string; font: FontSpec }[] = [
  { label: 'MS Sans Serif · 8 pt', font: fontRoles.ui },
  { label: 'MS Sans Serif · 8 pt bold', font: fontRoles.uiBold },
  { label: 'System · 10 pt (native bold)', font: fontRoles.systemControl },
  { label: 'Fixedsys · 12 pt', font: fontRoles.document },
  ...([10, 12, 14, 18, 24] as const).flatMap(size => [
    { label: `MS Sans Serif · ${size} pt`, font: { family: 'ms-sans-serif' as const, size, weight: 'regular' as const } },
    { label: `MS Sans Serif · ${size} pt bold`, font: { family: 'ms-sans-serif' as const, size, weight: 'bold' as const } },
  ]),
]

export function getBitmapFont(request: FontRequest = fontRoles.ui, bold = false): BitmapFont {
  const spec: FontSpec = typeof request === 'number' ? { family: 'ms-sans-serif', size: request, weight: bold ? 'bold' : 'regular' } : request
  const key = `${spec.family}:${spec.size}`
  const font = fonts[key]
  if (!font) throw new Error(`No native bitmap strike for ${key}`)
  const weight = spec.weight ?? font.weight
  if (weight === font.weight) return font
  if (spec.family !== 'ms-sans-serif' || weight !== 'bold') throw new Error(`Unsupported font weight for ${key}`)
  if (!boldFonts.has(key)) {
    // Windows GDI's documented raster-bold realization: draw a second copy
    // one pixel to the right. Native System bold NEVER goes through this path.
    // Microsoft Windows Guide to Programming (1992), chapter 18, page 423.
    const glyphs = Object.fromEntries(Object.entries(font.glyphs).map(([char, glyph]) => [char, {
      advance: glyph.advance + 1,
      rows: glyph.rows.map(row => Array.from({ length: row.length + 1 }, (_, x) => row[x] === '1' || row[x - 1] === '1' ? '1' : '0').join('')),
    }]))
    boldFonts.set(key, { ...font, weight: 'bold', glyphs })
  }
  return boldFonts.get(key)!
}

function getGlyph(font: BitmapFont, char: string): Glyph {
  return font.glyphs[char] ?? font.glyphs[/\s/.test(char) ? ' ' : '?']
}

export function measureBitmapText(text: string, request: FontRequest = fontRoles.ui, bold = false) {
  const font = getBitmapFont(request, bold)
  return Array.from(text).reduce((width, char) => width + getGlyph(font, char).advance, 0)
}
