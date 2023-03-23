<template>
    <div class="userhome">
        <headers @tologin="gologin" @toreg="goreg" ref="headerss"></headers>
        <div class="main">
            <RouterView></RouterView>
        </div>
        <div class="footer">
            <footers></footers>
        </div>
        <swimbox :isshow="show" @totop="gotop"></swimbox>
        <el-dialog v-model="loginDialogVisible" :title="titles[status]" width="30%" center>
            <div v-if="status == 0">
                <el-form :model="loginuser" class="loginContainer" :rules="loginrules" ref="loginForm">
                    <el-form-item prop="username">
                        <el-input type="text" auto-complete="false" v-model="loginuser.username"
                            placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" auto-complete="false" v-model="loginuser.password"
                            placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="code">
                        <el-input type="text" auto-complete="false" v-model="loginuser.code" placeholder="点击图片更换验证码"
                            style="width:240px;margin-right: 5px;float: left;"></el-input>
                        <div @click="changeCaptcha" v-html="captchaSrc" style="float:right" alt="加载中..."></div>
                    </el-form-item>
                    <div style="display: flex;">
                        <el-button type="primary" style="width: 50%" @click="submitLogin(loginForm)">登录</el-button>
                        <el-button style="width: 50%" @click="findPassword">找回密码</el-button>
                    </div>
                </el-form>
            </div>
            <div v-else-if="status == 1">
                <el-form :model="finduser" class="loginContainer" :rules="findrules" ref="findForm">
                    <el-form-item prop="email">
                        <el-input type="text" auto-complete="false" v-model="finduser.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" auto-complete="false" v-model="finduser.password"
                            placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="secpassword">
                        <el-input type="password" auto-complete="false" v-model="finduser.secpassword"
                            placeholder="请再次输入密码"></el-input>
                    </el-form-item>
                    <div style="display: flex;">
                        <el-button type="primary" style="width: 100%" @click="submitfind(findForm)">找回密码</el-button>
                    </div>
                </el-form>
            </div>
            <div v-else-if="status == 2">
                <el-form :model="reguser" class="loginContainer" :rules="regrules" ref="regForm">
                    <el-form-item prop="username">
                        <el-input type="text" auto-complete="false" v-model="reguser.username" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="email">
                        <el-input type="text" auto-complete="false" v-model="reguser.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" auto-complete="false" v-model="reguser.password"
                            placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item prop="secpassword">
                        <el-input type="password" auto-complete="false" v-model="reguser.secpassword"
                            placeholder="请再次输入密码"></el-input>
                    </el-form-item>
                    <el-button type="primary" style="width: 100%" @click="submitReg(regForm)">注册</el-button>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import headers from '@/components/userHome/header.vue'
import footers from '@/components/userHome/footer.vue'
import swimbox from '@/components/userHome/swimbox.vue'
import { useRoute } from 'vue-router'
import { getCaptcha, userlogin, findpassword } from "../../service/modules/user"
import useLogin from '@/stores/modules/login';

const show = ref(false)
const handlescroll = () => {
    if (window.scrollY >= 100) {
        show.value = true
    } else {
        show.value = false
    }
}
const route = useRoute()
onMounted(() => {
    window.addEventListener('scroll', handlescroll, true)
})
const gotop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}

const loginDialogVisible = ref(false)
const status = ref(0)
const titles = ref(['登录', '找回密码', '注册'])

const loginStore = useLogin()
const gologin = () => {
    status.value = 0
    loginDialogVisible.value = true
}

const goreg = () => {
    status.value = 2
    loginDialogVisible.value = true
}

const captchaSrc = ref(null)
getCaptcha().then(res => {
    captchaSrc.value = res.data
})
const changeCaptcha = function () {
    getCaptcha().then(res => {
        captchaSrc.value = res.data
    })
}

const loginuser = ref({
    username: "",
    password: "",
    code: ""
})

const loginrules = reactive({
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

const headerss = ref(null)
const loginForm = ref(null)
const submitLogin = async function (loginForm) {
    await loginForm.validate((valid) => {
        if (valid) {
            userlogin(loginuser.value).then(res => {
                if (res.data.code == 0) {
                    ElMessage({
                        message: res.data.msg,
                        type: "error"
                    })
                } else {
                    localStorage.setItem("token", "Bearer " + res.data.data.token)
                    localStorage.setItem("userId", res.data.data.id)
                    loginStore.userInfo.userId = res.data.data.id
                    loginStore.userInfo.username = res.data.data.username
                    headerss.value.setinfo(true,res.data.data.username)
                    ElMessage({
                        message: "登录成功",
                        type: "success"
                    })
                    loginDialogVisible.value = false
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

const findPassword = () => {
    status.value = 1
}
const finduser = ref({
    email: "",
    password: "",
    secpassword: ""
})
const checksec = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== finduser.value.password) {
        callback(new Error('两次密码不一致'))
    } else {
        callback()
    }
}
const findrules = reactive({
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: "请输入正确的邮箱", trigger: ['blur', 'change'] }
    ],
    password: [
        { required: true, message: "请输入新密码,长度为8到16位", trigger: "blur" },
        { min: 8, max: 16, message: "长度为8到16位", trigger: ['blur', 'change'] }
    ],
    secpassword: [
        { validator: checksec, trigger: ['blur', 'change'] }
    ],
})
const findForm = ref(null)
const submitfind = async function (findForm) {
    await findForm.validate((valid) => {
        if (valid) {
            findpassword(finduser.value).then(res => {
                if (res.data.code == 0) {
                    ElMessage({
                        message: res.data.msg,
                        type: "error"
                    })
                } else {
                    ElMessage({
                        message: "修改成功",
                        type: "success"
                    })
                    loginDialogVisible.value = false
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

const reguser = ref({
    username: "",
    password: "",
    email:"",
    secpassword:""
})

const regrules = reactive({
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
const regForm = ref(null)
const submitReg = async function (regForm) {
    await regForm.validate((valid) => {
        if (valid) {
            userreg({username:user.value.username,password:user.value.password,email:user.value.email}).then(res => {
                if (res.data.code == 1) {
                    ElMessage({
                        message: "注册成功",
                        type: "success"
                    })
                    loginDialogVisible.value = false
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
.main {
    background-color: rgb(242, 243, 245);
    padding: 48px 0 20px 0;

}

.footer {
    height: 115px;
}

.loginContainer {
    position: relative;
    border-radius: 15px;
    background-clip: padding-box;
    margin: auto;
    width: 350px;
    padding: 15px 35px 25px 30px;
    background-color: #fff;
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