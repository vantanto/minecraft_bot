import { ipcMain } from 'electron'
import Storage from 'electron-json-storage'
import MCBot from '@/main/class/MCBot'
import global from '@/main/global'
import response from './response'

const storage = Storage
const KEYS = {
  SERVERS: 'servers',
}

function getStorage(key) {
  return storage.getSync(key)
}

function getServers() {
  return getStorage(KEYS.SERVERS)
}

// async function hasStorage(key) {
//   return new Promise(resolve => storage.has(key, hasKey => resolve(hasKey)))
// }

async function setStorage(key, data) {
  return new Promise(resolve => storage.set(key, data, () => resolve(data)))
}

export async function updateServerUsernames() {
  const servers = getServers()
  servers[global.SERVER.host].usernames = global.BOTS.map(
    item => item.username,
  )

  await setStorage(KEYS.SERVERS, servers)
}

async function handleGetServer(_event) {
  const server = global.SERVER
  return response.success('Success', server)
}

async function handleGetServers(_event) {
  const servers = getServers()
  return response.success('Success', servers)
}

async function handleSetServer(_event, data) {
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

function handleIpcStorage() {
  ipcMain.handle('storage:get-server', handleGetServer)
  ipcMain.handle('storage:get-servers', handleGetServers)
  ipcMain.handle('storage:set-server', handleSetServer)
}

export default handleIpcStorage
