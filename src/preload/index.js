import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

api.getVersion = () => ipcRenderer.invoke('app:get-version')
api.bot = {
  getBots: () => ipcRenderer.invoke('bot:get-bots'),
  createBot: (username) => ipcRenderer.invoke('bot:create-bot', username),
  getBot: (index) => ipcRenderer.invoke('bot:get-bot', index),
  connectBot: async (index) => await ipcRenderer.invoke('bot:connect-bot', index),
  disconnectBot: async (index) => await ipcRenderer.invoke('bot:disconnect-bot', index),
  onStatusBotUpdated: (callback) =>
    ipcRenderer.on('bot:status-bot-updated', (_event, status) => callback(status))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
