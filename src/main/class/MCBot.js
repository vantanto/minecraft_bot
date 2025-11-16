import mineflayer from 'mineflayer'
import config from '@/config'
import global from '@/main/global'
import { BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { sendStatusBotUpdated } from '../ipc/bot'

let botArgs = { host: 'localhost', port: 25565, version: '1.20.1' }

class MCBot {
  constructor(username) {
    this.username = username
    this.host = global.SERVER.host
    this.port = global.SERVER.port
    this.version = global.SERVER.version
    this.status = config.BOT_STATUS.DISCONNECTED
    this.bot = null
    this.chatWindow = null
  }

  async initBot() {
    this.bot = mineflayer.createBot({
      username: this.username,
      host: this.host,
      port: this.port,
      version: this.version
    })

    await this.initEvents()
  }

  // Init bot events
  async initEvents() {
    return new Promise((resolve, reject) => {
      this.bot.once('login', () => {
        let botSocket = this.bot._client.socket
        console.log(
          `[${this.username}] Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`
        )
        // resolve('login')
      })

      this.bot.once('spawn', async () => {
        this.setStatus(config.BOT_STATUS.CONNECTED)
        console.log(`[${this.username}] Spawned in`)
        resolve('spawn')
      })

      this.bot.once('end', (reason) => {
        this.setStatus(config.BOT_STATUS.DISCONNECTED)
        console.log(`[${this.username}] Disconnected: ${reason}`)
        reject(reason)
      })

      this.bot.once('error', (err) => {
        this.setStatus(config.BOT_STATUS.UNABLE_CONNECT)
        if (err.code == 'ECONNREFUSED') {
          console.log(`[${this.username}] Failed to connect to ${err.address}:${err.port}`)
        } else {
          console.log(`[${this.username}] Unhandled error: ${err}`)
        }
        reject(err)
      })
    })
  }

  async disconnect() {
    if (this.bot) await this.bot.quit()
    this.setStatus(config.BOT_STATUS.DISCONNECTED)
  }

  getData() {
    return { username: this.username, status: this.status }
  }

  setStatus(status) {
    this.status = status
    sendStatusBotUpdated(this.username, this.status)
  }

  openChatWindow(index) {
    if (this.chatWindow && !this.chatWindow.isDestroyed()) {
      console.log('open exists')
      this.chatWindow.show()
      return this.chatWindow
    }

    const win = new BrowserWindow({
      width: 800,
      height: 500,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })

    win.on('closed', () => {
      this.chatWindow = null
    })

    const route = `/chat/${index}/${this.username}`
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${route}`)
    } else {
      win.loadFile(join(__dirname, '../../renderer/index.html'), { hash: route })
    }

    this.chatWindow = win
    return win
  }

  sendChat(message) {
    this.bot.chat(message)
  }
}

export default MCBot
