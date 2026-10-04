import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use IPC safely
contextBridge.exposeInMainWorld('electron', {
  printReceipt: (htmlContent: string, options?: any) =>
    ipcRenderer.invoke('print-receipt', htmlContent, options),
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
})
