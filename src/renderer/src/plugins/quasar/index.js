import { Notify, Quasar } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const quasar = {
  install(app) {
    app.use(Quasar, {
      plugins: {
        Notify,
      },
      config: {
        notify: {
          position: 'top',
          timeout: 3000,
          classes: 'q-py-xs',
        },
      },
    })
  },
}

export default quasar
