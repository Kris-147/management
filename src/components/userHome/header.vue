<template>
    <div class="header">
        <div class="title" @click="gohome">
            软件测试技术思政教学网站
        </div>
        <ul class="menus">
            <li :class="{ active: homePage }" @click="changeActive('home')">首页</li>
            <li :class="{ mapactive: mapPage }" @click="changeActive('map')">知识图谱</li>
        </ul>
        <div class="status">
            <div class="login" v-if="islogin == false">
                <div class="loginBtn" @click="gologin">登录</div>
                <div class="regBtn" @click="goreg">注册</div>
            </div>
            <div class="showname" v-else>
                <el-dropdown>
                    <div class="block">
                        <div class="ava">
                            <el-icon>
                                <Avatar />
                            </el-icon>
                        </div>
                        <div class="name">{{ username }}</div>
                    </div>

                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="goMyFavor">我的收藏</el-dropdown-item>
                            <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter,useRoute } from 'vue-router'
import { ref } from 'vue'
import useLogin from '@/stores/modules/login'
import {
    Avatar
} from '@element-plus/icons-vue'
import { deleteToken } from '@/utils/DeleteToken'

const homePage = ref(true)
const mapPage = ref(false)
const router = useRouter()
const route = useRoute()

const loginStore = useLogin()
const islogin = ref(false)
const username = ref("")
const setinfo = (isl, un) => {
    islogin.value = isl
    username.value = un
}

const changeActive = (page) => {
    if (page == 'home') {
        homePage.value = true
        mapPage.value = false
        document.title = "首页"
        router.push("/")
    } else if (page == 'map') {
        homePage.value = false
        mapPage.value = true
        document.title = "知识图谱"
        router.push('/home/knowledgemap')
    }
}
const emit = defineEmits(['tologin', 'toreg', 'logout'])
const gologin = () => {
    emit('tologin')
}
const goreg = () => {
    emit('toreg')
}


defineExpose({
    setinfo
})

if (loginStore.userInfo.username && loginStore.userInfo.userId) {
    islogin.value = true
    username.value = loginStore.userInfo.username
}

const logout = () => {
    deleteToken()
    loginStore.userInfo.username = ""
    loginStore.userInfo.userId = ""
    username.value = ""
    islogin.value = false
    if(route.meta.requireToken == true){
        document.title = "首页"
        router.replace("/")
        return;
    }
    document.title = "首页"
    emit('logout')
}

const goMyFavor = () => {
    router.push("/home/myfavor")
}

const gohome = () => {
    homePage.value = true
    mapPage.value = false
    router.push("/")
}
</script>

<style scoped>
.header {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    position: fixed;
    background-color: #fff;
    z-index: 2000;
}

.title {
    width: 290px;
    margin-left: 50px;
    margin-right: 90px;
    cursor: pointer;
    font-size: 24px;
    font-weight: 600;
}

.menus {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    position: relative;
}

.menus li {
    margin-right: 32px;
    cursor: pointer;
}

.menus .active {
    color: rgb(23, 105, 254);
}

.menus .mapactive {
    color: rgb(23, 105, 254);
}

.menus .active::after {
    content: "";
    display: block;
    position: absolute;
    bottom: -5px;
    height: 3px;
    border-radius: 1.5px;
    width: 32px;
    background-color: rgb(23, 105, 254);
}

.menus .mapactive::after {
    content: "";
    display: block;
    position: absolute;
    bottom: -5px;
    height: 3px;
    border-radius: 1.5px;
    width: 64px;
    background-color: rgb(23, 105, 254);
}

.status {
    width: 300px;
    padding-left: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.loginBtn {
    margin-left: 60px;
    cursor: pointer;
    display: inline-block;
    width: 40px;
    height: 30px;
    line-height: 30px;
    background-color: rgb(23, 105, 254);
    color: white;
    border-radius: 20px;
    padding: 5px 30px;
    text-align: center;
}

.regBtn {
    cursor: pointer;
    display: inline-block;
    width: 40px;
    height: 30px;
    line-height: 30px;
    color: black;
    padding: 5px 30px;
    text-align: center;
}

.showname {

    padding-left: 100px;
}

.block {
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
}

.ava {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #eee;
    line-height: 30px;
    text-align: center;
}

.name {
    margin-left: 10px;
    user-select: none;
}
</style>