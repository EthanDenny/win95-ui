import { numberedIconUrl } from './assetUrls'

export const kitIconNames = ['My Computer', 'Internet Explorer', 'Folder', 'Open folder', 'Program folder', 'Busy program', 'Control Panel', 'Settings', 'Window', 'Drive', 'Find computer', 'Find document', 'Notepad', 'Windows document', 'Documents', 'MIDI document', 'Help', 'Recycle Bin full', 'Recycle Bin empty', 'Tree', 'Sharing', 'Paint', 'Windows', 'Disk', 'Floppy drive', 'Directory open', 'Bitmap document'] as const
export type KitIconName = typeof kitIconNames[number]

export function iconUrl(name: KitIconName, size: 16 | 32 = 16) {
  return numberedIconUrl(kitIconNames.indexOf(name), size)
}
