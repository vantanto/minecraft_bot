import config from '../../config'

const response = {
  success: (message, data = null) => {
    return { status: config.RESPONSE_STATUS.SUCCESS, message, data }
  },
  error: (message, data = null) => {
    return { status: config.RESPONSE_STATUS.ERROR, message, data }
  }
}

export default response
