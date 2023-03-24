import myAxios from "../index";

export function usergetall() {
    return myAxios({
        url: "/chapter/usergetall",
        method: "get"
    })
}

export function getcontent(params) {
    return myAxios({
        url: "/chapter/getcontent?kid=" + params.kid,
        method: "get"
    })
}

export function getlikescount(params) {
    return myAxios({
        url: "/likes/count?kid=" + params.kid,
        method: "get"
    })
}

export function getfavorcount(params) {
    return myAxios({
        url: "/favor/count?kid=" + params.kid,
        method: "get"
    })
}

export function islike(params) {
    return myAxios({
        url: "/likes/islikes",
        method: "post",
        data: params
    })
}

export function isfavor(params) {
    return myAxios({
        url: "/favor/isfavor",
        method: "post",
        data: params
    })
}