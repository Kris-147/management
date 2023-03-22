<template>
    <div class="userhome">
        <div class="header">
            <div class="title">
                软件测试技术教学网站
            </div>
            <ul class="menus">
                <li :class="{ active: homePage }" @click="changeActive('home')">首页</li>
                <li :class="{ mapactive: mapPage }" @click="changeActive('map')">知识图谱</li>
            </ul>
            <div class="status">
                <div class="login">
                    <div class="loginBtn">登录</div>
                </div>
            </div>
        </div>
        <div class="main">
            <component :is="componentParem[active]" @tocourse="gocourse"></component>
        </div>
        <div class="footer">
            <footers></footers>
        </div>
        <swimbox :isshow="show" @totop="gotop"></swimbox>
    </div>
</template>

<script setup>
import { ref, defineAsyncComponent,onMounted } from 'vue'
import { useRoute } from 'vue-router'
import footers from '@/components/userHome/footer.vue'
import swimbox from '@/components/userHome/swimbox.vue'


const homePage = ref(true)
const mapPage = ref(false)

const active = ref('course')

const componentParem = {
    course: defineAsyncComponent(() => import("../../components/userHome/course.vue")),
    kmap: defineAsyncComponent(() => import("../../components/userHome/map.vue"))
}

const changeActive = (page) => {
    if (page == "home") {
        homePage.value = true
        mapPage.value = false
        active.value = 'course'
    } else if (page == 'map') {
        active.value = 'kmap'
        homePage.value = false
        mapPage.value = true
    }
}
const show = ref(false)
const handlescroll = () => {
    if(window.scrollY >= 100){
        show.value = true
    }else{
        show.value = false
    }
}
onMounted(() => {
    window.addEventListener('scroll',handlescroll,true)
})
const gotop = () => {
    window.scrollTo({
        top:0,
        behavior:"smooth"
    })
}

const gocourse = (data) => {
    window.scrollTo({
        top:data,
        behavior:"smooth"
    })
}
</script>

<style scoped>
.header {
    width: 100%;
    height: 48px;
    /* background-color: #ccc; */
    display: flex;
    align-items: center;
}

.title {
    width: 360px;
    padding-left: 80px;
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
}

.loginBtn {
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
    position: relative;
    left: 150px;
}

.footer {
    height: 115px;
}
</style>