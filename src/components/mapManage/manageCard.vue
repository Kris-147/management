<template>
    <div class="manageCard">
        <el-card class="box-card">
            <template #header>
                <div class="card-header title">
                    <div v-if="chapterName">
                        <span>第{{ chapterSort }}章——{{ chapterName }}</span>
                        <div class="btns">
                            <el-button size="small" type="warning" @click="updateChapter">修改章节</el-button>
                            <el-button size="small" type="danger" @click="deleteChapter">删除章节</el-button>
                        </div>
                    </div>
                    <div v-else>
                        <span>点击章节查看信息</span>
                    </div>
                </div>
            </template>
            <div v-for="item in showSec" :key="item.id" class="item">
                <el-popover placement="top" :width="220" trigger="click">
                    <template #reference>
                        {{ item.knowledgeSort }}.{{ item.knowledgeName }}
                    </template>
                    <div>
                        <el-button size="small" type="warning" @click="updateKnowledge(item.id,item.knowledgeName,item.knowledgeSort)">修改知识点</el-button>
                        <el-button size="small" type="danger" @click="deleteKnowledege(item.id,item.knowledgeName,item.knowledgeSort)">删除知识点</el-button>
                    </div>
                </el-popover>
            </div>
            <div class="footer" @click="createKnowledge" v-if="chapterName">
                <el-icon><Plus /></el-icon>
            </div>
        </el-card>

    </div>
</template>

<script setup>
import { ElCard } from 'element-plus';
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
    chapterName: {
        type: String,
        default: ""
    },
    chapterSort: {
        type: Number,
        default: 0
    },
    showSec: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['updateChapter', 'deleteChapter','updateKnowledge','deleteKnowledege','createKnowledge'])

const updateChapter = () => {
    emit('updateChapter')
}

const deleteChapter = () => {
    emit('deleteChapter')
}

const updateKnowledge = (id,knowledgeName,knowledgeSort) => {
    emit('updateKnowledge',[id,knowledgeName,knowledgeSort])
}

const deleteKnowledege = (id,knowledgeName,knowledgeSort) => {
    emit('deleteKnowledege',[id,knowledgeName,knowledgeSort])
}

const createKnowledge = () => {
    emit('createKnowledge')
}
</script>

<style scoped>
.manageCard {
    position: fixed;
    right: 20px;
    top: 80px;
    border-radius: 4px;
    width: 270px;
}

.title {
    font-size: 18px;
    font-weight: 600;
}

.btns {
    margin-top: 5px;
}

.item {
    margin-bottom: 10px;
    cursor: pointer;
}
.footer{
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 1px dashed rgb(149, 149, 149);
}
.footer:hover{
    background-color: rgb(234, 234, 234);
}
</style>