import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

api.getVersion = () => ipcRenderer.invoke('app:get-version')
api.bot = {
  getBot: (index) => ipcRenderer.invoke('bot:get-bot', index),
  getBots: () => ipcRenderer.invoke('bot:get-bots'),
  createBot: (username) => ipcRenderer.invoke('bot:create-bot', username),
  connectBot: async (index) => await ipcRenderer.invoke('bot:connect-bot', index),
  disconnectBot: async (index) => await ipcRenderer.invoke('bot:disconnect-bot', index),
  deleteBot: async (index) => await ipcRenderer.invoke('bot:delete-bot', index),
  onStatusBotUpdated: (callback) =>
    ipcRenderer.on('bot:status-bot-updated', (_event, username, status) =>
      callback(username, status)
    )
}
api.storage = {
  getServer: () => ipcRenderer.invoke('storage:get-server'),
  getServers: () => ipcRenderer.invoke('storage:get-servers'),
  setServer: (data) => ipcRenderer.invoke('storage:set-server', data)
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
