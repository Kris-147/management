<template>
    <div class="breadcrumb">
        <el-breadcrumb :separator-icon="ArrowRight">
            <template v-for="item in routers" :key="item.path">
                <el-breadcrumb-item :to="{ path: item?.path }">
                    {{ item?.meta?.title }}
                </el-breadcrumb-item>
            </template>
        </el-breadcrumb>
    </div>
</template>

<script setup>
import {
    ArrowRight
} from '@element-plus/icons-vue'
import { computed } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()
// console.log(router.currentRoute.value.matched);
const routers = computed(() => {
    return router.currentRoute.value.matched.filter(item => item.meta.title)
})

</script>

<style scoped>
.breadcrumb {
    /* width: 100%; */
    height: 30px;
    background-color: aqua;
    display: flex;
    align-items: center;
    padding-left: 20px;
}
</style>