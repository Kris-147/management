import myAxios from '../index'

export function getAllChapter() {
    return myAxios({
        url: '/chapter/getallchapter',
        method: "get"
    }, {
        loading: {
            value: true
        }
    }, {
        text: "获取数据中...",
        background: 'rgba(0,0,0,0.7)'
    })
}

export function getKnowledgeByChapterId(params) {
    return myAxios({
        url: "/knowledge/bychapter?chapterId=" + params.chapterId + "&offset=" + params.offset + "&limit=" + params.limit,
        method: "get"
    })
}

export function searchKnowledgeByChapterId(params) {
    return myAxios({
        url: "/knowledge/searchbychapter?chapterId=" + params.chapterId + "&offset=" + params.offset + "&limit=" + params.limit + "&searchName=" + params.searchName,
        method: "get"
    })
}

export function addKnowledge(params) {
    return myAxios({
        url: "/knowledge/add",
        method: "post",
        data: params
    }, {
        loading: {
            value: true
        }
    }, {
        text: "上传数据中...",
        background: 'rgba(0,0,0,0.7)'
    })
}

export function delKnowledge(params) {
    return myAxios({
        url: "/knowledge/del",
        method: "post",
        data: params
    })
}

export function getContent(params) {
    return myAxios({
        url: "/knowledge/content?id=" + params.id,
        method: "get"
    })
}

export function updateKnowledge(params) {
    return myAxios({
        url: "/knowledge/update",
        method: "post",
        data: params
    })
}