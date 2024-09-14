import { app, ipcMain } from 'electron'
import handleIpcBot from './bot.js'

const handleIpcMain = () => {
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.handle('app:get-version', () => app.getVersion())
  handleIpcBot()
}

export default handleIpcMain
