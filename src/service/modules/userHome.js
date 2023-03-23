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