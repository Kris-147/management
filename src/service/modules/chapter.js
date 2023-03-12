import myAxios from '../index'

export function getAll(params) {
    return myAxios({
        url: '/chapter/getall/?offset=' + params.offset + "&limit=" + params.limit,
        method: 'get',
    }, {
        loading: {
            value: true
        },
        repeat_request_cancel: {
            value: false
        }
    }, {
        text: "获取章节中...",
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

export function updataChapterName(params) {
    return myAxios({
        url: "/chapter/update",
        method: "post",
        data: params
    }, {
        loading: {
            value: false
        },
        repeat_request_cancel: {
            value: false
        }
    })
}

export function addChapterName(params) {
    return myAxios({
        url: "/chapter/add",
        method: "post",
        data: params
    }, {
        loading: {
            value: false
        },
        repeat_request_cancel: {
            value: false
        }
    })
}

export function delChapterName(params) {
    return myAxios({
        url: "/chapter/del",
        method: "post",
        data: params
    }, {
        loading: {
            value: false
        },
    })
}

export function searchChapter(params) {
    return myAxios({
        url: '/chapter/search/?offset=' + params.offset + "&limit=" + params.limit + "&searchName=" + params.searchName,
        method: "get"
    }, {
        loading: {
            value: true
        }
    }, {
        text: "搜索章节中...",
        background: 'rgba(0, 0, 0, 0.7)'
    })
}