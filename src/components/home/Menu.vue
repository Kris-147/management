<template>
    <el-menu default-active="/admin/userManage" class="el-menu-vertical-demo" :collapse="coll" :collapse-transition="false"
        router>
        <el-menu-item index="/admin/userManage">
            <el-icon>
                <User />
            </el-icon>
            <span>用户信息管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/messageManage">
            <el-icon>
                <ChatDotRound />
            </el-icon>
            <span>用户意见管理</span>
        </el-menu-item>
        <el-sub-menu index="/">
            <template #title>
                <el-icon>
                    <Notebook />
                </el-icon>
                <span>知识点管理</span>
            </template>
            <el-menu-item index="/admin/chapterManage">
                <el-icon>
                    <Collection />
                </el-icon>
                <span>章节管理</span>
            </el-menu-item>
            <el-menu-item index="/admin/sectionManage">
                <el-icon>
                    <document />
                </el-icon>
                <span>知识点内容管理</span>
            </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/admin/politicsManage">
            <el-icon>
                <Postcard />
            </el-icon>
            <span>思政素材管理</span>
        </el-menu-item>

        <el-menu-item index="/admin/mapManage">
            <el-icon>
                <Memo />
            </el-icon>
            <span>知识图谱管理</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup>
import {
    Document,
    User,
    ChatDotRound,
    Notebook,
    Collection,
    Postcard,
    Memo
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

<style scoped>:deep(.el-menu) {
    border-right: none;
}</style>