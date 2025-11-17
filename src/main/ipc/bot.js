import { ipcMain } from 'electron'
import response from './response'
import { updateServerUsernames } from './storage'
import MCBot from '@/main/class/MCBot'
import global from '@/main/global'
import { getMainWindow } from '@/main/window/mainWindow'
import { closeChatWindow, getBotChatWindow } from '@/main/window/chatWindow'

export const getMcBot = (index) => {
  const mcbot = global.BOTS[index]
  if (!(mcbot instanceof MCBot))
    throw new TypeError('Inconsistent types: bot and MCBot must be of the same type.')

  return mcbot
}

const handleGetBot = (_event, index) => {
  const mcbot = getMcBot(index)
  return response.success('Success', mcbot.getData())
}

const handleGetBots = (_event) => {
  const mcbotData = global.BOTS.map((mcbot) => mcbot.getData())
  return response.success('Success', mcbotData)
}

const handleCreateBot = async (_event, username) => {
  try {
    if (global.BOTS.findIndex((item) => item.username === username) !== -1)
      throw new Error('Username already exists')

    const mcbot = new MCBot(username)
    await mcbot.initBot()
    global.BOTS.push(mcbot)
    await updateServerUsernames()
    return response.success('Bot Created')
  } catch (err) {
    return response.error(err)
  }
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
    await mcbot.disconnect()
    return response.success('Disconnected')
  } catch (err) {
    return response.error(err)
  }
}

const handleDeleteBot = async (_event, index) => {
  try {
    const mcbot = getMcBot(index)
    await mcbot.disconnect()
    closeChatWindow(mcbot.username)
    global.BOTS.splice(index, 1)
    await updateServerUsernames()
    return response.success('Deleted')
  } catch (err) {
    return response.error(err)
  }
}

const onOpenChatBot = (_event, index) => {
  const mcbot = getMcBot(index)
  mcbot.openChatWindow(index)
}

const onSendChatBot = (_event, index, message) => {
  const mcbot = getMcBot(index)
  mcbot.sendChat(message)
}

const handleIpcBot = () => {
  ipcMain.handle('bot:get-bot', handleGetBot)
  ipcMain.handle('bot:get-bots', handleGetBots)
  ipcMain.handle('bot:create-bot', handleCreateBot)
  ipcMain.handle('bot:connect-bot', handleConnectBot)
  ipcMain.handle('bot:disconnect-bot', handleDisconnectBot)
  ipcMain.handle('bot:delete-bot', handleDeleteBot)
  ipcMain.on('bot:open-chat-bot', onOpenChatBot)
  ipcMain.on('bot:send-chat-bot', onSendChatBot)
}

export const sendStatusBotUpdated = (username, status) => {
  const mainWindow = getMainWindow()
  mainWindow.webContents.send(`bot-${username}:status-bot-updated`, status)
}

export const sendMessageBotReceived = (username, message) => {
  const chatWindow = getBotChatWindow(username)
  if (chatWindow) {
    chatWindow.webContents.send(`bot-${username}:message-bot-received`, message.toString())
  }
}

export default handleIpcBot
