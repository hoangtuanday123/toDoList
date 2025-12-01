
import { userStore } from '../stores/user'
import { storeToRefs } from 'pinia';
import route from '../router/index'
import api from '../services/api'
export function useCurrentuser() {
    const _userStore = userStore()
    const { authToken, userInfo } = storeToRefs(_userStore)
    const info = userInfo
    const hasloggedIn = (): boolean => {
        return !!info && !!info.value?.username
    }
    // function hasPermission (permission: string) : boolean {
    //     return info.value?.permissions.indexOf(permission) >= 0;
    // }

    function hasRole(role: string): boolean {
        console.log(info.value)
        return info.value?.permissions.indexOf(role) >= 0;
    }
    const logout = async () => {
        if (confirm('Are your sure')) {
            await api.api.auth.logout({ token: authToken.value })
            _userStore.clearToken()
            _userStore.clearUserInfo()
            route.push('/')
        }

    }

    return {
        info,
        hasloggedIn,
        hasRole,
        logout
    }
}