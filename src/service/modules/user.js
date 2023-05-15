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

export function userlogin(params) {
    return myAxios({
        url: '/user/userlogin',
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

export function userreg(params) {
    return myAxios({
        url: "/user/userreg",
        method: "post",
        data: params
    }, {
        loading: {
            value: true
        },
        repeat_requst_cancel: {
            value: false
        }
    }, {
        text: '注册中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

export function findpassword(params) {
    return myAxios({
        url: "/user/findpassword",
        method: "post",
        data: params
    })
}

export function submitSuggest(params) {
    return myAxios({
        url: "/suggest/submit",
        method: "post",
        data: params
    }, {
        loading: {
            value: true
        }
    }, {
        text: '提交中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

export function resetPassword(params) {
    return myAxios({
        url: "/user/reset",
        method: "post",
        data: params
    }, {
        loading: {
            value: true
        },
        repeat_requst_cancel: {
            value: false
        }
    }, {
        text: '处理中...',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

export function getCode(params) {
    return myAxios({
        url: "/user/getCode",
        method: "post",
        data: params
    }, {
        loading: {
            value: false
        }
    })
}