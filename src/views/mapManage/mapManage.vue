<template>
    <div class="mapManage">
        <div class="btns">
            <el-button type="primary" :icon="Plus" @click="addChapter" class="addbtn">添加章节</el-button>
        </div>
        <div class="mapArea">

        </div>
        <mapCard :chapterSort="cs" :chapterName="cn" :showSec="showSec" @updateChapter="updateChapter"
            @deleteChapter="deleteChapter" @updateKnowledge="updKnowledge" @deleteKnowledege="delKnowledege"
            @createKnowledge="createKnowledge"></mapCard>
        <el-dialog draggable v-model="dialogVisible" :title="title" align-center width="30%">
            <div>
                <el-form :model="chapter" :rules="chapterrules" label-width="100px">
                    <el-form-item label="章节顺序：" prop="chapterSort">
                        <el-col :span="8">
                            <el-input style="width:200px" v-model.number="chapter.chapterSort"
                                placeholder="请输入章节顺序"></el-input>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="章节名称：" prop="chapterName">
                        <el-col :span="8">
                            <el-input style="width:200px" v-model.trim="chapter.chapterName"
                                placeholder="请输入章节名称"></el-input>
                        </el-col>
                    </el-form-item>
                </el-form>
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

        <el-dialog v-model="knowledgeDialogVisible" :title="title">
            <el-form :model="knowledge" :rules="knowledgeRules" label-width="150px">
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
                    <el-button @click="closeKnowledgeDialog">
                        取消
                    </el-button>
                    <el-button type="primary" @click="submitKnowledgeDialog">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import * as d3 from 'd3'
import { ref, reactive } from 'vue'
import mapCard from '@/components/mapManage/manageCard.vue'
import { Plus } from '@element-plus/icons-vue'
import { knowledgeMap, findRelationByCid } from '@/service/modules/knowledge'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { getToken } from '../../utils/getToken'
import { ElMessage, ElMessageBox } from 'element-plus';
import { getAll, updataChapterName, addChapterName, delChapterName, searchChapter } from '../../service/modules/chapter'
import { updateKnowledge, getContent, delKnowledge, getAllChapter, getKnowledgeByChapterId, searchKnowledgeByChapterId, addKnowledge } from '../../service/modules/knowledge'

const nodes = ref([])
const links = ref([])
const addnodes = ref([])
const addlinks = ref([])
const addnodesname = ref([])
const addlinksname = ref([])
const simulation = ref([])
const svgArea = ref({})
const cs = ref(-1)
const cn = ref("")
const cid = ref("")
const showSec = ref([])
const showC = ref(true)
const knowledgeInfo = ref({})

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

knowledgeMap().then(res => {
    nodes.value = res.data.nodes
    // links.value = res.data.links
    init()
})

const drag = (simulation) => {
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0.5);
        // d.fx = null;
        // d.fy = null;
    }

    return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
};

const init = function () {
    const width = 1300
    const height = 900
    const ls = links.value.map(d => Object.create(d))
    const ns = nodes.value.map(d => Object.create(d))
    // const ls = links.value
    // const ns = nodes.value
    simulation.value = d3.forceSimulation(ns)
        .force('link', d3.forceLink(ls).id(d => d.id).distance(100))
        .force('collide', d3.forceCollide().radius(80))
        .force('charge', d3.forceManyBody().strength(-25))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    svgArea.value = d3
        .select('.mapArea')
        .append('svg')
        .attr("viewBox", [-width / 2, -height / 2, width, height])

    const positiveMarker = svgArea.value.append("marker")
        .attr("id", "positiveMarker")
        .attr("orient", "auto")//自动调整方向
        .attr("stroke-width", 2)
        .attr("markerUnits", "strokeWidth")//匹配粗细
        .attr("markerUnits", "userSpaceOnUse")//匹配粗细
        .attr("viewBox", "0 -5 10 10")//箭头所在可视范围
        .attr("refX", 25)//箭头x的偏移
        .attr("refY", 0)//箭头y的偏移
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .append("path")
        .attr("d", "M 0 -5 L 10 0 L 0 5")//绘画箭头的尖端
        .attr("fill", "#999")
        .attr("stroke-opacity", 0.6)

    const negativeMarker = svgArea.value.append("marker")
        .attr("id", "negativeMarker")
        .attr("orient", "auto")//自动调整方向
        .attr("stroke-width", 2)
        .attr("markerUnits", "strokeWidth")//匹配粗细
        .attr("markerUnits", "userSpaceOnUse")//匹配粗细
        .attr("viewBox", "0 -5 10 10")//箭头所在可视范围
        .attr("refX", -15)//箭头x的偏移
        .attr("refY", 0)//箭头y的偏移
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .append("path")
        .attr("d", "M 10 -5 L 0 0 L 10 5")//绘画箭头的尖端
        .attr("fill", "#999")
        .attr("stroke-opacity", 0.6)

    const g = svgArea.value.append('g')

    function zoomed({ transform }) {
        g.attr('transform', transform)
    }

    svgArea.value.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 5])
        .on("zoom", zoomed))

    addlinks.value = g.append('g')
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("marker-end", "url(#direction)")
        // .selectAll("line")
        .selectAll("path")
        .data(ls, function (d) {
            if (typeof (d.source) === 'object') {
                return d.source.id + "_" + d.relationship + "_" + d.target.id
            }
            else {
                return d.source + "_" + d.relationship + "_" + d.target
            }
        })
        // .join("line")
        .join("path")
        .attr("id", function (d) {
            if (typeof (d.source) === 'object') {
                return d.source.id + "_" + d.relationship + "_" + d.target.id
            } else {
                return d.source + "_" + d.relationship + "_" + d.target
            }
        })

    addlinksname.value = g.append("g")
        .attr("class", "mylinksname")
        .selectAll("mylinksname")
        .data(ls, function (d) {
            if (typeof (d.source) === 'object') {
                return d.source.id + "_" + d.relationship + "_" + d.target.id
            }
            else {
                return d.source + "_" + d.relationship + "_" + d.target
            }
        })
        .join("text")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .append("textPath")
        .attr("xlink:href", d => "#" + d.source + "_" + d.relationship + "_" + d.target)
        .attr("startOffset", "50%")
        .text(function (d) {
            {
                return d.relationship
            }
        })

    addnodes.value = g.append('g')
        // .attr("stroke", '#999')
        // .attr("stroke-width", 1.5)
        .selectAll('circle')
        .data(ns, d => d.id)
        .join("circle")
        .attr("r", 20)
        .attr("class", "node")
        .attr("fill", (d) => (d.chapterName ? "tomato" : "#999"))
        .on("click", queryTest)
        // .attr("stroke", (d) => (d.chapterName ? "tomato" : null))
        // .join("text")
        // .text((d) => {
        //     // console.log(d);
        //     // console.log(d.chapterName ? d.chapterName : d.knowledgeName);
        // })
        .call(drag(simulation.value))

    addnodes.value.append('title')
        .text(d => d.chapterName)

    addnodesname.value = g.append("g")
        .attr("class", "my-class")
        .selectAll("my-class")
        .data(ns)
        .join("text")
        .attr("dy", 33)
        .style("text-anchor", "middle")
        .text((d) => {
            return d.chapterName ? d.chapterName : d.knowledgeName
        })
        .call(drag(simulation.value))

    simulation.value.on("tick", () => {
        addlinks.value
            .attr("d", function (d) {
                if (d.source.x < d.target.x) {
                    return "M " + d.source.x + " " + d.source.y + " L " + d.target.x + " " + d.target.y
                } else {
                    return "M " + d.target.x + " " + d.target.y + " L " + d.source.x + " " + d.source.y
                }
            })
            .attr("marker-end", function (d) {
                if (d.source.x < d.target.x) {
                    return "url(#positiveMarker)"
                } else {
                    return null
                }
            })
            .attr("marker-start", function (d) {
                if (d.source.x < d.target.x) {
                    return null
                } else {
                    return "url(#negativeMarker)"
                }
            })

        addnodesname.value
            .attr("x", d => {
                // console.log(d);
                return d.x
            })
            .attr("y", d => d.y);

        addnodes.value
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
    })
    // return svg.node()
}

function queryTest(e, d) {
    if (d.chapterName) {
        showC.value = true
        cid.value = d.id
        cs.value = d.chapterSort
        cn.value = d.chapterName
        showSec.value = []
        findRelationByCid({ id: d.id }).then(res => {
            for (let i = 0; i < res.data.nodes.length; i++) {
                let flag = true
                showSec.value.push({
                    id: res.data.nodes[i].id,
                    knowledgeName: res.data.nodes[i].knowledgeName.low ? res.data.nodes[i].knowledgeName.low : res.data.nodes[i].knowledgeName,
                    knowledgeSort: res.data.nodes[i].knowledgeSort
                })
                for (let j = 0; j < nodes.value.length; j++) {
                    if (nodes.value[j].id == res.data.nodes[i].id) {
                        flag = false
                        break
                    }
                }
                if (flag) {
                    nodes.value.push(res.data.nodes[i])

                    links.value.push({
                        "source": d.id,
                        "target": res.data.nodes[i].id,
                        "relationship": "包含"
                    })
                }
            }
            showSec.value.sort((a, b) => a.knowledgeSort - b.knowledgeSort)
            updateGraph()
        })
    } else {
        return
    }
}

function updateGraph() {
    const ls = links.value.map(d => Object.create(d))
    const ns = nodes.value.map(d => Object.create(d))

    addlinks.value = addlinks.value
        .data(ls, function (d) {
            if (typeof (d.source) === 'object') {
                return d.source.id + "_" + d.relationship + "_" + d.target.id
            }
            else {
                return d.source + "_" + d.relationship + "_" + d.target
            }
        })
        .enter()
        // .append("line")
        .append("path")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("marker-end", "url(#direction)")
        .merge(addlinks.value)
        .attr("id", function (d) {
            if (typeof (d.source) === 'object') {
                return d.source.id + "_" + d.relationship + "_" + d.target.id
            }
            else {
                return d.source + "_" + d.relationship + "_" + d.target
            }
        })
        .attr("class", "link")

    addlinksname.value = addlinksname.value
        .data(ls, function (d) {
            if (typeof (d.source) === 'object') {
                return d.source.id + "_" + d.relationship + "_" + d.target.id
            }
            else {
                return d.source + "_" + d.relationship + "_" + d.target
            }
        })
        .enter()
        .append("text")
        .style("text-anchor", "middle")
        .style("fill", "black")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .append("textPath")
        .attr("xlink:href", function (d) {
            if (typeof (d.source) === 'object') {
                return "#" + d.source.id + "_" + d.relationship + "_" + d.target.id
            }
            else {
                return "#" + d.source + "_" + d.relationship + "_" + d.target
            }
        })
        .attr("startOffset", "50%")
        .merge(addlinksname.value)
        .text(function (d) {
            return d.relationship
        })

    addnodes.value = addnodes.value
        .data(ns, d => d.id)
        .enter()
        .append("circle")
        .attr("r", 20)
        .attr("class", "node")
        .attr("fill", "#999")
        .merge(addnodes.value)
        .on("click", queryTest)
        .call(drag(simulation.value))

    addnodes.value.append('title')
        .text(d => d.chapterName ? d.chapterName : d.knowledgeName.low ? d.knowledgeName.low : d.knowledgeName)

    addnodesname.value = addnodesname.value
        .data(ns)
        .enter()
        .append("text")
        // .attr("class", "my-class")
        // .selectAll("my-class")
        .merge(addnodesname.value)
        // .join("text")
        .attr("dy", 33)
        .style("text-anchor", "middle")
        .text((d) => {
            return d.chapterName ? d.chapterName : d.knowledgeName.low ? d.knowledgeName.low : d.knowledgeName
        })
        .call(drag(simulation.value))

    simulation.value.nodes(ns)
    simulation.value.force("link").links(ls)
    simulation.value.alpha(0.5).restart()
}

const dialogVisible = ref(false)
const title = ref("")

const chapter = ref({
    id: "",
    chapterSort: "",
    chapterName: ""
})

const chapterrules = reactive({
    chapterName: [
        { required: true, message: "章节名不能为空" },
    ],
    chapterSort: [
        { required: true, message: "章节顺序不能为空" },
        { type: 'number', message: "请输入数字" }
    ]
})

const chapterStatus = ref("")

const knowledge = ref({
    id: "",
    knowledgeName: "",
    content: "",
    knowledgeSort: ""
})

const addChapter = () => {
    title.value = "添加章节节点"
    chapterStatus.value = "add"
    chapter.value.chapterName = ""
    chapter.value.chapterSort = ""
    chapter.value.id = ""
    dialogVisible.value = true
}

const closeDialog = () => {
    title.value = ""
    dialogVisible.value = false
    chapter.value.id = ""
    chapter.value.chapterName = ""
    chapter.value.chapterSort = ""
}

const updateChapter = () => {
    title.value = "修改章节节点"
    chapterStatus.value = "update"
    chapter.value.id = cid.value
    chapter.value.chapterName = cn.value
    chapter.value.chapterSort = cs.value
    dialogVisible.value = true
}

const submitDialog = () => {
    if (chapterStatus.value == "update") {
        updataChapterName(chapter.value).then(res => {
            dialogVisible.value = false
            chapter.value.chapterName = ""
            chapter.value.id = 0
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
                d3.select('.mapArea').selectAll('*').remove()
                knowledgeMap().then(res => {
                    nodes.value = res.data.nodes
                    init()
                })
            }
        })
    } else if (chapterStatus.value == "add") {
        addChapterName({ chapterName: chapter.value.chapterName, chapterSort: chapter.value.chapterSort }).then(res => {
            dialogVisible.value = false
            chapter.value.chapterName = ""
            chapter.value.chapterSort = null
            chapter.value.id = 0
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
                d3.select('.mapArea').selectAll('*').remove()
                knowledgeMap().then(res => {
                    nodes.value = res.data.nodes
                    init()
                })
            }
        })
    }
}

const deleteChapter = () => {
    ElMessageBox.confirm(
        `确定要删除"${cn.value}"这一章节吗?"`,
        "删除章节",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: 'warning'
        }
    ).then(r => {
        delChapterName({ id: cid.value }).then(res => {
            if (res.data.code == 0) {
                ElMessage({
                    type: 'error',
                    message: res.data.msg
                })
            } else {
                ElMessage({
                    type: 'success',
                    message: res.data.msg
                })
                d3.select('.mapArea').selectAll('*').remove()
                cn.value = ""
                cs.value = -1
                cid.value = -1
                knowledgeMap().then(res => {
                    nodes.value = res.data.nodes
                    init()
                })
            }
        })
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: "取消删除"
        })
    })
}

const knowledgeDialogVisible = ref(false)
const knowledgeRules = reactive({
    knowledgeName: [
        { required: true, message: "知识点名称不能为空" },
    ],
    knowledgeSort: [
        { required: true, message: "知识点顺序不能为空" },
        { type: 'number', message: "请输入数字" }
    ]
})
const knowledgeStatus = ref("")

const updKnowledge = (arr) => {
    title.value = "修改知识点"
    knowledgeStatus.value = "update"
    getContent({ id: arr[0] }).then(res => {
        editorRef.value.setHtml(res.data.data.content)
        knowledge.value.knowledgeName = arr[1]
        knowledge.value.knowledgeSort = arr[2]
        knowledge.value.id = arr[0]
    })
    knowledgeDialogVisible.value = true
}

const delKnowledege = (arr) => {
    ElMessageBox.confirm(
        `确定要删除"${arr[1]}"这一知识点吗?"`,
        "删除知识点",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: 'warning'
        }
    ).then(r => {
        delKnowledge({ id: arr[0] }).then(res => {
            ElMessage({
                type: "success",
                message: res.data.msg
            })
            d3.select('.mapArea').selectAll('*').remove()
            nodes.value = []
            links.value = []
            addnodes.value = []
            addlinks.value = []
            addnodesname.value = []
            addlinksname.value = []
            simulation.value = []
            svgArea.value = {}
            knowledgeMap().then(res => {
                nodes.value = res.data.nodes
                init()
                findRelationByCid({ id: cid.value }).then(res => {
                    showSec.value = []
                    for (let i = 0; i < res.data.nodes.length; i++) {
                        let flag = true
                        showSec.value.push({
                            id: res.data.nodes[i].id,
                            knowledgeName: res.data.nodes[i].knowledgeName.low ? res.data.nodes[i].knowledgeName.low : res.data.nodes[i].knowledgeName,
                            knowledgeSort: res.data.nodes[i].knowledgeSort
                        })
                        for (let j = 0; j < nodes.value.length; j++) {
                            if (nodes.value[j].id == res.data.nodes[i].id) {
                                flag = false
                                break
                            }
                        }
                        if (flag) {
                            nodes.value.push(res.data.nodes[i])

                            links.value.push({
                                "source": cid.value,
                                "target": res.data.nodes[i].id,
                                "relationship": "包含"
                            })
                        }
                    }
                    showSec.value.sort((a, b) => a.knowledgeSort - b.knowledgeSort)
                    updateGraph()
                })
            })


        })
    }).catch(() => {
        ElMessage({
            type: "info",
            message: "取消删除"
        })
    })
}

const createKnowledge = () => {
    title.value = "创建知识点"
    knowledgeStatus.value = "add"
    knowledge.value.id = ""
    knowledge.value.content = ""
    knowledge.value.knowledgeName = ""
    knowledge.value.knowledgeSort = ""
    knowledgeDialogVisible.value = true

}

const closeKnowledgeDialog = () => {
    knowledgeDialogVisible.value = false
    title.value = ""
    knowledgeStatus.value = ""
    knowledge.value.id = ""
    knowledge.value.content = ""
    knowledge.value.knowledgeName = ""
    knowledge.value.knowledgeSort = ""
}

const submitKnowledgeDialog = () => {
    if (knowledgeStatus.value == "update") {
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
                knowledge.value.content = ""
                knowledge.value.id = ""
                knowledge.value.knowledgeName = ""
                knowledge.value.knowledgeSort = ""
                knowledgeDialogVisible.value = false
                findRelationByCid({ id: cid.value }).then(res => {
                    showSec.value = []
                    for (let i = 0; i < res.data.nodes.length; i++) {
                        let flag = true
                        showSec.value.push({
                            id: res.data.nodes[i].id,
                            knowledgeName: res.data.nodes[i].knowledgeName.low ? res.data.nodes[i].knowledgeName.low : res.data.nodes[i].knowledgeName,
                            knowledgeSort: res.data.nodes[i].knowledgeSort
                        })
                        for (let j = 0; j < nodes.value.length; j++) {
                            if (nodes.value[j].id == res.data.nodes[i].id) {
                                nodes.value[j].knowledgeName = res.data.nodes[i].knowledgeName
                                nodes.value[j].knowledgeSort = res.data.nodes[i].knowledgeSort
                                links.value.push({
                                    "source": cid.value,
                                    "target": res.data.nodes[i].id,
                                    "relationship": "包含"
                                })
                                // flag = false
                                break
                            }
                        }
                    }
                    showSec.value.sort((a, b) => a.knowledgeSort - b.knowledgeSort)
                    updateGraph()
                })
            }
        })
    } else if (knowledgeStatus.value == "add") {
        addKnowledge({
            knowledgeName: knowledge.value.knowledgeName,
            knowledgeSort: knowledge.value.knowledgeSort,
            content: editorRef.value.getHtml(),
            chapterId: cid.value
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
                knowledge.value.content = ""
                knowledge.value.id = ""
                knowledge.value.knowledgeName = ""
                knowledge.value.knowledgeSort = ""
                knowledgeDialogVisible.value = false
                findRelationByCid({ id: cid.value }).then(res => {
                    showSec.value = []
                    for (let i = 0; i < res.data.nodes.length; i++) {
                        let flag = true
                        showSec.value.push({
                            id: res.data.nodes[i].id,
                            knowledgeName: res.data.nodes[i].knowledgeName.low ? res.data.nodes[i].knowledgeName.low : res.data.nodes[i].knowledgeName,
                            knowledgeSort: res.data.nodes[i].knowledgeSort
                        })
                        for (let j = 0; j < nodes.value.length; j++) {
                            if (nodes.value[j].id == res.data.nodes[i].id) {
                                flag = false
                                break
                            }
                        }
                        if (flag) {
                            nodes.value.push(res.data.nodes[i])
                            links.value.push({
                                "source": cid.value,
                                "target": res.data.nodes[i].id,
                                "relationship": "包含"
                            })
                        }
                    }
                    showSec.value.sort((a, b) => a.knowledgeSort - b.knowledgeSort)
                    updateGraph()
                })
            }
        })
    }
}

</script>

<style scoped>
.mapManage {
    margin: 0 auto;
}

.btns {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.addbtn {
    margin-left: 100px;
}

.mapArea {
    margin: 0 0 0 100px;
    width: 900px;
    height: 500px;
    border-radius: 10px;
    border: 1px solid #ccc;
    overflow: hidden;
}

.classA {
    display: block;
    padding: 2px;
    background-color: aquamarine;
}

.style-text {
    display: block;
    padding: 2px;
    background-color: aquamarine;
}

.node {
    stroke: #999;
    stroke-width: 1;
    cursor: pointer !important;
}

.node:hover {
    stroke-width: 5;
}

.inner {
    margin-left: 54px;
    margin-bottom: 10px;
}
</style>