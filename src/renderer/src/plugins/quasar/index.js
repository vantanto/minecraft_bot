import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import { Quasar } from 'quasar'

const quasar = {
  install(app) {
    app.use(Quasar, {
      plugins: {}
    })
  }
}

export default quasar
