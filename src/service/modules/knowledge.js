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