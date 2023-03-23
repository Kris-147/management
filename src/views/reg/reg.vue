<template>
    <div class="reg">
        <el-form :model="user" class="loginContainer" :rules="rules" ref="loginForm">
            <h3 class="loginTitle">注册</h3>
            <el-form-item prop="username">
                <el-input type="text" auto-complete="false" v-model="user.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="email">
                <el-input type="text" auto-complete="false" v-model="user.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" auto-complete="false" v-model="user.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="secpassword">
                <el-input type="password" auto-complete="false" v-model="user.secpassword" placeholder="请再次输入密码"></el-input>
            </el-form-item>
            <el-button type="primary" style="width: 100%" @click="submitLogin(loginForm)">登录</el-button>
        </el-form>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router'
import { userreg } from "../../service/modules/user"
import useLogin from '@/stores/modules/login';
let Base64 = require('js-base64').Base64

const user = ref({
    username: "",
    password: "",
    email:"",
    secpassword:""
})

const router = useRouter()
const loginStore = useLogin()
const checksec = (rule,value,callback) => {
    if(value === ''){
        callback(new Error('请再次输入密码'))
    }else if(value !== user.value.password){
        callback(new Error('两次密码不一致'))
    }else{
        callback()
    }
}
const rules = reactive({
    username: [
        { required: true, message: "请输入用户名,长度为5到10位", trigger: "blur" },
        {min:5,max:10,message:'长度为5到10位',trigger: ['blur', 'change']}
    ],
    password: [
        { required: true, message: "请输入密码,长度为8到16位", trigger: "blur" },
        {min:8,max:16, message: "长度为8到16位",trigger: ['blur', 'change']}
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        {type:'email',message:"请输入正确的邮箱",trigger: ['blur', 'change']}
    ],
    secpassword:[
        {validator:checksec,trigger:['blur', 'change']}
    ]
})

const loginForm = ref(null)
const submitLogin = async function (loginForm) {
    await loginForm.validate((valid) => {
        if (valid) {
            userreg({username:user.value.username,password:user.value.password,email:user.value.email}).then(res => {
                if (res.data.code == 1) {
                    ElMessage({
                        message: "注册成功",
                        type: "success"
                    })
                    router.back()
                } else {
                    ElMessage({
                        message: res.data.msg,
                        type: "error"
                    })
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
.reg {
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
</style>