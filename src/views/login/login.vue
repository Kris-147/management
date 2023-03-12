<template>
    <div class="login">
        <el-form :model="user" class="loginContainer" :rules="rules" ref="loginForm">
            <h3 class="loginTitle">网站后台管理系统</h3>
            <el-form-item prop="username">
                <el-input type="text" auto-complete="false" v-model="user.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" auto-complete="false" v-model="user.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input type="text" auto-complete="false" v-model="user.code" placeholder="点击图片更换验证码"
                    style="width:240px;margin-right: 5px;float: left;"></el-input>
                <div @click="changeCaptcha" v-html="captchaSrc" style="float:right" alt="加载中..."></div>
            </el-form-item>
            <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
            <el-button type="primary" style="width: 100%" @click="submitLogin(loginForm)">登录</el-button>
        </el-form>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router'
import { getCaptcha, login } from "../../service/modules/user"
let Base64 = require('js-base64').Base64

const user = ref({
    username: "",
    password: "",
    code: ""
})

const checked = ref(false)

const captchaSrc = ref(null)
getCaptcha().then(res => {
    captchaSrc.value = res.data
})
const changeCaptcha = function () {
    getCaptcha().then(res => {
        captchaSrc.value = res.data
    })
}

const localUsername = localStorage.getItem('username')
if (localUsername) {
    user.value.username = localStorage.getItem('username')
    user.value.password = Base64.decode(localStorage.getItem('password'))
    checked.value = true
}

const router = useRouter()

const rules = reactive({
    username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ],
})

const loginForm = ref(null)
const submitLogin = async function (loginForm) {
    await loginForm.validate((valid) => {
        if (valid) {
            if (checked.value) {
                let password = Base64.encode(user.value.password)
                localStorage.setItem("username", user.value.username)
                localStorage.setItem("password", password)
            } else {
                localStorage.removeItem("username")
                localStorage.removeItem("password")
            }
            login(user.value).then(res => {
                console.log(res);
                if (res.data.code == 0) {
                    ElMessage({
                        message: res.data.msg,
                        type: "error"
                    })
                } else {
                    localStorage.setItem("token", "Bearer " + res.data.data.token)
                    localStorage.setItem("userId", res.data.data.id)
                    ElMessage({
                        message: "登录成功",
                        type: "success"
                    })
                    router.push('/home')
                }
            })
        } else {
            ElMessage({
                message: "请输入所有字段",
                type: "error"
            })
        }
    })
}
</script>

<style scoped>
.login {
    overflow: hidden;
}

.loginContainer {
    position: relative;
    border-radius: 15px;
    background-clip: padding-box;
    margin: 150px auto 180px auto;
    width: 350px;
    padding: 15px 35px 25px 35px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
    margin: 10px auto 30px auto;
    text-align: center;
    color: #505458;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.loginRemember {
    text-align: left;
    margin: 0 0 15px 0;
}
</style>