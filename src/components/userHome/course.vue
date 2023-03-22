<template>
    <div class="course">
        <div class="banner">
            <div class="meng"></div>
            <div class="con">
                <p class="ctitle">软件测试技术</p>
                <div class="des">
                    《软件测试技术》以软件测试技术和管理为主要研究对象，介绍了软件测试的相关技术和策略。本课程为软件测试技术的学习者提供测试技术介绍及相应思政内容，结构简明合理、层次清晰、由浅入深，注重将软件测试理论知识、技术与工程实践紧密结合。
                </div>
                <button class="startStudy" @click="gotocourse">
                    开始学习
                </button>
            </div>
        </div>
        <div class="container">
            <div class="detailInfo">
                <p class="deInfo">详细介绍</p>
                <div class="deinner" :class="{ open: coll }">
                    <p>
                        <strong>本课程分为3篇，共14章，</strong>
                        <span>涵盖了软件测试技术的方法及所涉及的各方面内容，包括软件测试团队的建立、测试环境的设置和维护、软件测试的组织和管理等。</span>
                    </p>
                    <p>
                        第一篇（第1章 至 第4章）
                    </p>
                    <p>
                        软件测试的原理与方法：介绍软件测试的必要性，引入软件测试的一些基本概念，列举软件测试的相关方法，讲解软件测试流程和规范。
                    </p>
                    <p>
                        第二篇（第5章 至 第9章）
                    </p>
                    <p>
                        软件测试的技术：介绍单元测试与集成测试，并举例分析；多方面讲解系统测试；介绍验收测试过程和相应知识；引入软件本地化测试的概念并举例说明；分析测试自动化及其框架。
                    </p>
                    <p>
                        第三篇（第10章 至 第14章）
                    </p>
                    <p>
                        软件测试项目实践：分析测试需求，介绍测试风险和测试策略，讲解测试计划的内容与编制；设计并维护测试用例；介绍测试环境重要性，讲解部署测试环境过程；描述软件缺陷，介绍相关信息，分析并跟踪软件缺陷；软件测试和质量分析报告。
                    </p>
                    <p>
                        本课程基本涵盖了软件测试的各个方面的知识、从测试设计到测试用例、从测试执行到测试管理、从测试基本理论到测试的实用技术。
                    </p>
                    <p>
                        以及测试工具的具体介绍和使用以及各种常用测测试用例的设计方法以及测试工具在实践项目的使用。
                    </p>
                </div>
                <div class="expend" @click="closeOrOpen">
                    {{ collText }}
                    <el-icon :size="12">
                        <ArrowDownBold v-if="!coll" />
                        <ArrowUpBold v-else />
                    </el-icon>
                </div>
            </div>
            <div class="structure">
                <p class="stitle" id="stitle">课程章节</p>
                <div class="lists">
                    <div class="list">
                        <div class="chapter" @click="changeSecColl">
                            <span class="cnumber">1</span>
                            <span class="cname">第一章 软件测试基础</span>
                            <el-icon :size="18" color="#999" class="cicon">
                                <ArrowDownBold v-if="!secColl"/>
                                <ArrowUpBold v-else/>
                            </el-icon>
                        </div>
                        <div class="sectionlist">
                            <div class="section" :class="{show:secColl}">
                                <span class="sname">1.1 软件测试的重要性</span>
                            </div>
                        </div>
                    </div>
                    <div class="list">
                        <div class="chapter" @click="changeSecColl">
                            <span class="cnumber">1</span>
                            <span class="cname">第一章 软件测试基础</span>
                            <el-icon :size="18" color="#999" class="cicon">
                                <ArrowDownBold v-if="!secColl"/>
                                <ArrowUpBold v-else/>
                            </el-icon>
                        </div>
                        <div class="sectionlist">
                            <div class="section" :class="{show:secColl}">
                                <span class="sname">1.1 软件测试的重要性</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {
    ArrowDownBold, ArrowUpBold
} from '@element-plus/icons-vue'
import { ref,defineEmits } from 'vue'

const coll = ref(false)
const collText = ref('展开')
const closeOrOpen = () => {
    coll.value = !coll.value
    if (coll.value == true) {
        collText.value = '收起'
    } else if (coll.value == false) {
        collText.value = '展开'
    }
}

const secColl = ref(false)
const changeSecColl = () => {
    secColl.value = !secColl.value
}
const emit = defineEmits(['tocourse'])
const gotocourse = () => {
    const stitle = document.querySelector('#stitle')
    emit('tocourse',stitle.offsetTop)
}
</script>

<style scoped>
.course {
    width: 100%;
}

.banner {
    width: 100%;
    height: 366px;
    position: relative;
    background: url("@/assets/course_new.png");
    background-size: cover;
    z-index: 99;
}

.meng {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 1;
}

.con {
    padding: 55px 200px 0;
    position: relative;
    z-index: 2;
    margin: auto;
}

.ctitle {
    color: #fff;
    font-size: 32px;
    line-height: 1.4;
}

.des {
    margin-top: 12px;
    font-size: 14px;
    color: #fff;
    padding-right: 400px;
    line-height: 2;
}

.startStudy {
    position: absolute;
    right: 200px;
    top: 270px;
    background: #fcfcfc;
    text-align: center;
    padding: 13px 0;
    width: 240px;
    border-radius: 4px;
    cursor: pointer;
}

.container {
    margin: auto;
    padding: 0 200px;
}

.detailInfo {
    margin: auto;
    text-align: center;
}

.deInfo {
    font-weight: 500;
    margin-top: 40px;
    color: #333;
    font-size: 34px;
    line-height: 1.4;
    user-select: none;
}

.deinner {
    margin-top: 24px;
    color: #666;
    line-height: 23px;
    font-size: 14px;
    overflow: hidden;
    text-align: left;
    max-height: 78px;
    padding: 0 188px;
}

.expend {
    cursor: pointer;
}

.open {
    max-height: none;
}

.structure {
    width: 800px;
    margin: 40px auto 30px;
}

.stitle {
    text-align: center;
    margin-bottom: 51px;
    color: #333;
    font-size: 34px;
    line-height: 1.4;
    user-select: none;
}

.lists {
    user-select: none;
    cursor: default;
}


.chapter {
    cursor: pointer;
    line-height: 71px;
    font-size: 0;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;
}

.cnumber{
    font-size: 40px;
    color: #c8c8c8;
    padding: 0 26px 0 15px;
    width: 46px;
    text-align: right;
    display: inline-block;
    vertical-align: middle;
}
.cname{
    font-size: 18px;
    color: #333;
    flex: 1;
    display: inline-block;
    vertical-align: middle;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.cicon{
    padding: 0 20px 0 20px;
}
.section{
    line-height: 52px;
    margin-left: 63px;
    font-size: 14px;
    color: #333;
    padding-right: 40px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 0;
}
.show{
    height: auto;
}
.section::before{
    display: inline-block;
    vertical-align: middle;
    width: 8px;
    height: 8px;
    background: #cbcbcb;
    margin-right: 20px;
    content: "";
    border-radius: 50%;
}
.sname{
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}

.chapter:hover .cnumber,.chapter:hover .cname{
    color:rgb(23, 105, 254);
}
</style>