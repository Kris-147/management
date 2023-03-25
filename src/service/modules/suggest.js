import myAxios from '../index'

export function initTable(params) {
    return myAxios({
        url: `/suggest/all?limit=${params.limit}&offset=${params.offset}&searchName=${params?.searchName}`,
        method: "get"
    }, {
        loading: {
            value: true
        },
        repeat_request_cancel: {
            value: false
        }
    }, {
        text: "获取信息中...",
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

export function handleSug(params) {
    return myAxios({
        url: "/suggest/handle",
        method: "post",
        data: params
    })
}

export function delSug(params) {
    return myAxios({
        url: "/suggest/del",
        method: "post",
        data: params
    })
}