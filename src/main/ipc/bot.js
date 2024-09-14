import { ipcMain } from 'electron'
import mineflayer from 'mineflayer'
import response from './response'
import MCBot from '../class/MCBot'

let bots = []

const getMcBot = (index) => {
  const mcbot = bots[index]
  if (!(mcbot instanceof MCBot))
    throw new TypeError('Inconsistent types: bot and MCBot must be of the same type.')

  return mcbot
}

const handleGetBots = (_event) => {
  const mcbotData = bots.map((mcbot) => mcbot.getData())
  return response.success('Success', mcbotData)
}

const handleCreateBot = async (_event, username) => {
  try {
    if (bots.findIndex((item) => item.username === username) !== -1)
      throw new Error('Username already exists')

    const webContents = _event.sender
    const mcbot = new MCBot(webContents, username)
    await mcbot.initBot()
    bots.push(mcbot)
    return response.success('Bot Created')
  } catch (err) {
    return response.error(err)
  }
}

const handleGetBot = (_event, index) => {
  const mcbot = getMcBot(index)
  return response.success('Success', mcbot.getData())
}

const handleConnectBot = async (_event, index) => {
  try {
    const mcbot = getMcBot(index)
    await mcbot.initBot()
    return response.success('Connected')
  } catch (err) {
    return response.error(err)
  }
}

const handleDisconnectBot = async (_event, index) => {
  try {
    const mcbot = getMcBot(index)
    await mcbot.disconnectBot()
    return response.success('Disconnected')
  } catch (err) {
    return response.error(err)
  }
}

const handleIpcBot = () => {
  ipcMain.handle('bot:get-bot', handleGetBot)
  ipcMain.handle('bot:get-bots', handleGetBots)
  ipcMain.handle('bot:create-bot', handleCreateBot)
  ipcMain.handle('bot:connect-bot', handleConnectBot)
  ipcMain.handle('bot:disconnect-bot', handleDisconnectBot)
}

export default handleIpcBot
