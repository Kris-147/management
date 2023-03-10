import { defineStore } from 'pinia'

const useLogin = defineStore("login", {
    state() {
        return {
            // userInfo: {
            //     id: null,
            //     username: null
            // }
        }
    },
    actions: {
        // async setUserInfo() {

        // }
    },
    getters: {
        // getUserInfo(state) {
        //     return state.userInfo
        // }
    }
})

export default useLogin