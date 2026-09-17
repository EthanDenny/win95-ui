# Original Windows 95 bitmap fonts

The renderer uses original font resources and native metrics from a Windows 95 RTM installation. It does not use CSS font substitutions, modern TrueType lookalikes, antialiasing, stretched glyphs, or screenshot-derived letter masks.

## Font families and native strikes

| Family | Original file | Available point sizes | Native cell heights | Stored weight |
| --- | --- | --- | --- | --- |
| MS Sans Serif | SSERIFE.FON | 8, 10, 12, 14, 18, 24 | 13, 16, 20, 24, 29, 37 px | Regular |
| System | VGASYS.FON | 10 | 16 px | Bold |
| Fixedsys | VGAFIX.FON | 12 | 15 px | Regular |

These are distinct typefaces. System is not MS Sans Serif with a bold flag. Fixedsys is a monospaced family. The catalog contains 193 supported Unicode-mapped Windows-1252 glyphs from each of the eight native strikes. Extraction excludes the 25 characters whose pixels equal the FON's default missing-character bar, including em/en dashes, curly double quotes, bullets, and ellipses. Browser text uses font fallback for these characters; the offline bitmap renderer uses a visible question mark. This is not a full-Unicode font collection.

`src/bitmapFont.ts` provides explicit `FontSpec` selection and shared roles:

- `fontRoles.ui`: MS Sans Serif 8 pt regular for UI controls.
- `fontRoles.uiBold`: MS Sans Serif 8 pt with GDI raster bold for captions and emphasis.
- `fontRoles.systemControl`: native System 10 pt bold for legacy controls.
- `fontRoles.document`: Fixedsys 12 pt for monospaced documents.
- `fontRoles.banner`: MS Sans Serif 24 pt regular.

Measurement and painting resolve the same native font, glyphs, and advance widths. Native System bold is never emboldened again. Unsupported family/size/weight combinations fail explicitly. The source files retain native integer pixels. The browser renders corresponding WOFF outlines inside a container scaled to whole physical pixels.

## Bold is family-specific

The original MS Sans Serif FON contains regular strikes only. Windows GDI synthesizes its bold raster style by drawing the glyph again one pixel to the right. This is documented in Microsoft's *Windows Guide to Programming* (1992), chapter 18, printed page 423:
https://www.bitsavers.org/pdf/microsoft/windows_3.1/Windows_3.1_Guide_to_Programming_1992.pdf

The renderer preserves this GDI behavior for MS Sans Serif, including the extra advance, and caches the realized glyphs. System's bold glyphs and widths come directly from VGASYS.FON. Treating System text as synthesized MS Sans Serif was the previous font-family error.

Microsoft also documents raster-style synthesis in CreateFont:
https://learn.microsoft.com/en-us/windows/win32/api/wingdi/nf-wingdi-createfonta

Stock System font background:
https://devblogs.microsoft.com/oldnewthing/20050707-00/?p=35013

The Windows 95 documentation identifies VGASYS.FON and VGAFIX.FON as the VGA System and Fixed font files:
https://techshelps.github.io/MSDN/DNWIN95/HTML/S71AE.HTM

## Provenance

All three files were recovered from PCjs's installed Windows 95 RTM image:
https://harddisks.pcjs.org/pcx86/68mb/WIN95.json

Installation context:
https://www.pcjs.org/software/pcx86/sys/windows/win95/4.00.950/

Original paths: `C:\WINDOWS\FONTS\SSERIFE.FON`, `VGASYS.FON`, and `VGAFIX.FON`. All three files have the original installation timestamp `1995-07-11 09:50:00`. `sources.json` pins each file's SHA-256, original path, timestamp, and image-manifest MD5.

| File | SHA-256 |
| --- | --- |
| SSERIFE.FON | 07616c9ac5aa27b2d7e7cfa0a03ffdd08ae9a21b60fa896321276e3a93c51c34 |
| VGASYS.FON | 99d326c506b3734245e45e452de62f9526b98abde34c7f8dca990b62abdcc2a8 |
| VGAFIX.FON | 0fb03ed3a16b08e05b8f4ad68f47fc8182e276affc38b7e1173032b6f3f870ba |

SSERIFE.FON is byte-identical to the previously used React95 source. The earlier archival Windows 3.1 copies of System and Fixedsys had identical glyphs and metrics, but different container hashes; the project now stores the actual Windows 95 RTM containers.

Original font copyright notices are preserved in `src/fonts/bitmap-fonts.json`: MS Sans Serif and System are Microsoft copyright; Fixedsys is Bitstream copyright. A repository or extraction-tool license does not relicense this original font data.

## Reproduce and verify

Normal development needs only the committed assets and Node dependencies:

```sh
npm test
npm run verify:fonts
npm run verify:apps
```

For binary-source verification, install `scripts/requirements-fonts.txt` in a Python virtual environment, then run:

```sh
python scripts/extract-font.py --check
```

This checks all source hashes and compares every exported glyph bitmap, advance, baseline, and other vertical metrics against the FON resources. To regenerate, run the script without `--check`.

To recover the original files again, download the PCjs image to a temporary location, then run `python scripts/recover-fonts.py /path/to/WIN95.json`. The script extracts only the three pinned font files and verifies every hash before writing. It does not execute, install, or mount the OS image.

The typography section at `/test/design#typography` shows all three families at the existing fixed 2× physical-pixel scale. Interactive mode offers the available native family/size/weight combinations.

The independent screenshot specimens and complete repertoire sheets are at `/reference/fonts/`. Fixed-coordinate comparisons cover regular UI text, bold captions, native System lettering, and Fixedsys document text, with zero differing pixels. These samples validate the displayed strings; native-file verification covers the complete exported repertoire. No claim is made about unimplemented Windows font families, TrueType rasterization, other code pages, high-DPI font variants, or every possible GDI rendering mode.

## Native browser text

All 14 supported faces have WOFF counterparts generated by `scripts/build-web-font.py` from `src/fonts/bitmap-fonts.json`: MS Sans Serif 8/10/12/14/18/24 pt in regular and GDI raster-bold, native System 10 pt bold, and Fixedsys 12 pt. FontTools converts each bitmap run to rectangular outlines, retaining character mapping, advances, side bearings, cell height, and baseline. No substitute typeface, curve fitting, or kerning is used. Source copyright is preserved in the name table.

`src/components/fonts.css` declares the faces using content-hashed URL query strings, so regenerated fonts invalidate cached faces and update live development pages. `NativeText` selects the corresponding native cell height and weight. Inputs and ordinary UI labels use MS Sans Serif 8 pt at 13 CSS px. System's bold is intrinsic; MS Sans Serif bold unions the source with a one-pixel rightward copy and increases the advance by one pixel. Browser font synthesis is disabled.

```sh
python scripts/build-web-font.py
python scripts/verify-web-font.py
```

Verification round-trips every shipped outline and metric against the source: 193 glyphs per face, 2,702 total. It also checks that missing-character bars are absent from the character maps and genuine punctuation remains supported. Exact glyph geometry is verified; browser/OS rasterization still requires visual validation. Characters outside the supported source repertoire fall back to a browser font so native editing remains usable. The offline screenshot comparisons validate the reference bitmap renderer, not browser text rasterization.
