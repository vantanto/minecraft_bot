import { join } from 'node:path'
import process from 'node:process'
import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import { getMcBot } from '../ipc/bot'
import icon from '/resources/icon.png?asset'

const chatWindows = {}

export function getChatWindows() {
  return chatWindows
}

export function getValidChatWindow(username) {
  const win = username ? chatWindows[username] : null
  return win && !win.isDestroyed() ? win : null
}

export function existsChatWindow(username) {
  return !!getValidChatWindow(username)
}

export function createChatWindow(username) {
  let win = getValidChatWindow(username)

  if (win) {
    win.show()
    return win
  }

  // Create new window
  win = new BrowserWindow({
    width: 800,
    height: 500,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  win.once('closed', () => {
    const mcbot = getMcBot(username)
    mcbot.disableMessageListener()
    delete chatWindows[username]
  })

  const route = `/chat/${username}`
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(`${process.env.ELECTRON_RENDERER_URL}#${route}`)
  }
  else {
    win.loadFile(join(__dirname, '../renderer/index.html'), { hash: route })
  }

  chatWindows[username] = win
  return win
}

export function closeChatWindow(username) {
  const win = getValidChatWindow(username)
  if (!win)
    return Promise.resolve()

  return new Promise((resolve) => {
    win.once('closed', () => {
      resolve()
    })

    win.close()
  })
}
