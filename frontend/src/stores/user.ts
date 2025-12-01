import { defineStore } from 'pinia'
// Define or import the User type
interface User {
    id: number;
    username: string;
    permissions: string[];
}

export const userStore = defineStore('userStore', {
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        authToken: localStorage.getItem('authToken'),
        userInfo: JSON.parse(localStorage.getItem('userInfo')) as User,
    }),
    actions: {
        saveToken(token: string) {
            // update pinia state
            this.authToken = token

            localStorage.setItem('authToken', token)
        },
        clearToken() {
            this.authToken = null;
            localStorage.removeItem('authToken')
        },
        saveUserInfo(user: User) {
            // update pinia state
            this.userInfo = user

            localStorage.setItem('userInfo', JSON.stringify(user))
        },
        clearUserInfo() {
            // update pinia state
            this.userInfo = null

            localStorage.removeItem('userInfo')
        },

    }
});