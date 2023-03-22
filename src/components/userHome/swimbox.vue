<template>
    <div class="swimbox">
        <div class="suggest">
            <el-icon :size="34"><ChatLineSquare /></el-icon>
            <span>反馈</span>
        </div>
        <div class="gotop" v-if="isshow" @click="gototop">
            <el-icon :size="34"><Top /></el-icon>
            <span>置顶</span>
        </div>
    </div>
</template>

<script setup>
import {
    ChatLineSquare,
    Top
} from '@element-plus/icons-vue'
import {ref,defineProps,defineEmits} from 'vue'

const props = defineProps({
    isshow:{
        type:Boolean
    }
})
const emit = defineEmits(['totop'])
const gototop = () => {
    emit('totop')
}
</script>

<style scoped>
.swimbox{
    position: fixed;
    bottom: 70px;
    right:20px;
    z-index:9999;
    padding: 0 0 46px;
    width: 60px;
    padding-bottom: 74px;
}
.suggest{
    width: 60px;
    height: 74px;
    display: flex;
    border: 1px solid #ebebeb;
    /* border-width: 1px 1px 0; */
    cursor: pointer;
    background-color: #fff;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #999;
}
.gotop{
    width: 60px;
    height: 74px;
    border: 1px solid #ebebeb;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    color: #999;
    background-color: #fff;
}
</style>