import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import { Quasar, Notify } from 'quasar'

const quasar = {
  install(app) {
    app.use(Quasar, {
      plugins: {
        Notify
      },
      config: {
        notify: {
          position: 'top',
          timeout: 3000,
          classes: 'q-py-xs'
        }
      }
    })
  }
}

export default quasar
