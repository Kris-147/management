<template>
    <div class="sectionManage">
        <div class="top">
            <div class="top-left">
                <el-select @change="chapterChange" v-model="selectedValue" class="m-2" placeholder="Select">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-input clearable v-model="searchName" class="searchIpt" :prefix-icon="Search"
                    placeholder="请输入知识点名称"></el-input>
                <el-button type="primary" :icon="Search" @click="searchKnowledge" class="searchBtn">
                    搜索知识点
                </el-button>
            </div>
            <div class="addBtn">
                <el-button type="primary" :icon="Plus" @click="addknowledge">
                    添加知识点
                </el-button>
            </div>
        </div>
        <div>
            <el-table :data="tableData" border style="width: 100%" stripe class="table">
                <el-table-column align="center" prop="id" label="id" width="180" />
                <el-table-column align="center" prop="knowledgeName" label="知识点名称" width="400" />
                <el-table-column align="center" prop="knowledgeSort" label="知识点顺序" width="180" />
                <el-table-column align="center" label="操作">
                    <template #default="scope">
                        <el-button size="small" @click="showEditKnowledgeView(scope.row)">
                            修改知识点
                        </el-button>
                        <el-button size="small" type="danger" @click="deleteKnowledge(scope.row)">删除知识点</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="fenye">
                <el-pagination background layout="sizes, prev, pager, next, jumper, ->, total, slot" :total="total"
                    @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" />
            </div>
        </div>
        <el-dialog v-model="dialogVisible" :title="title">
            <el-form :model="knowledge" :rules="rules" label-width="150px">
                <el-form-item label="知识点顺序：" prop="knowledgeSort">
                    <el-col :span="8">
                        <el-input style="width:200px" v-model.number="knowledge.knowledgeSort"
                            placeholder="请输入知识点顺序"></el-input>
                    </el-col>
                </el-form-item>
                <el-form-item label="知识点名称：" prop="knowledgeName">
                    <el-col :span="8">
                        <el-input style="width:200px" v-model.trim="knowledge.knowledgeName"
                            placeholder="请输入知识点名称"></el-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div class="inner">知识点内容：</div>
            <div class="editor">
                <div style="border: 1px solid #ccc">
                    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                        :mode="mode" />
                    <Editor style="height: 500px; overflow-y: hidden;" v-model="knowledge.content"
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
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { getToken } from '../../utils/getToken'
import { updateKnowledge, getContent, delKnowledge, getAllChapter, getKnowledgeByChapterId, searchKnowledgeByChapterId, addKnowledge } from '../../service/modules/knowledge'

const selectedValue = ref(null)
const searchName = ref(null)
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
const knowledge = ref({
    id: "",
    knowledgeName: "",
    content: "",
    knowledgeSort: ""
})

const rules = reactive({
    knowledgeName: [
        { required: true, message: "知识点名称不能为空" },
    ],
    knowledgeSort: [
        { required: true, message: "知识点顺序不能为空" },
        { type: 'number', message: "请输入数字" }
    ]
})

const options = ref([])

const tableData = ref([])

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

    // 返回值有三种选择：
    // 1. 返回 true ，说明检查通过，编辑器将正常插入图片
    // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
    // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
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

const chapterChange = (data) => {
    fenye.value.offset = (currentPage.value - 1) * size.value
    fenye.value.limit = size.value
    getKnowledgeByChapterId({ chapterId: data, ...fenye.value }).then(res => {
        tableData.value = res.data.data.knowledgeData
        total.value = res.data.data.count
    })
}

function init() {
    getAllChapter().then(res => {
        let len = res.data.data.length
        for (let i = 0; i < len; i++) {
            options.value[i] = {
                label: res.data.data[i].chapterName,
                value: res.data.data[i].id
            }
        }
        selectedValue.value = options.value[0].value
        chapterChange(selectedValue.value)
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

const searchKnowledge = () => {
    if (searchName.value) {
        searchKnowledgeByChapterId({ chapterId: selectedValue.value, ...fenye.value, searchName: searchName.value }).then(res => {
            tableData.value = res.data.data.knowledgeData
            total.value = res.data.data.count
        })
    } else {
        chapterChange(selectedValue.value)
    }

}

const addknowledge = () => {
    title.value = "添加知识点"
    status.value = "add"
    dialogVisible.value = true
}

const showEditKnowledgeView = (data) => {
    title.value = "编辑知识点"
    status.value = "update"
    dialogVisible.value = true
    getContent({ id: data.id }).then(res => {
        editorRef.value.setHtml(res.data.data.content)
        knowledge.value.knowledgeName = data.knowledgeName
        knowledge.value.knowledgeSort = data.knowledgeSort
        knowledge.value.id = data.id
        
    })
}

const deleteKnowledge = (data) => {
    ElMessageBox.confirm(
        `确定要删除"${data.knowledgeName}"这一知识点吗?"`,
        "删除知识点",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: 'warning'
        }
    ).then(r => {
        delKnowledge({ id: data.id }).then(res => {
            ElMessage({
                type: "success",
                message: res.data.msg
            })
            chapterChange(selectedValue.value)
        })
    }).catch(() => {
        ElMessage({
            type: "info",
            message: "取消删除"
        })
    })

}

const closeDialog = () => {
    dialogVisible.value = false
    title.value = ""
    status.value = ""
    knowledge.value.id = undefined
    knowledge.value.content = undefined
    knowledge.value.knowledgeName = undefined
    knowledge.value.knowledgeSort = undefined

}

const submitDialog = () => {
    if (status.value == "add") {
        addKnowledge({
            knowledgeName: knowledge.value.knowledgeName,
            knowledgeSort: knowledge.value.knowledgeSort,
            content: editorRef.value.getHtml(),
            chapterId: selectedValue.value
        }).then(res => {
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
                knowledge.value.content = undefined
                knowledge.value.id = undefined
                knowledge.value.knowledgeName = undefined
                knowledge.value.knowledgeSort = undefined
                dialogVisible.value = false
                chapterChange(selectedValue.value)
            }
        })
    } else if (status.value == "update") {
        updateKnowledge({
            id: knowledge.value.id,
            knowledgeName: knowledge.value.knowledgeName,
            knowledgeSort: knowledge.value.knowledgeSort,
            content: editorRef.value.getHtml()
        }).then(res2 => {
            if (res2.data.code == 0) {
                ElMessage({
                    type: "error",
                    message: res2.data.msg
                })
            } else {
                ElMessage({
                    type: "success",
                    message: res2.data.msg
                })
                knowledge.value.content = undefined
                knowledge.value.id = undefined
                knowledge.value.knowledgeName = undefined
                knowledge.value.knowledgeSort = undefined
                dialogVisible.value = false
                chapterChange(selectedValue.value)
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

.inner {
    margin-left: 54px;
    margin-bottom: 10px;
}

.fenye {
    margin-top: 30px;
    float: right;
    margin-right: 10px;
}
</style>