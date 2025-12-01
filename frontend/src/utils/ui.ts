import { Notify } from 'quasar'
export function success(message: string) {
    Notify.create({ message: message, color: 'green', position: 'top', icon: 'check', timeout: 1500 })
}

export function error(message: string) {
    Notify.create({ message: message, color: 'red', position: 'top', icon: 'error', timeout: 1500 })
}