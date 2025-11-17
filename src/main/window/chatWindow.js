import { is } from '@electron-toolkit/utils'
import { join } from 'path'

import { BrowserWindow } from 'electron'

import { getMcBot } from '../ipc/bot'
import icon from '/resources/icon.png?asset'

let chatWindows = {}

export const getChatWindows = () => {
  return chatWindows
}

export const getBotChatWindow = (username) => {
  return username ? chatWindows[username] : null
}

export const createChatWindow = (username) => {
  let win = getBotChatWindow(username)

  if (win && !win.isDestroyed()) {
    win.show()
  } else {
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

    win.on('closed', () => {
      const mcbot = getMcBot(username)
      mcbot.disableMessageListener()
      win = null
    })

    const route = `/chat/${username}`
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${route}`)
    } else {
      win.loadFile(join(__dirname, '../renderer/index.html'), { hash: route })
    }

    chatWindows[username] = win
  }

  return win
}

export const closeChatWindow = (username) => {
  const win = getBotChatWindow(username)

  if (win && !win.isDestroyed()) {
    win.close()
  }
}
