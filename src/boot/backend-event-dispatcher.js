import { listen } from '@tauri-apps/api/event'
import { Notify } from 'quasar'


export default function ({ store }) {
  // initialize default event handler
  listen('state-update', (event) => {
    let message = event.payload
    const action = `${message.store}/${message.action}`
    store.dispatch(action, message.data)
  })

  listen('backend-error', async (event) => {
    let message = event.payload
    Notify.create({
      message: message,
      color: 'negative',
      textColor: 'dark',
      icon: 'warning'
    })
  })
}