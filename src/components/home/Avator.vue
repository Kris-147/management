<template>
    <div class="avatar">
        <el-dropdown trigger="click">
            <el-avatar :icon="Avatar" :size="26" />
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import {
    Avatar,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import {useRouter} from 'vue-router'
import {deleteToken} from '../../utils/DeleteToken'

const router = useRouter()
const logout = function(){
    deleteToken()
    ElMessage({
        message:"成功退出登录",
        type:"success"
    })
    router.replace("/adminlogin")
}
</script>

<style scoped></style>