import { BrowserWindow } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

let chatWindows = {}

export const createChatWindow = (index, username) => {
  if (!username) return

  let win = chatWindows[username]

  if (win && !win.isDestroyed()) {
    console.log('exists')
    win.show()
  } else {
    win = new BrowserWindow({
      width: 800,
      height: 500,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, '../../preload/index.js'),
        sandbox: false
      }
    })

    win.on('closed', () => {
      win = null
    })

    const route = `/chat/${index}/${username}`
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#${route}`)
    } else {
      win.loadFile(join(__dirname, '../../../renderer/index.html'), { hash: route })
    }

    chatWindows[username] = win
  }

  return win
}
