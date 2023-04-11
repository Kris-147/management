<template>
    <div class="messageManage">
        <div class="top">
            <div>
                <el-input clearable v-model="searchName" class="searchIpt" :prefix-icon="Search"
                    placeholder="请输入用户名称"></el-input>
                <el-button type="primary" :icon="Search" @click="searchUsername">
                    搜索用户
                </el-button>
            </div>
        </div>
        <div>
            <el-table :data="tableData" border style="width: 100%" stripe class="table">
                <el-table-column align="center" prop="id" label="id" width="180" />
                <el-table-column align="center" prop="username" label="用户名" width="300" />
                <el-table-column align="center" prop="uid" label="用户ID" width="100" />
                <el-table-column align="center" prop="createdAt" label="提交时间" width="250" />
                <el-table-column align="center" prop="handle" label="状态" width="100">
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.handle">
                            已处理
                        </el-tag>
                        <el-tag type="danger" v-else>
                            未处理
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="showSuggestContent(scope.row)">
                            查看意见
                        </el-button>
                        <el-button size="small" type="danger" @click="deleteSuggest(scope.row)">删除意见</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="fenye">
                <el-pagination background layout="sizes, prev, pager, next, jumper, ->, total, slot" :total="total"
                    @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" />
            </div>
        </div>
        <el-dialog draggable v-model="dialogVisible" title="意见反馈" align-center width="30%">
            <div class="opensug">
                {{ showContent }}
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeDialog">
                        取消
                    </el-button>
                    <el-button type="primary" @click="submitDialog">
                        确认处理
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { initTable, handleSug, delSug } from '@/service/modules/suggest'
import { ElMessage, ElMessageBox } from 'element-plus';

const total = ref(0)
const currentPage = ref(1)
const size = ref(10)
const fenye = ref({
    offset: 0,
    limit: 10
})
const searchName = ref("")
const tableData = ref([])
const dialogVisible = ref(false)
const showContent = ref("")
const checkSug = ref(-1)

function addDateZero(num) {
    return (num < 10 ? "0" + num : num);
}

function init() {
    fenye.value.offset = (currentPage.value - 1) * size.value
    fenye.value.limit = size.value
    initTable({ ...fenye.value, searchName: searchName.value }).then(res => {
        tableData.value = res.data.data.data
        total.value = res.data.data.count
        for (let i = 0; i < tableData.value.length; i++) {
            let d = new Date(tableData.value[i].createdAt)
            let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds())
            tableData.value[i].createdAt = formatdatetime
        }
    })
}
init()

const sizeChange = (pageSize) => {
    size.value = pageSize
    init()
}

const currentChange = (current) => {
    currentPage.value = current
    init()
}

const searchUsername = () => {
    fenye.value.offset = (currentPage.value - 1) * size.value
    fenye.value.limit = size.value
    init()
}

const showSuggestContent = (data) => {
    for (let i = 0; i < tableData.value.length; i++) {
        if (tableData.value[i].id == data.id) {
            showContent.value = tableData.value[i].content
            checkSug.value = data.id
        }
    }
    dialogVisible.value = true
}
const deleteSuggest = (data) => {
    ElMessageBox.confirm(
        `确定要删除"${data.username}"的反馈吗?"`,
        "删除反馈",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: 'warning'
        }
    ).then(r => {
        delSug({ id: data.id }).then(res => {
            if (res.data.code == 1) {
                ElMessage({
                    type: "success",
                    message: res.data.msg
                })
                init()
            } else {
                ElMessage({
                    type: "error",
                    message: res.data.msg
                })
            }
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: "取消删除"
        })
    })

}

const closeDialog = () => {
    showContent.value = ""
    checkSug.value = -1
    dialogVisible.value = false
}

const submitDialog = () => {
    for (let i = 0; i < tableData.value.length; i++) {
        if (checkSug.value == tableData.value[i].id) {
            if (tableData.value[i].handle) {
                ElMessage({
                    type: "warning",
                    message: "已处理完毕"
                })
                dialogVisible.value = false
                return
            }
        }
    }
    handleSug({ id: checkSug.value }).then(res => {
        if (res.data.code == 1) {
            ElMessage({
                type: "success",
                message: "处理成功"
            })
            dialogVisible.value = false
            init()
        } else {
            ElMessage({
                type: "error",
                message: res.data.msg
            })
        }
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

.opensug {
    line-height: 1.6;
    padding: 0 15px 0 5px;
}
</style>