# Windows 95 components

Open `/` or `/test/components` for every exported component, its filename, a live example,
state controls, and its source. `/design` retains the visual specimen sheet;
`/desktop` exercises the same components in applications.

Import components directly from their source files. Each component owns its shared
styles; no desktop application imports are needed. Geometry is specified in original
Windows pixels. Wrap a composition in `PixelScale`; don't scale individual children
inside an already scaled window. The test pages use two physical pixels per original
pixel, including on Retina screens.

- **Inputs:** Button, Checkbox, Radio, TextInput, TextArea, NumberInput, Spinner, Dropdown,
  ColorSwatch. NumberInput is controlled with a string so partially typed numbers can
  be edited. Its steppers support min/max/step; read-only disables stepping.
- **Collections:** ListView (list, small-icons, details, columns), TreeView, Pane,
  SplitPane, ColumnHeader, ScrollArea, Scrollbar. SplitPane accepts arbitrary content
  and supports controlled or internal divider state and keyboard resizing.
- **Menus:** Menu, MenuItem, MenuSeparator, MenuBar, Toolbar, ToolbarButton. Menu
  handles navigation, disabled items and mnemonic activation. Its owner controls
  opening, selection, focus on opening, and outside-click dismissal.
- **Windows:** Window composes WindowChrome, TitleBar, WindowFrame and CaptionButton.
  It receives caption callbacks and title-bar event handlers; application-specific
  movement, resizing, stacking and maximize/minimize state remain with the owner.
  Dialog traps focus and supports Escape/Alt+F4. Pass `restoreFocus` when the opener
  becomes inert; mark the initial action `data-dialog-default`.
- **Desktop:** Taskbar, TaskbarButton, StartMenu, IconButton. These receive data and
  callbacks, with no dependency on the calculator, browser or Control Panel.
- **Presentation:** Icon accepts a kit icon name or a custom asset URL. NativeText
  uses the extracted bitmap fonts. Label, SurfaceBox, StatusBar, StatusField,
  SizeGrip and WindowTracking are also reusable.

Catalog metadata lives in `src/catalog/entries.ts`, with examples grouped in the
adjacent story files. Add an entry and story when exporting a component. The
inventory test verifies every public component appears exactly once and that
components never import application state or gallery code.
