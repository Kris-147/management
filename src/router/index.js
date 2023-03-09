import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from '../utils/getToken'
import useLogin from '@/stores/modules/login'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: "/",
        redirect: "/login"
    }, {
        path: "/login",
        component: () =>
            import ("@/views/login/login.vue"),
        name: "login"
    }, {
        path: "/home",
        component: () =>
            import ("@/views/home/home.vue"),
        name: "home"
    }]
})

router.beforeEach(async(to, from, next) => {
    NProgress.start()
    const token = getToken()
    const loginStore = useLogin()
    if (to.path === "/login" || to.path === "/") {
        // NProgress.done()
        next()
    } else {
        if (token) {
            let user = loginStore.getUserInfo()
            if (user.id) {
                // NProgress.done()
                next()
            } else {
                const result = await loginStore.setUserInfo()
                    // NProgress.done()
                next()
            }
            next()
        } else {
            ElMessage({
                    message: "请先登录",
                    type: "warning",
                    center: true
                })
                // NProgress.done()
            next({ path: '/' })
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})

export default router