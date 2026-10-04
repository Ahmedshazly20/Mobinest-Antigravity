export interface ElectronAPI {
  printReceipt: (
    htmlContent: string,
    options?: { silent?: boolean; printBackground?: boolean; deviceName?: string; copies?: number }
  ) => Promise<{ success: boolean; error?: string }>
  getPrinters: () => Promise<Array<{ name: string; isDefault: boolean }>>
  getAppVersion: () => Promise<string>
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
}

declare global {
  interface Window {
    electron?: ElectronAPI
  }
}
