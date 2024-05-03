// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

const electronHandler = {
    toSeek: (searchQuery: string) => ipcRenderer.invoke('toSeek', [searchQuery]),
    openApp: (app: string) => ipcRenderer.invoke('openApp', [app])
}

contextBridge.exposeInMainWorld('electronHandler', electronHandler)

export type ElectronHandler = typeof electronHandler