import mineflayer from 'mineflayer'
import config from '@/config'
import global from '@/main/global'
import { sendMessageBotReceived, sendStatusBotUpdated } from '@/main/ipc/bot'
import { createChatWindow, existsChatWindow } from '@/main/window/chatWindow'

class MCBot {
  constructor(username) {
    this.username = username
    this.host = global.SERVER.host
    this.port = global.SERVER.port
    this.version = global.SERVER.version
    this.status = config.BOT_STATUS.DISCONNECTED
    this.bot = null
    this.messageListener = false
  }

  async initBot() {
    this.bot = mineflayer.createBot({
      username: this.username,
      host: this.host,
      port: this.port,
      version: this.version,
    })

    await this.initEvents()
  }

  // Init bot events
  async initEvents() {
    return new Promise((resolve, reject) => {
      this.bot.once('login', () => {
        this.setStatus(config.BOT_STATUS.CONNECTED)
        resolve('login')
      })

      this.bot.once('spawn', async () => {
        // this.setStatus(config.BOT_STATUS.CONNECTED)
        resolve('spawn')
      })

      this.bot.once('end', (reason) => {
        this.setStatus(config.BOT_STATUS.DISCONNECTED)
        reject(reason)
      })

      this.bot.once('error', (err) => {
        this.setStatus(config.BOT_STATUS.UNABLE_CONNECT)
        reject(err)
      })
    })
  }

  async disconnect() {
    if (this.bot)
      this.bot.quit()
    // this.setStatus(config.BOT_STATUS.DISCONNECTED)
  }

  getData() {
    return { username: this.username, status: this.status }
  }

  setStatus(status) {
    this.status = status
    sendStatusBotUpdated(this.username, this.status)

    if (existsChatWindow(this.username))
      this.enableMessageListener()

    if (this.status !== config.BOT_STATUS.CONNECTED)
      this.disableMessageListener()
  }

  openChatWindow() {
    createChatWindow(this.username)
    this.enableMessageListener()
  }

  sendChat(message) {
    this.bot.chat(message)
  }

  messageHandler(message) {
    sendMessageBotReceived(this.username, message)
  }

  enableMessageListener() {
    if (this.status !== config.BOT_STATUS.CONNECTED || this.messageListener)
      return
    this.bot.on('message', this.messageHandler)
    this.messageListener = true
  }

  disableMessageListener() {
    if (!this.messageListener)
      return
    this.bot.off('message', this.messageHandler)
    this.messageListener = false
  }
}

export default MCBot
