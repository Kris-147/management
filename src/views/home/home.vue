<template>
    <div class="home">
        <el-container>
            <el-header class="header">
                <div class="collapse">
                    <el-icon :size="26" class="collapseicon" v-model="isCollapse" @click="changeCollapse">
                        <Operation />
                    </el-icon>
                </div>
                <Avator></Avator>
            </el-header>
            <el-container>
                <el-aside :style="{ width: collapseWidth }" class="aside">
                    <Menu :coll="isCollapse"></Menu>
                </el-aside>
                <el-main class="main">
                    <Breadcrumb></Breadcrumb>
                    <div class="content">
                        <RouterView></RouterView>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import {
    Operation,
} from '@element-plus/icons-vue'
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'
import Breadcrumb from '../../components/home/Breadcrumb.vue'
import Avator from '../../components/home/Avator.vue'
import Menu from '../../components/home/Menu.vue'

const isCollapse = ref(false)
const changeCollapse = function () {
    isCollapse.value = !isCollapse.value
}
const collapseWidth = computed(() => {
    return isCollapse.value ? "64px" : "200px"
})

const router = useRouter()
router.replace("/home/userManage")

</script>

<style scoped>
.home {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.header {
    /* background-color: antiquewhite; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    padding-right: 50px;
}

:deep(.el-container) {
    height: 100%;
}


.el-aside {
    /* height: 100vh; */
    background-color: #ffffff;
    overflow-y: auto;
    -ms-overflow-style: none;
    /* Edge */
    scrollbar-width: none;
    /* Firefox */
}

.el-aside::-webkit-scrollbar {
    display: none;
    /* WebKit */
}

.el-aside {
    transition: width 0.15s;
    -webkit-transition: width 0.15s;
    -moz-transition: width 0.15s;
    -webkit-transition: width 0.15s;
    -o-transition: width 0.15s;
}

/* .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
} */

.main {
    background-color: chocolate;
    /* width: 100%; */
    /* height: 100%; */
    /* padding: 0; */
}

:deep(.el-main) {
    padding: 0;
}

.collapse {
    width: 40px;
    height: 40px;
    /* background-color: aliceblue; */
    display: flex;
    align-items: center;
}

/* .collapseicon {
    background-color: #fff;
} */

.collapseicon:hover {
    cursor: pointer;
}

.content {
    padding: 10px 10px 0 10px;
    border: 1px solid #000;
    /* background-color: blue; */
    height: 93%;
}</style>