import myAxios from "../index";

export function login(params) {
    return myAxios({
        url: '/user/login',
        method: 'post',
        data: params
    }, {
        loading: {
            value: true
        },
        repeat_requst_cancel: {
            value: false
        }
    }, {
        text: '登录中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

export function getCaptcha() {
    return myAxios({
        url: '/user/captcha',
        method: 'get'
    })
}

export function getAllUser(params) {
    return myAxios({
        url: "/user/getall?offset=" + params.offset + "&limit=" + params.limit,
        method: "get"
    }, {
        loading: {
            value: true
        }
    }, {
        text: "用户数据加载中...",
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

export function searchAllUser(params) {
    return myAxios({
        url: "/user/search?offset=" + params.offset + "&limit=" + params.limit + "&searchName=" + params.searchName,
        method: "get"
    })
}

export function createUser(params) {
    return myAxios({
        url: "/user/add",
        method: "post",
        data: params
    })
}

export function updateUser(params) {
    return myAxios({
        url: "/user/update",
        method: "post",
        data: params
    })
}

export function delUser(params) {
    return myAxios({
        url: "/user/del",
        method: "post",
        data: params
    })
}