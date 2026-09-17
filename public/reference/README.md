# Windows 95 UI Kit reference

Source: https://www.figma.com/design/cpZSyQGXZYPXjrvccxiAnw/Windows-95-UI-Kit--Community-?node-id=2-882

The 24 icon pairs in `public/icons` are original ICO frames from
https://github.com/trapd00r/win95-winxp_icons, selected by visual comparison with
the Figma Icons canvas. `public/icons/sources.json` records each original file.
Frames were extracted at their original 16px and 32px sizes without resizing.
Screenshot captures were discarded because they contained JPEG compression.
These are archival originals, not asset exports from the Figma file; exact
correspondence with every Figma icon variant remains unverified.

Other inspected canvas groups:
- Button: 1-1189 (default, focus, pressed, preferred, disabled)
- Number Input: 1-1188 (four spinner states and four field states)
- Radiobutton: 1-1383 (selected/unselected, default/disabled)
- Checkbox: 1-1704 (selected/unselected, default/disabled)
- Input Field: 1-2139 (dropdown/no dropdown, empty/filled, default/disabled)
- Control Button: 1-2414 (close, maximize, minimize; default/disabled)
- Window Frame: 1-3230 (empty/icon view; with/without title icon)
- Navbar: 2-558 (task buttons, start button, clock)
- Label, Titlebar, Color Codes: visible in the Components page layer list

The app retains its original MS Sans Serif bitmap font. Figma guest access did
not expose the reference text's font properties, so typography equivalence has
not been certified. Canvas geometry was visually inspected; no source-export
pixel diff has been performed. Restore and inactive-window states are app
extensions retained alongside the kit states.

## Caption correction: original Windows 95 takes precedence

The close glyph and caption proportions were corrected against original
screenshots in Clarke Earley's January 30, 1997 Windows 95 tutorial:
https://server.ccl.net/ccl/acs-fall97/user15/service/circle/win95/win95.htm
- Title-button close-up: `button.jpg` on the same page.
- My Computer example: `mycompt1.jpg` on the same page.

The screenshots show a heavy pixel X and a rectangular caption button, unlike
the thin X and square button used in the Figma approximation. The 8x7 mask,
16x14 button, 4px left / 3px top glyph placement, and 2px gap before Close are
also corroborated by 98.css's implementation:
https://github.com/jdan/98.css/blob/main/icon/close.svg
https://github.com/jdan/98.css/blob/main/style.css

These caption measurements now override the Figma kit. The pressed glyph moves
one native pixel right and down. Normal, pressed, and disabled samples share
the same bitmap and dimensions with the desktop.

## Shared-component corrections

The September 16, 2026 follow-up audit restored bold caption text, 75x23
standard dialog buttons, #808080 shadows, and the reference minimize,
maximize (9x9), restore (8x9), checkbox (7x7), and radio (12x12) masks.
Windows, pressed buttons, fields, and shallow status panels have separate
edge-color rules. Selected task buttons use a white/silver checkerboard.
The same painters are used in the desktop and component gallery.

Radio/checkmark/caption pixel geometry is transcribed from 98.css's SVGs,
cross-checked against the original Windows 95 screenshots linked above.
The 98.css MIT license is included in `98-css-LICENSE.txt`.

The Start button now uses one shared painter and 54x22 geometry in the desktop,
static gallery, and interactive playground. The flag is the native 16x14 pixel
pattern from this February 1995 build 337 reference:
https://commons.wikimedia.org/wiki/File:Start_button_Windows_4.00.337.png
It was recovered from the exact 10x blocks in the enlarged reference, with the
flat gray background made transparent. It replaces the larger, softened 23x18
flag previously sourced from 98.js. The flag begins at (4,4); bitmap text begins
at (23,4), retaining two clear interior pixels before the right/bottom bevels.
Both move one pixel right and down when pressed or when the Start menu is open.

## Explorer collections and scrollbars

The folder tree, pane headings, label-only tree/list selection, dotted branch
lines, square expanders, checkerboard scroll tracks, and scrollbar junction
follow the user's original Explorer screenshot (September 16, 2026,
`Screenshot 2026-09-16 at 12.50.27.png`). The gallery also includes list-box,
small-icon and details views, inactive selection, pressed headers, and disabled
scrollbars. These were originally native-size canvas drawings using the existing font and
original icon assets, displayed at the gallery's fixed 2 physical pixels per
source pixel. The interactive pane supports arrows, paging, thumb dragging,
wheel scrolling and keyboard navigation. Content and pane sizes are examples;
this is not a pixel diff against the screenshot's resized image.

The file-dialog list samples follow the user's `Screenshot 2026-09-16 at
12.53.03.png`: plain file names, full-row directory selection with indented
ancestor/current/child folders, and a small-icon file list that fills columns
top to bottom and scrolls horizontally. The latter supports selection by mouse
and keyboard. The open-directory icon is the native `w95_5.ico` frame from the
same archival icon source; the bitmap document icon is `w98_paint_file.ico`
from that archive. These are component samples rather than complete Open dialogs.
