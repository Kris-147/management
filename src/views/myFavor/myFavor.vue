<template>
    <div class="myfavor">
        <div class="title">
            我的收藏
        </div>
        <div class="box">
            <el-skeleton :loading="loading" animated>
                <template #template>
                    <el-skeleton-item variant="h1" style="width: 240px;margin:20px 0 0 20px;" />
                    <el-skeleton-item variant="h3" style="display: block;width: 90%;margin: 10px 0 0 20px;" />
                    <el-skeleton-item variant="p" style="margin: 10px 0 0 20px;width: 90%;" />
                    <el-skeleton-item variant="p" style="margin: 10px 0 10px 20px;width: 90%;" />
                    <el-skeleton-item variant="h1" style="width: 240px;margin:20px 0 0 20px;" />
                    <el-skeleton-item variant="h3" style="display: block;width: 90%;margin: 10px 0 0 20px;" />
                    <el-skeleton-item variant="p" style="margin: 10px 0 0 20px;width: 90%;" />
                    <el-skeleton-item variant="p" style="margin: 10px 0 10px 20px;width: 90%;" />
                    <el-skeleton-item variant="h1" style="width: 240px;margin:20px 0 0 20px;" />
                    <el-skeleton-item variant="h3" style="display: block;width: 90%;margin: 10px 0 0 20px;" />
                    <el-skeleton-item variant="p" style="margin: 10px 0 0 20px;width: 90%;" />
                    <el-skeleton-item variant="p" style="margin: 10px 0 10px 20px;width: 90%;" />
                </template>
                <template #default>
                    <template v-for="(item, index) in fdata" :key="item.id">
                        <div class="item" @click="gocourse(item.id)">
                            <div class="sectitle">
                                {{ item.knowledgeName }}
                            </div>
                            <div class="seccontent">
                                {{ item.content }}
                            </div>
                            <div class="show">
                                <div class="like">
                                    <el-icon :size="20" class="likeicon">
                                        <Flag />
                                    </el-icon>
                                    <span>{{ item.likesCount }}</span>
                                </div>
                                <div class="favor">
                                    <el-icon :size="20" class="favoricon">
                                        <StarFilled />
                                    </el-icon>
                                    <span>{{ item.favorCount }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>
            </el-skeleton>
        </div>
    </div>
</template>

<script setup>
import {
    StarFilled, Flag
} from '@element-plus/icons-vue'
import { initfavor } from '@/service/modules/userHome'
import { useRouter } from 'vue-router'
import { ElSkeleton } from 'element-plus';
import { ref } from 'vue';

const loading = ref(true)

const fdata = ref([])
initfavor().then(res => {
    if (res.data.code == 1) {
        fdata.value = [...res.data.data]
        loading.value = false
    }
})

const router = useRouter()
const gocourse = (id) => {
    router.push('/home/course/' + id)
}
</script>

<style scoped>
.myfavor {
    margin: 0 auto;
    width: 800px;
    background-color: white;
    margin-top: 30px;
    border-radius: 10px;
}

.title {
    height: 60px;
    font-size: 40px;
    padding: 20px 0 10px 20px;
    border-bottom: 1px solid rgb(201, 201, 201);
}

.box {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.item {
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.sectitle {
    font-size: 20px;
    margin-left: 10px;
    margin-top: 10px;
    font-weight: 800;
}

.seccontent {
    margin: 10px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.show {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
}

.like,
.favor {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 10px;
    margin-left: 10px;
}

.item:hover {
    background-color: rgb(250, 250, 250);
    cursor: pointer;
}
</style>