import { toast, type ToastOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export function useToast() {
  const notify = (msg: string, type = 'default', duration = 3000) => {
    let toastType = ''
    switch (type) {
      case 'success':
        toastType = toast.TYPE.SUCCESS
        break
      case 'error':
        toastType = toast.TYPE.ERROR
        break
      case 'warning':
        toastType = toast.TYPE.WARNING
        break
      case 'info':
        toastType = toast.TYPE.INFO
        break
      default:
        toastType = toast.TYPE.DEFAULT
        break
    }

    toast(msg, {
      autoClose: duration,
      position: toast.POSITION.BOTTOM_CENTER,
      hideProgressBar: true,
      type: toastType,
      theme: 'colored',
      transition: toast.TRANSITIONS.SLIDE
    } as ToastOptions)
  }

  return {
    notify
  }
}
