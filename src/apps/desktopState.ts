import type { AppWindow, DesktopApps, AppId } from './model'
export type DesktopState = { windows: AppWindow[]; apps: DesktopApps; startOpen: boolean; clock: string; pressed: { app: AppId | null; id: string } | null; editingAddress: boolean }
