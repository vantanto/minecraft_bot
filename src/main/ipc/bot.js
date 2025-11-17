import { ipcMain } from 'electron'
import response from './response'
import { updateServerUsernames } from './storage'
import MCBot from '@/main/class/MCBot'
import global from '@/main/global'
import { getMainWindow } from '@/main/window/mainWindow'
import { closeChatWindow, getBotChatWindow } from '@/main/window/chatWindow'

export const getMcBot = (username) => {
  const mcbot = global.BOTS.find((item) => item.username === username)
  if (!(mcbot instanceof MCBot))
    throw new TypeError('Inconsistent types: bot and MCBot must be of the same type.')

  return mcbot
}

const handleGetBot = (_event, username) => {
  const mcbot = getMcBot(username)
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

const handleConnectBot = async (_event, username) => {
  try {
    const mcbot = getMcBot(username)
    await mcbot.initBot()
    return response.success('Connected')
  } catch (err) {
    return response.error(err)
  }
}

const handleDisconnectBot = async (_event, username) => {
  try {
    const mcbot = getMcBot(username)
    await mcbot.disconnect()
    return response.success('Disconnected')
  } catch (err) {
    return response.error(err)
  }
}

const handleDeleteBot = async (_event, username) => {
  try {
    const mcbot = getMcBot(username)
    await mcbot.disconnect()
    closeChatWindow(username)
    global.BOTS.splice(username, 1)
    await updateServerUsernames()
    return response.success('Deleted')
  } catch (err) {
    return response.error(err)
  }
}

const onOpenChatBot = (_event, username) => {
  const mcbot = getMcBot(username)
  mcbot.openChatWindow(username)
}

const onSendChatBot = (_event, username, message) => {
  console.log(username)
  const mcbot = getMcBot(username)
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
