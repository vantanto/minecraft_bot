import { ipcMain } from 'electron'
import Storage from 'electron-json-storage'
import response from './response'
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

const hasStorage = async (key) => {
  return new Promise((resolve) => storage.has(key, (hasKey) => resolve(hasKey)))
}

const setStorage = async (key, data) => {
  return new Promise((resolve) => storage.set(key, data, () => resolve(data)))
}

export const updateServerUsernames = async () => {
  const servers = getServers()
  servers[global.SERVER.host].usernames = global.BOTS.map((item) => item.username)

  await setStorage(KEYS.SERVERS, servers)
}

const handleGetServer = async (_event) => {
  const server = global.SERVER
  return response.success('Success', server)
}

const handleGetServers = async (_event) => {
  const servers = getServers()
  return response.success('Success', servers)
}

const handleSetServer = async (_event, data) => {
  const servers = getServers()
  const usernames = servers[data.host]?.usernames || []
  servers[data.host] = { ...data, usernames }

  await setStorage(KEYS.SERVERS, servers)

  global.SERVER = data
  global.BOTS = usernames.map((username) => {
    const mcbot = new MCBot(username)
    return mcbot
  })
}

const handleIpcStorage = () => {
  ipcMain.handle('storage:get-server', handleGetServer)
  ipcMain.handle('storage:get-servers', handleGetServers)
  ipcMain.handle('storage:set-server', handleSetServer)
}

export default handleIpcStorage
