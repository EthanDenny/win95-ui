import { ButtonDemo, ChoiceDemo, DropdownDemo, SpinnerDemo, TextDemo } from './InteractiveForms'
import { CollectionDemo, FileDialogDemo, ScrollbarDemo } from './InteractiveCollections'
import { WindowDemo } from './InteractiveWindow'
import { IconDemo, LabelDemo, SectionsDemo, SurfaceDemo, TypographyDemo } from './InteractiveVisuals'

export function InteractiveGallery({ scale }: { scale: number }) {
  const groups = [
    { id: 'typography', title: 'Typography', content: <TypographyDemo scale={scale} /> },
    { id: 'window-chrome', title: 'Window chrome and taskbar', content: <WindowDemo scale={scale} /> },
    { id: 'buttons', title: 'Buttons', content: <ButtonDemo scale={scale} /> },
    { id: 'checkboxes', title: 'Choices', content: <><ChoiceDemo scale={scale} /><ChoiceDemo scale={scale} radio /></> },
    { id: 'inputs', title: 'Fields', content: <><TextDemo scale={scale} /><DropdownDemo scale={scale} /><TextDemo scale={scale} numeric /><DropdownDemo scale={scale} arrowOnly /><SpinnerDemo scale={scale} /></> },
    { id: 'trees', title: 'Tree views', content: <CollectionDemo scale={scale} kind="tree" /> },
    { id: 'lists', title: 'List views', content: <><CollectionDemo scale={scale} kind="list" /><CollectionDemo scale={scale} kind="small-icons" /><CollectionDemo scale={scale} kind="details" /></> },
    { id: 'file-lists', title: 'File dialog lists', content: <><CollectionDemo scale={scale} kind="directory" /><FileDialogDemo scale={scale} /></> },
    { id: 'sections', title: 'Sections and headers', content: <SectionsDemo scale={scale} /> },
    { id: 'scrollbars', title: 'Scrollbars', content: <><ScrollbarDemo scale={scale} /><ScrollbarDemo scale={scale} vertical /></> },
    { id: 'labels', title: 'Labels', content: <LabelDemo scale={scale} /> },
    { id: 'surfaces', title: 'Surfaces', content: <SurfaceDemo scale={scale} /> },
    { id: 'icons', title: 'Icons', content: <IconDemo scale={scale} /> },
  ]
  return <>{groups.map(group => <section key={group.id} id={group.id} className="design-section"><h2>{group.title}</h2><div className="interactive-grid">{group.content}</div></section>)}</>
}
