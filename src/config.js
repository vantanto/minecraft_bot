const config = {
  APP_NAME: 'Minecraft Bot',
  BOT_STATUS: {
    CONNECTED: 'Connected',
    DISCONNECTED: 'Disconnected',
    UNABLE_CONNECT: 'Unable to Connect',
  },
  RESPONSE_STATUS: {
    SUCCESS: 'success',
    ERROR: 'error',
  },
  getMcAvatar: username => `https://mc-heads.net/avatar/${username}`,
}

export default config
