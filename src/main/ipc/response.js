import config from '@/config'

const response = {
  success: (message, data = null) => {
    return { status: config.RESPONSE_STATUS.SUCCESS, message: message.toString(), data }
  },
  error: (message, data = null) => {
    return { status: config.RESPONSE_STATUS.ERROR, message: message.toString(), data }
  }
}

export default response
