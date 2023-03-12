<template>
    <div class="NotFound">
        <div class="notFound">
            <div class="four">
                404
            </div>
            <div class="words">
                <span class="sorry">SORRY,</span><span class="long">THIS PAGE IS NOT FOUND!</span>
            </div>
            <div class="btn">
                <button class="back" @click="back" @mousedown="onMousedown" @mouseup="onMouseup"
                    :class="{ ondown: down }">BACK
                    TO PREVIOUS</button>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const down = ref(false)
const router = useRouter()
const onMousedown = () => {
    down.value = true
}
const onMouseup = () => {
    down.value = false
}
const back = () => {
    router.back()
}
</script>

<style scoped>
.notFound {
    width: 60%;
    height: 500px;
    margin: 0 auto;
    padding-top: 120px;
    text-align: center;
    display: flex;
    flex-direction: column;
}

.four {
    font-size: 150px;
    font-family: “Arial”, “Microsoft YaHei”, “黑体”, “宋体”, sans-serif;
    color: rgb(129, 129, 129);
    letter-spacing: 10px;
    margin-bottom: 10px;
    font-weight: bolder;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.words {
    font-size: 20px;
    font-family: 12px/1.5 Tahoma, Helvetica, Arial, ‘宋体’, sans-serif;
    font-weight: bold;
    margin-bottom: 40px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.sorry {
    color: rgb(202, 165, 105);
}

.back {
    background: none;
    border: 1px solid rgb(216, 216, 216);
    font-family: 12px/1.5 Tahoma, Helvetica, Arial, ‘宋体’, sans-serif;
    font-weight: 600;
    width: 200px;
    height: 50px;
    cursor: pointer;
}

.back:hover {
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.3);
}

.ondown {
    background: rgb(195, 195, 195);
}

</style>