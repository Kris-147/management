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
            <div>
                <el-button type="primary" :icon="Plus" @click="addknowledge">
                    添加知识点
                </el-button>
            </div>
        </div>
        <div>
            <el-table :data="tableData" border style="width: 100%" stripe class="table">
                <el-table-column prop="id" label="id" width="180" />
                <el-table-column prop="knowledgeName" label="知识点名称" width="200" />
                <el-table-column label="操作">
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
    </div>
</template>

<script setup>
import editor from '@/components/section/Editor.vue';
import { ref } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import {getAllChapter} from '../../service/modules/knowledge'

const selectedValue = ref(null)
const searchName = ref(null)
const total = ref(0)
const currentPage = ref(1)
const size = ref(0)
const fenye = ref({
    offset:0,
    limit:10
})
const dialogVisible = ref(false)
const status = ref("")
const knowledge = ref({
    id:0,
    knowledgeName:null,
    content:null
})

const options = ref([])

const tableData = ref([])

function init(){
    getAllChapter().then(res => {
        let len = res.data.data.length
        for(let i = 0; i < len; i++){
            options.value[i] = {
                label:res.data.data[i].chapterName,
                value:res.data.data[i].id
            }
        }
        selectedValue.value = options.value[0].value
    })
}

init()

const chapterChange = (data) => {
    
}

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

}

const addknowledge = () => {

}

const showEditKnowledgeView = (data) => {

}

const deleteKnowledge = (data) => {

}
</script>

<style scoped>
.top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}
.top-left{
    display: flex;
    align-items: center;
    width: 700px;
}

.m-2{
    width: 600px;
}
.searchIpt{
    /* width: 300px; */
    margin-left: 10px;
}
.searchBtn{
    margin-left: 10px;
}
.table{
    margin-top: 20px;
}
.fenye{
    margin-top: 30px;
    float: right;
    margin-right: 10px;
}
</style>