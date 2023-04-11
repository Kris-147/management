<template>
    <div class="mapManage">
        <div class="btns">
            <el-button type="primary" :icon="Plus" @click="addChapter" class="addbtn">添加章节</el-button>
        </div>
        <div class="mapArea">

        </div>
        <mapCard :chapterSort="cs" :chapterName="cn" :showSec="showSec" @updateChapter="updateChapter"></mapCard>
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
    </div>
</template>

<script setup>
import * as d3 from 'd3'
import { ref } from 'vue'
import mapCard from '@/components/mapManage/manageCard.vue'
import { Plus } from '@element-plus/icons-vue'
import { knowledgeMap, findRelationByCid } from '@/service/modules/knowledge'
import { getAll, updataChapterName, addChapterName, delChapterName, searchChapter } from '../../service/modules/chapter'

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
        // addlinks.value
        //     .attr('x1', d => {
        //         // console.log(d);
        //         return d.source.x
        //     })
        //     .attr("y1", d => d.source.y)
        //     .attr("x2", d => d.target.x)
        //     .attr("y2", d => d.target.y);

        // addlinks.value
        // .attr("d",d => "M " + d.source.x + " " + d.source.y + " L " + d.target.x + " " + d.target.y)

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
                    knowledgeName: res.data.nodes[i].knowledgeName,
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
        showC.value = false
        for (let i = 0; i < links.value.length; i++) {
            if (links.value[i].target == d.id) {
                cs.value = links.value[i].source
                break
            }
        }
        for (let i = 0; i < nodes.value.length; i++) {
            if (nodes.value[i].chapterSort == cs.value) {
                cn.value = nodes.value[i].chapterName
                break
            }
        }
        knowledgeInfo.value = {
            knowledgeId: d.id,
            knowledgeSort: d.knowledgeSort,
            knowledgeName: d.knowledgeName
        }
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
        .text(d => d.chapterName ? d.chapterName : d.knowledgeName)

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
            return d.chapterName ? d.chapterName : d.knowledgeName
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
</style>