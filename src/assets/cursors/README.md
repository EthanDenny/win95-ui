# Windows 95 cursors

Original `.cur` files are from Chicago95's Standard Cursors, `build/95`:
https://github.com/grassmunk/Chicago95/tree/master/Cursors/Chicago95_Standard_Cursors/build/95

Files: `arrow.cur`, `ibeam.cur`, `sizewe.cur`, `sizens.cur`, `sizenwse.cur`, `sizenesw.cur`, `no.cur`.
The PNGs are native-resolution RGBA decodes of those files, not redrawn icons.
`src/cursorHotspots.json` retains the original CUR hotspot coordinates.

The application enlarges the PNGs with nearest-neighbor sampling to match its
integer physical-pixel scale, then supplies them as resolution-aware CSS cursor
images. The original CUR files remain a fallback. The design page uses 2×;
the desktop follows its display scale. Title-bar dragging retains the classic
arrow instead of the host operating system's grab/grabbing hands.

Scaled PNG variants in `scaled/` are generated ahead of time with `npx tsx scripts/build-cursors.ts`. The browser selects an integer physical-pixel size using CSS image-set; no runtime canvas is required.
