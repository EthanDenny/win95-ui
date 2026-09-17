import type { ComponentType } from 'react'
import type { ComponentName, StoryProps } from './entries'
import { ButtonDemo, ChoiceDemo, TextDemo, SpinnerDemo, DropdownDemo } from '../InteractiveForms'
import { TypographyDemo, LabelDemo, IconDemo, SurfaceDemo } from '../InteractiveVisuals'
import { CollectionDemo } from '../InteractiveCollections'
import { WindowDemo } from '../InteractiveWindow'
import { LiveScrollPane } from '../LiveScrollPane'
import { TextAreaStory, ButtonSpecimenStory, ColorSwatchStory, ColumnHeaderStory, ListViewStory, SplitPaneStory, PaneStory, ScrollbarStory } from './ControlStories'
import { MenuStory, MenuItemStory, MenuSeparatorStory, MenuBarStory, ToolbarStory } from './MenuStories'
import { TitleBarStory, WindowFrameStory, WindowChromeStory, CaptionButtonStory, DialogStory, StatusBarStory, StatusFieldStory, SizeGripStory, WindowTrackingStory } from './WindowStories'
import { TaskbarStory, TaskbarButtonStory, StartMenuStory, IconButtonStory, PixelScaleStory } from './DesktopStories'

export const stories = {
  Button: ButtonDemo,
  ButtonSpecimen: ButtonSpecimenStory,
  Checkbox: ChoiceDemo,
  Radio: props => <ChoiceDemo {...props} radio />,
  TextInput: TextDemo,
  TextArea: TextAreaStory,
  NumberInput: props => <TextDemo {...props} numeric />,
  Spinner: SpinnerDemo,
  Dropdown: DropdownDemo,
  ColorSwatch: ColorSwatchStory,
  ListView: ListViewStory,
  TreeView: props => <CollectionDemo {...props} kind="tree" />,
  ColumnHeader: ColumnHeaderStory,
  Pane: PaneStory,
  SplitPane: SplitPaneStory,
  ScrollArea: LiveScrollPane,
  Scrollbar: ScrollbarStory,
  Menu: MenuStory,
  MenuItem: MenuItemStory,
  MenuSeparator: MenuSeparatorStory,
  MenuBar: MenuBarStory,
  Toolbar: ToolbarStory,
  ToolbarButton: props => <ToolbarStory {...props} single />,
  Window: WindowDemo,
  WindowChrome: WindowChromeStory,
  WindowFrame: WindowFrameStory,
  TitleBar: TitleBarStory,
  CaptionButton: CaptionButtonStory,
  Dialog: DialogStory,
  StatusBar: StatusBarStory,
  StatusField: StatusFieldStory,
  SizeGrip: SizeGripStory,
  WindowTracking: WindowTrackingStory,
  Taskbar: TaskbarStory,
  TaskbarButton: TaskbarButtonStory,
  StartMenu: StartMenuStory,
  IconButton: IconButtonStory,
  NativeText: TypographyDemo,
  Label: LabelDemo,
  Icon: IconDemo,
  SurfaceBox: SurfaceDemo,
  PixelScale: PixelScaleStory,
} satisfies Record<ComponentName, ComponentType<StoryProps>>
