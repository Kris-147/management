<template>
    <div class="manageCard">
        <el-card class="box-card">
            <template #header>
                <div class="card-header title">
                    <div v-if="chapterName">
                        <span>第{{chapterSort}}章——{{ chapterName }}</span>
                        <div class="btns">
                            <el-button size="small" type="warning" @click="updateChapter">修改章节</el-button>
                            <el-button size="small" type="danger">删除章节</el-button>
                        </div>
                    </div>
                    <div v-else>
                        <span>点击章节查看信息</span>
                    </div>
                </div>
            </template>
            <div v-for="item in showSec" :key="item.id" class="item" @click="intoCourse(item.id)">{{item.knowledgeSort}}.{{ item.knowledgeName}}</div>
        </el-card>
        
    </div>
</template>

<script setup>
import { ElCard } from 'element-plus';

const props = defineProps({
    chapterName:{
        type:String,
        default:""
    },
    chapterSort:{
        type:Number,
        default:0
    },
    showSec:{
        type:Array,
        default:() => []
    }
})

const intoCourse = (id) => {
    console.log(id);
}

const emit = defineEmits(['updateChapter'])

const updateChapter = () => {
    emit('updateChapter')
}
</script>

<style scoped>
.manageCard{
    position: fixed;
    right: 20px;
    top:80px;
    border-radius: 4px;
    width: 270px;
}
.title{
    font-size: 18px;
    font-weight: 600;
}
.btns{
    margin-top: 5px;
}
.item{
    margin-bottom: 10px;
    cursor: pointer;
}
</style>