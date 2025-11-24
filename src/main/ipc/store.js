import { ipcMain } from 'electron'

const Store = require('electron-store').default

const store = new Store()

function getStore(key, defaultValue) {
  return store.get(key, defaultValue)
}

function setStore(key, value) {
  return store.set(key, value)
}

function deleteStore(key) {
  return store.delete(key)
}

function handleGetStore(_event, key, defaultValue) {
  return getStore(key, defaultValue)
}

function handleSetStore(_event, key, value) {
  return setStore(key, value)
}

function handleDeleteStore(_event, key) {
  return deleteStore(key)
}

function handleIpcStore() {
  ipcMain.handle('store:get', handleGetStore)
  ipcMain.handle('store:set', handleSetStore)
  ipcMain.handle('store:delete', handleDeleteStore)
}

export default handleIpcStore
