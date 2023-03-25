import myAxios from "../index";

export function initTable(params) {
    return myAxios({
        url: `/politics/all?limit=${params.limit}&offset=${params.offset}&searchName=${params?.searchName}`,
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

export function getContent(params) {
    return myAxios({
        url: "/politics/content?id=" + params.id,
        method: "get"
    })
}

export function updatePolitics(params) {
    return myAxios({
        url: "/politics/update",
        method: "post",
        data: params
    })
}

export function insertPolitics(params) {
    return myAxios({
        url: "/politics/add",
        method: "post",
        data: params
    })
}

export function delPolitics(params) {
    return myAxios({
        url: "/politics/del",
        method: "post",
        data: params
    })
}