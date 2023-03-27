<template>
    <div class="knowledgemap">

    </div>
</template>

<script setup>
// import * as d3 from 'd3'
import * as d3 from 'd3'
import { onMounted, ref } from 'vue'
// import data from '../../mock/data.json'
import { knowledgeMap, findRelationByCid } from '@/service/modules/knowledge'

const nodes = ref([])
const links = ref([])
const addnodes = ref([])
const addlinks = ref([])
const addnodesname = ref([])
const simulation = ref([])
const svgArea = ref({})



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
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
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
    simulation.value = d3.forceSimulation(ns)
        .force('link', d3.forceLink(ls).id(d => d.id).distance(150).strength(0.5))
        .force('collide', d3.forceCollide().radius(() => 50))
        .force('charge', d3.forceManyBody().strength(-10))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    svgArea.value = d3
        .select('.knowledgemap')
        .append('svg')
        .attr("viewBox", [-width / 2, -height / 2, width, height])

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
        .selectAll("line")
        .data(ls)
        .join("line")

    addnodes.value = g.append('g')
        // .attr("stroke", '#999')
        // .attr("stroke-width", 1.5)
        .selectAll('circle')
        .data(ns, d => d.id)
        .join("circle")
        .attr("r", 20)
        .attr("class", "node")
        .attr("fill", (d) => (d.chapterName ? "tomato" : "#999"))
        .on("click",queryTest)
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
            .attr('x1', d => {
                // console.log(d);
                return d.source.x
            })
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

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

function queryTest(e,d){
    findRelationByCid({id:d.id}).then(res => {
        for(let i = 0; i < res.data.nodes.length; i++){
            nodes.value.push(res.data.nodes[i])
        }
        updateGraph()
    })
}

function updateGraph(){
    const ls = links.value.map(d => Object.create(d))
    const ns = nodes.value.map(d => Object.create(d))

    addnodes.value = addnodes.value
        .data(ns, d => d.id)
        .enter()
        .append("circle")
        .attr("r", 20)
        .attr("class", "node")
        .attr("fill", "#999")
        .merge(addnodes.value)
        .on("click",queryTest)
        .call(drag(simulation.value))

    addnodes.value.append('title')
        .text(d => d.chapterName ? d.chapterName : d.knowledgeName)

    simulation.value.nodes(ns)
    simulation.value.force("link").links(ls)
    simulation.value.alpha(1).restart()
}


</script>

<style scoped>
.knowledgemap {
    margin: 10px auto 0;
    width: 900px;
    height: 600px;
    background-color: #fff;
    border-radius: 10px;
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