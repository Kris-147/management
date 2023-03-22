<template>
    <el-menu default-active="/admin/userManage" class="el-menu-vertical-demo" :collapse="coll" :collapse-transition="false"
        router>
        <el-menu-item index="/admin/userManage">
            <el-icon>
                <location />
            </el-icon>
            <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/messageManage">
            <el-icon><icon-menu /></el-icon>
            <span>消息管理</span>
        </el-menu-item>
        <el-sub-menu index="/">
            <template #title>
                <el-icon>
                    <location />
                </el-icon>
                <span>知识点管理</span>
            </template>
            <el-menu-item index="/admin/chapterManage">
                <el-icon>
                    <document />
                </el-icon>
                <span>章节管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/sectionManage">
                <el-icon>
                    <document />
                </el-icon>
                <span>内容管理</span>
            </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="4">
            <el-icon>
                <setting />
            </el-icon>
            <span>Navigator Four</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';

const props = defineProps({
    coll: {
        type: Boolean,
        default: false
    }
})

const route = useRoute()
// const activePath = ref("/home/userManage")
</script>

<style scoped>
:deep(.el-menu){
    border-right: none;
}
</style>