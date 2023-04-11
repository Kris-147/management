<template>
    <div class="card">
        <el-card class="box-card" v-if="chapterShow">
            <template #header>
                <div class="card-header title">
                    <span v-if="chapterName">第{{chapterSort}}章——{{ chapterName }}</span>
                    <span v-else>点击章节查看信息</span>
                </div>
            </template>
            <div v-for="item in showSec" :key="item.id" class="item" @click="intoCourse(item.id)">{{item.knowledgeSort}}.{{ item.knowledgeName}}</div>
        </el-card>
        <el-card v-else>
            <template #header>
                <div class="card-header title">
                    <span v-if="chapterName">第{{chapterSort}}章——{{ chapterName }}</span>
                </div>
            </template>
            <div class="item">{{ knowledgeInfo.knowledgeSort }}.{{ knowledgeInfo.knowledgeName }}</div>
        </el-card>
    </div>
</template>

<script setup>
import { ElCard } from 'element-plus';
import {useRouter} from 'vue-router'

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
    },
    chapterShow:{
        type:Boolean
    },
    knowledgeInfo:{
        type:Object
    }
})


const router = useRouter()
const intoCourse = (id) => {
    router.push('/home/course/' + id)
}
</script>

<style scoped>
.card{
    position: fixed;
    right: 20px;
    top:60px;
    border-radius: 4px;
    width: 270px;
}
.title{
    font-size: 18px;
    font-weight: 600;
}
.item{
    margin-bottom: 10px;
    cursor: pointer;
}
</style>