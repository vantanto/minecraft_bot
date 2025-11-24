import { app, ipcMain } from 'electron'
import handleIpcBot from './bot.js'
import handleIpcStorage from './storage.js'
import handleIpcStore from './store.js'

function handleIpcMain() {
  // ipcMain.on('ping', () => console.log('pong'))
  ipcMain.handle('app:get-version', () => app.getVersion())
  handleIpcBot()
  handleIpcStorage()
  handleIpcStore()
}

export default handleIpcMain
