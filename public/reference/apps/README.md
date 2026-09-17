# Desktop app references and verification

The desktop at `/test/desktop` includes Calculator, Control Panel, and an Internet Explorer 3 recreation. The component gallery at `/test/design` includes the shared typography catalog.

## Original screenshots

Retrieved September 16, 2026, from GUIdebook Gallery. Original Microsoft artwork is retained for historical UI reproduction; GUIdebook hosts the screenshots.

| App | Native size | Source |
| --- | --- | --- |
| Calculator, Windows 95 | 276 × 272 | https://guidebookgallery.org/pics/gui/applications/office/calculator/win95.png |
| Control Panel, Windows 95 | 415 × 362 | https://guidebookgallery.org/pics/gui/settings/menu/win95.png |
| Internet Explorer 3, Windows 95 OSR2 | 480 × 321 | https://guidebookgallery.org/pics/gui/applications/internet/browser/win95osr2.png |

Gallery context: https://guidebookgallery.org/screenshots/win95/ and https://guidebookgallery.org/screenshots/win95osr2/.

`scripts/extract-app-sprites.py` extracts only original icon artwork into `public/apps/`: the small caption icons, nineteen Control Panel icons, eight browser toolbar icons, the IE logo, and the status icon. Caption-icon background pixels are made transparent by an edge-connected flood fill. Enabled Back/Forward artwork derives from the disabled versions by replacing gray with black and highlight white with the face color. No screenshot is used as a window background. Borders, lettering, layouts, checker patterns, and control states are painted independently.

## Reproduce the comparison

Run `npm run verify:apps`. This executes the retained offline app painters in `scripts/reference/` in `@napi-rs/canvas`, with the same bitmap font data and decoded PNG assets. It writes:

- `public/reference/comparisons/index.html`: source / implementation / difference images.
- `public/reference/comparisons/results.json`: exact counts and percentages.
- Native-resolution `*-actual.png` and `*-diff.png` images.

Open http://127.0.0.1:5173/reference/comparisons/ while Vite is running.

Every RGBA pixel is compared at the original screenshot dimensions. No alignment adjustment, antialias tolerance, masks, ignored regions, or image-based overlays are used. Magenta marks a mismatch. Scores include flat areas and reused original artwork and therefore are not an independent measure of perceptual similarity. Browser screenshots are checked visually and functionally, while the lossless automated comparison uses the shared renderer rather than lossy browser screenshot capture.

Final initial-state results:

| App | Exact matching pixels | Differences |
| --- | --- | --- |
| Calculator | 100.000% | 0 / 75,072 |
| Control Panel | 100.000% | 0 / 150,230 |
| Internet Explorer 3 | 100.000% | 0 / 154,080 |

The shared font layer now selects original System 10 pt for legacy control text. This removes the former 398 Calculator lettering differences without glyph patches, per-label offsets, or changes to its layout. All three initial reference states now match exactly. Font provenance and independent font-only checks are documented in `public/fonts/README.md` and `/reference/fonts/`.

These results cover only the initial active, native-size windows. Inactive captions, maximized windows, pressed buttons, settings dialogs, and the new local browser pages do not have equivalent source screenshots and are not claimed to be pixel-identical.

## Implemented behavior and limits

- Multiple windows support dragging (including keyboard movement), activation, minimize, restore, close/reopen, Start launching, and taskbar switching. Control Panel and IE also maximize. Desktop remains 640 × 480 with integer physical-pixel scaling and black letterboxing.
- Calculator supports arithmetic, chaining, repeated equals, decimals, sign, square root, reciprocal, percentage, memory, keyboard input, clear/backspace, and clipboard copy/paste when the browser permits it.
- Control Panel supports selecting/opening applets, desktop color changes through Display, and system/date information. Hardware and operating-system applets are informational previews; this web app does not manage host OS settings.
- IE supports address entry, local Home/Windows/Help pages, back/forward history, favorites, and scrolling by arrows, track, thumb, wheel, and keyboard. HTTP(S) pages offer an explicit link to open in the user's modern browser. This is not an IE engine or a proxy for arbitrary websites. Printing displays a no-printer notice.

Validation: `npm test`, `npm run lint`, `npm run build`, and `npm run verify:apps`. Live-browser checks include calculator arithmetic, Start launching, window drag/maximize/minimize/restore, task switching, desktop color changes, typed addresses, history, and scrollbar dragging.

## DOM button migration

The complete desktop now uses DOM/CSS components and generated original-font WOFF faces. The retained painters live in `scripts/reference/` and are not imported by the app. `verify:apps` measures only those offline reference painters. Its exact-match percentages must not be presented as verification of the migrated browser interface.
