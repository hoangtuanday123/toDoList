
import { userStore } from '../stores/user'
import { storeToRefs } from 'pinia';
import route from '../router/index'
export function useCurrentuser() {
    const _userStore = userStore()
    const {  userInfo } = storeToRefs(_userStore)
    const info = userInfo
    const hasloggedIn = (): boolean => {
        return !!info && !!info.value?.username
    }
    const logout = async () => {
        if (confirm('Are your sure')) {
            _userStore.clearToken()
            _userStore.clearUserInfo()
            route.push('/')
        }

    }

    return {
        info,
        hasloggedIn,
        logout
    }
}