import { ipcMain, BrowserWindow } from 'electron'

export interface ThermalPrintOptions {
  silent?: boolean
  printBackground?: boolean
  deviceName?: string
  copies?: number
}

export function registerPrintHandlers() {
  ipcMain.handle('print-receipt', async (event, htmlContent: string, options?: ThermalPrintOptions) => {
    try {
      const printWindow = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
      })

      // Load thermal receipt HTML content into hidden window
      await printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`)

      return new Promise((resolve) => {
        printWindow.webContents.on('did-finish-load', () => {
          printWindow.webContents.print(
            {
              silent: options?.silent ?? true,
              printBackground: options?.printBackground ?? true,
              deviceName: options?.deviceName ?? '',
              copies: options?.copies ?? 1,
            },
            (success, failureReason) => {
              printWindow.close()
              if (success) {
                resolve({ success: true })
              } else {
                resolve({ success: false, error: failureReason })
              }
            }
          )
        })
      })
    } catch (error: any) {
      console.error('Thermal print error:', error)
      return { success: false, error: error.message || 'فشلت عملية الطباعة' }
    }
  })

  ipcMain.handle('get-printers', async () => {
    try {
      const window = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]
      if (!window) return []
      const printers = await window.webContents.getPrintersAsync()
      return printers
    } catch (error) {
      console.error('Error fetching printers:', error)
      return []
    }
  })
}
