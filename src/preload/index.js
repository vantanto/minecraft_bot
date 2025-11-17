import { electronAPI } from '@electron-toolkit/preload'

import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {}

api.getVersion = () => ipcRenderer.invoke('app:get-version')
api.bot = {
  getBot: (username) => ipcRenderer.invoke('bot:get-bot', username),
  getBots: () => ipcRenderer.invoke('bot:get-bots'),
  createBot: (username) => ipcRenderer.invoke('bot:create-bot', username),
  connectBot: async (username) =>
    await ipcRenderer.invoke('bot:connect-bot', username),
  disconnectBot: async (username) =>
    await ipcRenderer.invoke('bot:disconnect-bot', username),
  deleteBot: async (username) =>
    await ipcRenderer.invoke('bot:delete-bot', username),
  openChatBot: (username) => ipcRenderer.send('bot:open-chat-bot', username),
  sendChatBot: (username, message) =>
    ipcRenderer.send('bot:send-chat-bot', username, message),

  onStatusBotUpdated: (username, callback) =>
    ipcRenderer.on(`bot-${username}:status-bot-updated`, (_event, status) =>
      callback(status),
    ),
  onMessageBotReceived: (username, callback) =>
    ipcRenderer.on(`bot-${username}:message-bot-received`, (_event, message) =>
      callback(message),
    ),
}
api.storage = {
  getServer: () => ipcRenderer.invoke('storage:get-server'),
  getServers: () => ipcRenderer.invoke('storage:get-servers'),
  setServer: (data) => ipcRenderer.invoke('storage:set-server', data),
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
