import type { ListItem } from './collectionModel'
export const dialogFiles: ListItem[] = [
  'Figure 07 - Task bar.bmp', 'Figure 08 - Old File Open.bmp', 'Figure 09 - New File Open.bmp',
  'Figure 10 - Old Printer Setup.bmp', 'Figure 11 - Help Contents.bmp', 'Figure 12 - Help Search.bmp',
  'Figure 13 - Help Index.bmp', 'Figure 14 - Sample Database.bmp', 'Figure 15 - Sample Database.bmp',
  'Figure 16 - Control Panel.bmp', 'Figure 17 - Display Settings.bmp', 'Figure 18 - My Computer.bmp',
].map(label => ({ label, icon: 'Bitmap document' }))
