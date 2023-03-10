import myAxios from "../index";

export function login(params) {
    return myAxios({
        url: '/login/login',
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
        url: '/login/captcha',
        method: 'get'
    })
}