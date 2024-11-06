import { ipcMain } from 'electron'
import Storage from 'electron-json-storage'
import global from '@/main/global'
import MCBot from '@/main/class/MCBot'

const storage = Storage
const KEYS = {
  SERVERS: 'servers'
}

const getStorage = (key) => {
  return storage.getSync(key)
}

const getServers = () => {
  return getStorage(KEYS.SERVERS)
}

export const getServerBotUsernames = () => {
  const servers = getServers()
  return servers[global.SERVER.host].bots
}

const hasStorage = async (key) => {
  return new Promise((resolve) => storage.has(key, (hasKey) => resolve(hasKey)))
}

const setStorage = async (key, data) => {
  return new Promise((resolve) => storage.set(key, data, () => resolve(data)))
}

export const saveServerBotUsernames = async () => {
  const servers = getServers()
  servers[global.SERVER.host].bots = global.BOTS.map((item) => item.username)

  await setStorage(KEYS.SERVERS, servers)
}

const handleGetAllServer = async (_event) => {
  return getServers()
}

const handleGetServer = async (_event) => {
  return global.SERVER
}

const handleSetServer = async (_event, data) => {
  const webContents = _event.sender
  const servers = getServers()
  const bots = servers[data.host]?.bots || []
  servers[data.host] = { ...data, bots }

  await setStorage(KEYS.SERVERS, servers)

  global.SERVER = data
  global.BOTS = bots.map((username) => {
    const mcbot = new MCBot(webContents, username)
    return mcbot
  })
}

const handleIpcStorage = () => {
  ipcMain.handle('storage:get-server', handleGetServer)
  ipcMain.handle('storage:set-server', handleSetServer)
}

export default handleIpcStorage
