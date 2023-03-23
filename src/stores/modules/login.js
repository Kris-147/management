import { defineStore } from 'pinia'

const useLogin = defineStore("login", {
    state() {
        return {
            userInfo: {
                userId: undefined,
                username: undefined
            }
        }
    },
    actions: {},
    getters: {},
    persist: {
        enabled: true
    }
})

export default useLogin