<template>
    <div class="userManage">
        <div class="top">
            <div>
                <el-input clearable v-model="searchName" class="searchIpt" :prefix-icon="Search"
                    placeholder="请输入用户名"></el-input>
                <el-button type="primary" :icon="Search" @click="searchUser">
                    搜索用戶
                </el-button>
            </div>
            <div>
                <el-button type="primary" :icon="Plus" @click="addUser">
                    添加用戶
                </el-button>
            </div>
        </div>
        <div>
            <el-table :data="tableData" border style="width: 100%" stripe class="table">
                <el-table-column align="center" prop="id" label="id" width="120" />
                <el-table-column align="center" prop="username" label="用户名" width="200" />
                <!-- <el-table-column align="center" prop="userrole" label="用户角色">
                    <template #default="scope">
                        <el-tag type="success" effect="light" class="mx-1">
                            {{ scope.row.userrole }}
                        </el-tag>
                    </template>
                </el-table-column> -->
                <el-table-column align="center" prop="email" label="邮箱" width="250" />
                <el-table-column align="center" prop="createdAt" label="创建时间" width="200" />
                <el-table-column align="center" prop="updatedAt" label="最近修改时间" width="200" />
                <el-table-column align="center" label="Operations">
                    <template #default="scope">
                        <el-button size="small" @click="showEditUserView(scope.row)">编辑用户信息</el-button>
                        <el-button size="small" type="warning" @click="resetPwd(scope.row)">重置密码</el-button>
                        <el-button size="small" type="danger" @click="deleteUser(scope.row)">删除用户</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="fenye">
                <el-pagination background layout="sizes, prev, pager, next, jumper, ->, total, slot" :total="total"
                    @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" />
            </div>
        </div>
        <el-dialog draggable v-model="dialogVisible" :title="title" align-center width="30%">
            <div>
                <el-form :model="user" :rules="rules" label-width="100px">
                    <el-form-item label="用户名：" prop="username">
                        <el-col :span="8">
                            <el-input style="width:200px" v-model.trim="user.username" placeholder="请输入用户名"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="邮箱：" prop="email">
                        <el-col :span="8">
                            <el-input style="width:200px" v-model.trim="user.email" placeholder="请输入邮箱"></el-input>
                        </el-col>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeDialog">
                        取消
                    </el-button>
                    <el-button type="primary" @click="submitDialog">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive } from 'vue';
import { getAllUser, searchAllUser, createUser, updateUser, delUser, resetPassword } from '../../service/modules/user'

const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const size = ref(10)
const fenye = ref({
    offset: 0,
    limit: 10
})
const searchName = ref(null)
const dialogVisible = ref(false)
const title = ref("")
const status = ref("")
const user = ref({
    id: 0,
    username: "",
    email: ""
})
const rules = reactive({
    username: [
        { required: true, message: "请输入用户名,长度为5到10位", trigger: "blur" },
        { min: 5, max: 10, message: '长度为5到10位', trigger: ['blur', 'change'] }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: "请输入正确的邮箱", trigger: ['blur', 'change'] }
    ]
})

function addDateZero(num) {
    return (num < 10 ? "0" + num : num);
}

function initUser() {
    fenye.value.offset = (currentPage.value - 1) * size.value
    fenye.value.limit = size.value
    getAllUser(fenye.value).then(res => {
        for (let i = 0; i < res.data.data.userData.length; i++) {
            let d = new Date(res.data.data.userData[i].createdAt)
            let up = new Date(res.data.data.userData[i].updatedAt)
            let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
            let formatdatetime1 = up.getFullYear() + '-' + addDateZero(up.getMonth() + 1) + '-' + addDateZero(up.getDate()) + ' ' + addDateZero(up.getHours()) + ':' + addDateZero(up.getMinutes()) + ':' + addDateZero(up.getSeconds());
            res.data.data.userData[i].createdAt = formatdatetime
            res.data.data.userData[i].updatedAt = formatdatetime1
        }
        tableData.value = res.data.data.userData
        total.value = res.data.data.count
    })
}

initUser()

const sizeChange = (pageSize) => {
    size.value = pageSize
    initUser()
}

const currentChange = (current) => {
    currentPage.value = current
    initUser()
}

const searchUser = () => {
    if (searchName.value) {
        fenye.value.offset = (currentPage.value - 1) * size.value
        fenye.value.limit = size.value
        searchAllUser({ ...fenye.value, searchName: searchName.value }).then(res => {
            tableData.value = res.data.data.userData
            total.value = res.data.data.count
            ElMessage({
                type: "success",
                message: "搜索成功"
            })
        })
    } else {
        initUser()
    }
}

const addUser = () => {
    title.value = "添加用户"
    user.value.username = ""
    user.value.id = 0
    user.value.email = ""
    status.value = "add"
    dialogVisible.value = true
}

const closeDialog = () => {
    user.value.username = ""
    user.value.id = 0
    dialogVisible.value = false
}

const submitDialog = () => {
    if (status.value == "add") {
        createUser({ username: user.value.username,email:user.value.email }).then(res => {
            dialogVisible.value = false
            user.value.username = ""
            if (res.data.code == 0) {
                ElMessage({
                    message: res.data.msg,
                    type: "error"
                })
            } else {
                ElMessage({
                    message: res.data.msg,
                    type: "success"
                })
                initUser()
            }
        })
    } else if (status.value == "update") {
        updateUser(user.value).then(res => {
            dialogVisible.value = false
            user.value.username = ""
            user.value.id = 0
            if (res.data.code == 0) {
                ElMessage({
                    message: res.data.msg,
                    type: "error"
                })
            } else {
                ElMessage({
                    message: res.data.msg,
                    type: "success"
                })
                initUser()
            }
        })
    }
}

const showEditUserView = (data) => {
    title.value = "编辑用户信息"
    user.value.username = data.username
    user.value.id = data.id
    user.value.email = data.email
    status.value = "update"
    dialogVisible.value = true
}

const resetPwd = (data) => {
    resetPassword({ id: data.id }).then(res => {
        if (res.data.code == 1) {
            ElMessage({
                message: "重置成功",
                type: "success"
            })
        } else {
            ElMessage({
                message: "重置失败",
                type: "danger"
            })
        }
    })
}

const deleteUser = (data) => {
    ElMessageBox.confirm(
        `确定要删除用户"${data.username}"吗?`,
        "删除用户",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }
    ).then(r => {
        delUser({ id: data.id }).then(res => {
            if (res.data.code == 0) {
                ElMessage({
                    type: 'error',
                    message: res.data.msg
                })
            } else {
                ElMessage({
                    type: 'success',
                    message: res.data.msg
                })
                initUser()
            }
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: "取消删除"
        })
    })
}
</script>

<style scoped>
.top {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.searchIpt {
    width: 300px;
    margin-right: 10px;

}

.table {
    margin-top: 20px;
}

.fenye {
    margin-top: 30px;
    float: right;
    margin-right: 10px;
}
</style>