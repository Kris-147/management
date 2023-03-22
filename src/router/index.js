import { createRouter, createWebHashHistory } from 'vue-router'
import { getToken } from '../utils/getToken'
import { getUserId } from '../utils/getUserId'
import useLogin from '@/stores/modules/login'
// import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: "/",
        redirect: "/home"
    }, {
        path: "/home",
        component: () =>
            import ("@/views/userHome/userHome.vue"),
        name: "userHome"
    }, {
        path: "/adminlogin",
        component: () =>
            import ("@/views/login/login.vue"),
        name: "adminlogin"
    }, {
        path: "/admin",
        component: () =>
            import ("@/views/home/home.vue"),
        name: "admin",
        meta: {
            title: "首页"
        },
        children: [{
            path: "/admin",
            redirect: "/admin/userManage"
        }, {
            path: "userManage",
            component: () =>
                import ("@/views/userManage/userManage.vue"),
            name: "userManage",
            meta: {
                title: "用户管理"
            }
        }, {
            path: "messageManage",
            component: () =>
                import ("@/views/messageManage/messageManage.vue"),
            name: "messageManage",
            meta: {
                title: "消息管理"
            }
        }, {
            path: "chapterManage",
            component: () =>
                import ("@/views/chapterManage/chapterManage.vue"),
            name: "chapterManage",
            meta: {
                title: "章节管理"
            }
        }, {
            path: "sectionManage",
            component: () =>
                import ("@/views/sectionManage/sectionManage.vue"),
            name: "sectionManage",
            meta: {
                title: "内容管理"
            }
        }]
    }, {
        path: "/:pathMatch(.*)",
        component: () =>
            import ("@/views/NotFound/NotFound.vue")
    }]
})

router.beforeEach(async(to, from, next) => {
    NProgress.start()
        // next()
    const token = getToken()
    const loginStore = useLogin()
    if (to.path === "/login" || to.path === "/") {
        // NProgress.done()
        next()
    } else {
        if (token) {
            // let userid = getUserId()
            // if (userid) {
            //     // NProgress.done()
            //     next()
            // } else {
            //     const result = await loginStore.setUserInfo()
            //         // NProgress.done()
            //     next()
            // }
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