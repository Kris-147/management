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
            redirect: "/home",
            meta: {
                requireToken: false
            }
        }, {
            path: "/home",
            component: () =>
                import ("@/views/userHome/userHome.vue"),
            name: "userHome",
            meta: {
                requireToken: false
            },
            children: [{
                    path: "/home",
                    redirect: '/home/courseintro'
                },
                {
                    path: "courseintro",
                    component: () =>
                        import ("@/views/courseIntro/courseIntro.vue"),
                    name: "courseIntro",
                    mete: {
                        requireToken: false,
                        documentTitle: "首页"
                    }
                },
                {
                    path: "knowledgemap",
                    component: () =>
                        import ("@/views/knowledgeMap/knowledgeMap.vue"),
                    name: "knowledgeMap",
                    meta: {
                        requireToken: false,
                        documentTitle: "知识图谱"
                    }
                },
                {
                    path: "course/:kid",
                    component: () =>
                        import ("@/views/learnCourse/learnCourse.vue"),
                    name: "learnCourse",
                    meta: {
                        requireToken: false
                    }
                },
                {
                    path: "myfavor",
                    component: () =>
                        import ("@/views/myFavor/myFavor.vue"),
                    name: "myFavor",
                    meta: {
                        requireToken: true,
                        documentTitle: "我的收藏"
                    }
                }
            ]
        },
        {
            path: "/adminlogin",
            component: () =>
                import ("@/views/login/login.vue"),
            name: "adminlogin",
            meta: {
                requireToken: false,
                documentTitle: "管理员登录"
            }
        },
        {
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
                        title: "用户信息管理",
                        documentTitle: "用户信息管理"
                    }
                }, {
                    path: "messageManage",
                    component: () =>
                        import ("@/views/messageManage/messageManage.vue"),
                    name: "messageManage",
                    meta: {
                        title: "用户意见管理",
                        documentTitle: "用户意见管理"
                    }
                }, {
                    path: "chapterManage",
                    component: () =>
                        import ("@/views/chapterManage/chapterManage.vue"),
                    name: "chapterManage",
                    meta: {
                        title: "章节管理",
                        documentTitle: "章节管理"
                    }
                }, {
                    path: "sectionManage",
                    component: () =>
                        import ("@/views/sectionManage/sectionManage.vue"),
                    name: "sectionManage",
                    meta: {
                        title: "知识点内容管理",
                        documentTitle: "知识点内容管理"
                    }
                }, {
                    path: "politicsManage",
                    component: () =>
                        import ("@/views/politicsManage/politicsManage.vue"),
                    name: "politicsManage",
                    meta: {
                        title: "思政素材管理",
                        documentTitle: "思政素材管理"
                    }
                },
                {
                    path: "mapManage",
                    component: () =>
                        import ("@/views/mapManage/mapManage.vue"),
                    name: "mapManage",
                    meta: {
                        title: "知识图谱管理",
                        documentTitle: "知识图谱管理"
                    }
                }
            ]
        },
        {
            path: "/:pathMatch(.*)",
            component: () =>
                import ("@/views/NotFound/NotFound.vue"),
            meta: {
                documentTitle: "页面不存在"
            }
        }
    ]
})

router.beforeEach(async(to, from, next) => {
    NProgress.start()
    const token = getToken()
    const loginStore = useLogin()
    if (to.meta.requireToken == false) {
        if (to.meta.documentTitle) {
            document.title = to.meta.documentTitle
        }
        next()
    } else {
        if (token) {
            if (to.meta.documentTitle) {
                document.title = to.meta.documentTitle
            }
            next()
        } else {
            ElMessage({
                message: "请先登录",
                type: "warning",
                center: true
            })
            next({ path: '/' })
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})

export default router