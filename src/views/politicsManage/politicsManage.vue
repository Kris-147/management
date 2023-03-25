<template>
    <div class="PoliticsManege">
        <div class="top">
            <div class="top-left">
                <el-input clearable v-model="searchName" class="searchIpt" :prefix-icon="Search"
                    placeholder="请输入思政素材名称"></el-input>
                <el-button type="primary" :icon="Search" @click="searchPolitics" class="searchBtn">
                    搜索思政素材
                </el-button>
            </div>
            <div class="addBtn">
                <el-button type="primary" :icon="Plus" @click="addPolitics">
                    添加思政素材
                </el-button>
            </div>
        </div>
        <div>
            <el-table :data="tableData" border style="width: 100%" stripe class="table">
                <el-table-column align="center" prop="id" label="id" width="180" />
                <el-table-column align="center" prop="iname" label="思政素材名称" width="350" />
                <el-table-column align="center" prop="kname" label="关联知识点名称" width="350" />
                <el-table-column align="center" label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="showEditPoliticsView(scope.row)">
                            修改思政素材
                        </el-button>
                        <el-button size="small" type="danger" @click="deletePolitics(scope.row)">删除知识点</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="fenye">
                <el-pagination background layout="sizes, prev, pager, next, jumper, ->, total, slot" :total="total"
                    @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" />
            </div>
        </div>
        <el-dialog v-model="dialogVisible" :title="title">
            <div>
                关联的知识点：<el-cascader v-model="selectedValue" :options="options" :show-all-levels="false" />
            </div>
            <div style="margin-top: 10px;">
                思政素材名称：<el-input style="width:200px" v-model="politics.iname"></el-input>
            </div>
            <div class="editor">
                <div style="border: 1px solid #ccc">
                    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                        :mode="mode" />
                    <Editor style="height: 500px; overflow-y: hidden;" v-model="politics.content"
                        :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
                </div>
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
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { getToken } from '../../utils/getToken'
import { initTable, getContent, updatePolitics, insertPolitics, delPolitics } from '@/service/modules/politics'
import { usergetall } from '../../service/modules/userHome'

const selectedValue = ref(-1)
const searchName = ref("")
const total = ref(0)
const currentPage = ref(1)
const size = ref(10)
const fenye = ref({
    offset: 0,
    limit: 10
})
const dialogVisible = ref(false)
const title = ref("")
const status = ref("")

const options = ref([])

const tableData = ref([])
const politics = ref({
    id: "",
    iname: "",
    content: "",
    kid: ""
})

const mode = ref("default")
const editorRef = shallowRef()
const toolbarConfig = { excludeKeys: [] }
toolbarConfig.excludeKeys = [
    "emotion",
    "insertImage",
    "group-video"
]
const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {} }
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

function customCheckImageFn(src, alt, url) {
    if (!src) {
        return
    }
    return true
}

// 转换图片链接
function customParseImageSrc(src) {
    return src
}

// 插入图片
editorConfig.MENU_CONF['insertImage'] = {
    onInsertedImage(imageNode) {
        if (imageNode == null) return
    },
    checkImage: customCheckImageFn, // 也支持 async 函数
    parseImageSrc: customParseImageSrc, // 也支持 async 函数
}
// 编辑图片
editorConfig.MENU_CONF['editImage'] = {
    onUpdatedImage(imageNode) {
        if (imageNode == null) return

        const { src, alt, url } = imageNode
        console.log('updated image', src, alt, url)
    },
    checkImage: customCheckImageFn, // 也支持 async 函数
    parseImageSrc: customParseImageSrc, // 也支持 async 函数
}
editorConfig.MENU_CONF['uploadImage'] = {
    fieldName: 'contentImg',
    server: "/api/knowledge/contentImg",
    headers: {
        authorization: getToken()
    },
}

function init() {
    fenye.value.offset = (currentPage.value - 1) * size.value
    fenye.value.limit = size.value
    initTable({ ...fenye.value, searchName: searchName.value }).then(res => {
        tableData.value = res.data.data.data
        total.value = res.data.data.count
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

const searchPolitics = () => {
    fenye.value.offset = (currentPage.value - 1) * size.value
    fenye.value.limit = size.value
    init()
}

const addPolitics = () => {
    usergetall().then(res => {
        for (let i = 0; i < res.data.data.length; i++) {
            options.value[i] = {
                label: res.data.data[i].chapterName,
                value: res.data.data[i].cid,
                children: []
            }
            for (let j = 0; j < res.data.data[i].children.length; j++) {
                options.value[i].children.push({
                    label: res.data.data[i].children[j].knowledgeName,
                    value: res.data.data[i].children[j].kid
                })
            }
        }
        title.value = "添加思政素材"
        status.value = "add"
        selectedValue.value = options.value[0].children[0].value
        politics.value.kid = selectedValue.value
        dialogVisible.value = true
    })
}

const showEditPoliticsView = (data) => {
    usergetall().then(res => {
        for (let i = 0; i < res.data.data.length; i++) {
            options.value[i] = {
                label: res.data.data[i].chapterName,
                value: res.data.data[i].cid,
                children: []
            }
            for (let j = 0; j < res.data.data[i].children.length; j++) {
                options.value[i].children.push({
                    label: res.data.data[i].children[j].knowledgeName,
                    value: res.data.data[i].children[j].kid
                })
            }
        }
    })
    getContent({ id: data.id }).then(res => {
        politics.value.id = data.id
        politics.value.iname = data.iname
        politics.value.kid = res.data.data.kid
        politics.value.content = res.data.data.content
        selectedValue.value = res.data.data.kid
        title.value = "编辑思政素材"
        dialogVisible.value = true
        status.value = "update"
    })
}

const deletePolitics = (data) => {
    ElMessageBox.confirm(
        `确定要删除"${data.iname}"这一思政素材吗?`,
        "删除思政素材",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: 'warning'
        }
    ).then(r => {
        delPolitics({ id: data.id }).then(res => {
            if (res.data.code == 1) {
                ElMessage({
                    type: "success",
                    message: "删除成功"
                })
                init()
            }else{
                ElMessage({
                    type:"error",
                    message:res.data.msg
                })
            }
        })
    }).catch(() => {
        ElMessage({
            type: "info",
            message: "取消删除"
        })
    })
}

const closeDialog = () => {
    politics.value.id = ""
    politics.value.content = ""
    politics.value.iname = ""
    politics.value.kid = ""
    dialogVisible.value = false
    status.value = ""
}

const submitDialog = () => {
    if (status.value == "update") {
        updatePolitics({ ...politics.value }).then(res => {
            if (res.data.code == 1) {
                ElMessage({
                    type: "success",
                    message: "修改成功"
                })
                politics.value.id = ""
                politics.value.content = ""
                politics.value.iname = ""
                politics.value.kid = ""
                dialogVisible.value = false
                init()
            } else {
                ElMessage({
                    type: "error",
                    message: res.data.msg
                })
            }
        })
    } else if (status.value == "add") {
        insertPolitics({ ...politics.value }).then(res => {
            if (res.data.code == 1) {
                ElMessage({
                    message: "创建成功",
                    type: "success"
                })
                politics.value.id = ""
                politics.value.content = ""
                politics.value.iname = ""
                politics.value.kid = ""
                dialogVisible.value = false
                init()
            } else {
                ElMessage({
                    message: res.data.msg,
                    type: "error"
                })
            }
        })
    }
}
</script>

<style scoped>
.top {
    display: flex;
    align-items: center;
    margin-top: 10px;
    justify-content: space-between;
}

.top-left {
    display: flex;
    align-items: center;
    width: 700px;
}

/* .addBtn{
    margin-left: 400px;
} */
.m-2 {
    width: 600px;
}

.searchIpt {
    /* width: 300px; */
    margin-left: 10px;
}

.searchBtn {
    margin-left: 10px;
}

.table {
    margin-top: 20px;
}

.fenye {
    margin-top: 30px;
    float: right;
    margin-right: 10px;
}

.editor {
    margin-top: 10px;
}
</style>