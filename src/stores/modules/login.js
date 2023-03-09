import { defineStore } from 'pinia'

const useLogin = defineStore("login", {
    state() {
        return {
            userInfo: {
                id: null,
                username: null
            }
        }
    },
    actions: {
        async setUserInfo() {
            this.userInfo.id = await 1
            this.username = await "admin"
        }
    },
    getters: {
        getUserInfo() {
            return state.userInfo
        }
    }
})

export default useLogin