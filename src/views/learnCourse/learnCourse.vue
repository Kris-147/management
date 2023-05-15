<template>
    <div class="learncourse">
        <div class="inner">
            <el-skeleton :loading="loading" animated>
                <template #template>
                    <el-skeleton-item variant="h1" style="width: 240px;margin-bottom: 10px;" />
                    <el-skeleton-item variant="h3" style="display: block;width: 360px;margin-bottom: 10px;" />
                    <el-skeleton-item variant="p" style="margin: 10px 0;" />
                    <el-skeleton-item variant="p" style="margin: 10px 0;" />
                    <el-skeleton-item variant="p" style="margin: 10px 0;" />
                    <el-skeleton-item variant="image" style="width: 240px; height: 240px;margin: 0 auto;" />
                    <el-skeleton-item variant="p" style="margin: 10px 0;" />
                    <el-skeleton-item variant="p" style="margin: 10px 0;" />
                    <el-skeleton-item variant="p" style="margin: 10px 0;" />
                </template>
                <template #default>
                    <div class="chaptername">
                        {{ knowledge.chapterSort }}.{{ knowledge.chapterName }}
                    </div>
                    <div class="section">
                        <div class="knowledgename">{{ knowledge.chapterSort }}.{{ knowledge.knowledgeSort }} {{
                            knowledge.sectionName }}</div>
                        <div class="time">{{ knowledge.time }}</div>
                    </div>
                    <div class="content" v-html="knowledge.content">
                    </div>
                    <template v-if="politics.length">
                        <div class="politicsTitle">
                            思政素材
                        </div>
                        <template v-for="item in politics" :key="item.pname">
                            <div class="politicsName">
                                {{ item.pname }}
                            </div>
                            <div class="politicsContent" v-html="item.pcontent"></div>
                        </template>
                    </template>
                </template>
            </el-skeleton>
        </div>

        <div class="leftbtns">
            <div class="back" @click="clickBack">
                <el-icon :size="26" class="backicon">
                    <Back />
                </el-icon>
                <span>返回</span>
            </div>
            <div class="like" @click="clickLike">
                <el-icon :size="26" class="likeicon" :class="{ isicon: islikes }">
                    <Flag />
                </el-icon>
                <span :class="{ isicon: islikes }">点赞</span>
                <div class="likenumber" :class="{ isnumber: islikes }">
                    {{ likeNumber }}
                </div>
            </div>
            <div class="favor" @click="clickFavor">
                <el-icon :size="26" class="favoricon" :class="{ isicon: isfavors }">
                    <StarFilled />
                </el-icon>
                <span :class="{ isicon: isfavors }">收藏</span>
                <div class="favornumber" :class="{ isnumber: isfavors }">
                    {{ favorNumber }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import { getcontent, getlikescount, getfavorcount, islike, isfavor, addlike, dellike, addfavor, delfavor } from '@/service/modules/userHome'
import { ElMessage, ElSkeleton } from 'element-plus';
import {
    Back, StarFilled, Flag
} from '@element-plus/icons-vue'
import { getToken } from '@/utils/getToken'

document.title = "加载中..."

const knowledge = ref({
    chapterSort: "",
    knowledgeSort: "",
    chapterName: "",
    sectionName: "",
    content: "",
    time: ""
})
const politics = ref([])
document.body.scrollTop = 0

const loading = ref(true)
const route = useRoute()
function addDateZero(num) {
    return (num < 10 ? "0" + num : num);
}
getcontent({ kid: route.params.kid }).then(res => {
    knowledge.value.chapterName = res.data.data.knowledge.chapterName
    knowledge.value.sectionName = res.data.data.knowledge.knowledgeName
    knowledge.value.content = res.data.data.knowledge.content
    knowledge.value.chapterSort = res.data.data.knowledge.chapterSort
    knowledge.value.knowledgeSort = res.data.data.knowledge.knowledgeSort
    document.title = `${knowledge.value.chapterSort}.${knowledge.value.knowledgeSort} ${knowledge.value.sectionName}`
    let d = new Date(res.data.data.knowledge.updatedAt)
    let formatdatetime = d.getFullYear() + '-' + addDateZero(d.getMonth() + 1) + '-' + addDateZero(d.getDate()) + ' ' + addDateZero(d.getHours()) + ':' + addDateZero(d.getMinutes()) + ':' + addDateZero(d.getSeconds());
    knowledge.value.time = formatdatetime
    politics.value = res.data.data.politics
    loading.value = false
})

const likeNumber = ref(0)
const favorNumber = ref(0)
const islikes = ref(false)
const isfavors = ref(false)

function countlikes() {
    getlikescount({ kid: route.params.kid }).then(res => {
        likeNumber.value = Number(res.data.data)
    })
}

function countfavors() {
    getfavorcount({ kid: route.params.kid }).then(res => {
        favorNumber.value = Number(res.data.data)
    })
}
countlikes()
countfavors()

function getlikefaovrstatus() {
    islike({ kid: route.params.kid }).then(res => {
        islikes.value = res.data.data
    })

    isfavor({ kid: route.params.kid }).then(res => {
        isfavors.value = res.data.data
    })
}

if (getToken()) {
    getlikefaovrstatus()
}

const router = useRouter()
const clickBack = () => {
    router.back()
}

const clickLike = () => {
    if (getToken()) {
        if (islikes.value == true) {
            dellike({ kid: route.params.kid }).then(res => {
                if (res.data.code == 1) {
                    islikes.value = false
                    countlikes()
                }
            })
        } else {
            addlike({ kid: route.params.kid }).then(res => {
                if (res.data.code == 1) {
                    islikes.value = true
                    countlikes()
                }
            })
        }
    } else {
        ElMessage({
            type: "error",
            message: "请先登录！"
        })
    }
}

const clickFavor = () => {
    if (getToken()) {
        if (isfavors.value == true) {
            delfavor({ kid: route.params.kid }).then(res => {
                if (res.data.code == 1) {
                    isfavors.value = false
                    countfavors()
                }
            })
        } else {
            addfavor({ kid: route.params.kid }).then(res => {
                if (res.data.code == 1) {
                    isfavors.value = true
                    countfavors()
                }
            })
        }
    } else {
        ElMessage({
            type: "error",
            message: "请先登录！"
        })
    }
}
</script>

<style scoped>
.inner {
    width: 800px;
    margin: auto;
    border-radius: 10px;
    background-color: #fff;
    padding: 10px 20px 10px 20px;
    margin-top: 30px;
}

.chaptername {
    margin: 10px auto;
    font-size: 40px;
    font-weight: 800;
    /* border-bottom: 2px solid rgb(236, 236, 236); */
}

.section {
    margin-top: 16px;
    border-bottom: 2px solid rgb(236, 236, 236);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.knowledgename {
    font-size: 20px;
}

.content {
    margin-top: 10px;
    line-height: 1.75;
}

.time {
    font-size: 13px;
    color: #545454;
}

.leftbtns {
    position: fixed;
    top: 200px;
    left: 200px
}

.back,
.favor,
.like {
    width: 60px;
    height: 60px;
    background-color: #fff;
    border-radius: 50%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    position: relative;
}

.backicon,
.favoricon,
.likeicon {
    color: rgb(138, 145, 159);
}

.back span,
.favor span,
.like span {
    font-size: 12px;
    color: rgb(138, 145, 159);
}

.back:hover span,
.back:hover .backicon,
.favor:hover span,
.favor:hover .favoricon,
.like:hover span,
.like:hover .likeicon {
    color: rgb(81, 87, 103);
}

.favor,
.like {
    margin-top: 10px;
}

.likenumber,
.favornumber {
    position: absolute;
    left: 75%;
    padding: 0 5px;
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    border-radius: 9px;
    background-color: #c2c8d1;
    color: #fff;
    top: 0;
}

.isicon {
    color: rgb(30, 128, 255) !important;
}

.isnumber {
    background-color: rgb(30, 128, 255);
}

.politicsTitle {
    margin: 10 auto;
    font-size: 40px;
    font-weight: 800;
    margin-bottom: 10px;
    border-bottom: 2px solid rgb(236, 236, 236);
}
.politicsName{
    font-size: 30px;
    margin-bottom: 10px;
}
.politicsContent{
    line-height: 1.75;
}
</style>