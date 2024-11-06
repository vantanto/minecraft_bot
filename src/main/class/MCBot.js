import mineflayer from 'mineflayer'
import config from '@/config'
import global from '@/main/global'

let botArgs = {
  host: 'localhost',
  port: 25565,
  version: '1.20.1'
}

class MCBot {
  constructor(webContents, username) {
    this.webContents = webContents
    this.username = username
    this.host = global.SERVER.host
    this.port = global.SERVER.port
    this.version = global.SERVER.version
    this.status = config.BOT_STATUS.DISCONNECTED
    this.bot = null
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
        resolve('login')
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

  async disconnectBot() {
    await this.bot.quit()
    this.setStatus(config.BOT_STATUS.DISCONNECTED)
  }

  getData() {
    return {
      username: this.username,
      status: this.status
    }
  }

  setStatus(status) {
    this.status = status
    this.webContents.send('bot:status-bot-updated', this.username, this.status)
  }
}

export default MCBot
