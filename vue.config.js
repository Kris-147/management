const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
let proxyObj = {}
proxyObj['/'] = {
    //websocket
    ws: false,
    //目标地址
    target: 'http://localhost:3000',
    //发送请求头中host会设置成target
    changeOrigin: true,
    //重写请求地址
    pathRewrite: {
        '^/': '/'
    }
}
module.exports = defineConfig({
    transpileDependencies: true,
    configureWebpack: {
        plugins: [
            AutoImport({
                // Auto import functions from Vue, e.g. ref, reactive, toRef...
                // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
                imports: ["vue"],

                // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
                // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
                resolvers: [
                    ElementPlusResolver(),

                    // Auto import icon components
                    // 自动导入图标组件
                    // IconsResolver({
                    //   prefix: "Icon",
                    // }),
                ],
            }),

            Components({
                resolvers: [
                    // Auto register icon components
                    // 自动注册图标组件
                    // IconsResolver({
                    //   enabledCollections: ["ep"],
                    // }),
                    // Auto register Element Plus components
                    // 自动导入 Element Plus 组件
                    ElementPlusResolver(),
                ],
            }),
        ],
    },
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: proxyObj
    }
})