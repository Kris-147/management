<template>
    <div class="chapterManage">
        <div class="top">
            <div>
                <el-input clearable v-model="searchName" class="searchIpt" :prefix-icon="Search"
                    placeholder="请输入章节名称"></el-input>
                <el-button type="primary" :icon="Search" @click="searchChapterName">
                    搜索章节
                </el-button>
            </div>
            <div>
                <el-button type="primary" :icon="Plus" @click="addChapter">
                    添加章节
                </el-button>
            </div>
        </div>
        <div>
            <el-table :data="tableData" border style="width: 100%" stripe class="table">
                <el-table-column align="center" prop="id" label="id" width="180" />
                <el-table-column align="center" prop="chapterSort" label="章节顺序" width="200" />
                <el-table-column align="center" prop="chapterName" label="章节名称" width="500" />
                <el-table-column align="center" label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="showEditChapterView(scope.row)">
                            修改章节信息
                        </el-button>
                        <el-button size="small" type="danger" @click="deleteChapter(scope.row)">删除章节</el-button>
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
                <el-form :model="chapter" :rules="rules" label-width="100px">
                    <el-form-item label="章节顺序：" prop="chapterSort">
                        <el-col :span="8">
                            <el-input style="width:200px" v-model.number="chapter.chapterSort"
                                placeholder="请输入章节顺序"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="章节名称：" prop="chapterName">
                        <el-col :span="8">
                            <el-input style="width:200px" v-model.trim="chapter.chapterName"
                                placeholder="请输入章节名称"></el-input>
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
import { getAll, updataChapterName, addChapterName, delChapterName, searchChapter } from '../../service/modules/chapter'
import { ref } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';

const rules = reactive({
    chapterName: [
        { required: true, message: "章节名不能为空" },
    ],
    chapterSort: [
        { required: true, message: "章节顺序不能为空" },
        { type: 'number', message: "请输入数字" }
    ]
})

const fenye = ref({
    offset: 0,
    limit: 10
})
const total = ref(0)
const currentPage = ref(1)
const size = ref(10)
const tableData = ref([])
const searchName = ref(null)

function init() {
    fenye.value.offset = (currentPage.value - 1) * size.value
    fenye.value.limit = size.value
    // console.log(fenye.value);
    getAll(fenye.value).then(res => {
        // console.log(res);
        tableData.value = res.data.data.chapterData
        total.value = res.data.data.count
    })
}

init()

const sizeChange = (pageSize) => {
    size.value = pageSize
    init()
}

const currentChange = (current) => {
    // console.log(current);
    currentPage.value = current
    init()
}

const title = ref("")
const dialogVisible = ref(false)
const status = ref("")
const chapter = ref({
    id: 0,
    chapterName: "",
    chapterSort: null
})

const showEditChapterView = (data) => {
    title.value = "编辑章节信息"
    chapter.value.chapterName = data.chapterName
    chapter.value.id = data.id
    chapter.value.chapterSort = data.chapterSort
    status.value = "update"
    dialogVisible.value = true
}

const closeDialog = () => {
    chapter.value.chapterName = ""
    chapter.value.id = 0
    chapter.value.chapterSort = null
    dialogVisible.value = false
}

const submitDialog = () => {
    if (status.value == "update") {
        updataChapterName(chapter.value).then(res => {
            dialogVisible.value = false
            chapter.value.chapterName = ""
            chapter.value.id = 0
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
                init()
            }
        })
    } else if (status.value == "add") {
        addChapterName({ chapterName: chapter.value.chapterName, chapterSort: chapter.value.chapterSort }).then(res => {
            dialogVisible.value = false
            chapter.value.chapterName = ""
            chapter.value.chapterSort = null
            chapter.value.id = 0
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
                init()
            }
        })
    }
}

const addChapter = () => {
    title.value = "添加章节"
    chapter.value.chapterName = ""
    chapter.value.id = 0
    chapter.value.chapterSort = null
    status.value = "add"
    dialogVisible.value = true
}

const deleteChapter = (data) => {
    ElMessageBox.confirm(
        `确定要删除"${data.chapterName}"这一章节吗?"`,
        "删除章节",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: 'warning'
        }
    ).then(r => {
        delChapterName({ id: data.id }).then(res => {
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
                init()
            }
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: "取消删除"
        })
    })
}

const searchChapterName = () => {
    if (searchName.value) {
        fenye.value.offset = (currentPage.value - 1) * size.value
        fenye.value.limit = size.value
        searchChapter({...fenye.value,searchName:searchName.value}).then(res => {
            tableData.value = res.data.data.chapterData
            total.value = res.data.data.count
            ElMessage({
                type:"success",
                message:"搜索成功"
            })
        })
    }else{
        init()
    }
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