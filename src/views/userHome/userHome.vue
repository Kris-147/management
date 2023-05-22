<template>
    <div class="userhome">
        <headers @tologin="gologin" @toreg="goreg" ref="headerss" @logout="logout"></headers>
        <div class="main">
            <RouterView v-if="isRouterAlive"></RouterView>
        </div>
        <div class="footer">
            <footers></footers>
        </div>
        <swimbox :isshow="show" @totop="gotop" @suggest="openSuggest"></swimbox>
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
                    <div style="display: flex;align-items: baseline;">
                        <el-form-item prop="code">
                            <el-input style="width:270px" type="text" auto-complete="false" v-model="finduser.code"
                                placeholder="请输入验证码"></el-input>
                        </el-form-item>
                        <span href="javascript:;" @click="sendCode1" style="margin-left: 5px;cursor: pointer;">
                            {{ codeNum1 == 60 ? "发送验证码" : `${codeNum1}秒后重发` }}
                        </span>
                    </div>
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
                        <el-input type="text" auto-complete="false" v-model="reguser.username"
                            placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="email">
                        <el-input type="text" auto-complete="false" v-model="reguser.email" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <div style="display: flex;align-items: baseline;">
                        <el-form-item prop="code">
                            <el-input style="width:270px" type="text" auto-complete="false" v-model="reguser.code"
                                placeholder="请输入验证码"></el-input>
                        </el-form-item>
                        <span href="javascript:;" @click="sendCode" style="margin-left: 5px;cursor: pointer;">
                            {{ codeNum == 60 ? "发送验证码" : `${codeNum}秒后重发` }}
                        </span>
                    </div>

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
            <div v-else-if="status == 3">
                <el-form :model="sug" :rules="sugrules" ref="sugForm">
                    <el-form-item prop="usersug">
                        <el-input resize="none" show-word-limit maxlength="250" :rows="8" type="textarea"
                            auto-complete="false" v-model.trim="sug.usersug" placeholder="请输入反馈内容"></el-input>
                    </el-form-item>
                    <el-button type="primary" style="width: 100%" @click="submitSug(sugForm)">提交</el-button>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import headers from '@/components/userHome/header.vue'
import footers from '@/components/userHome/footer.vue'
import swimbox from '@/components/userHome/swimbox.vue'
import { useRoute } from 'vue-router'
import { getCode, getCaptcha, userlogin, findpassword, submitSuggest, userreg } from "../../service/modules/user"
import useLogin from '@/stores/modules/login';
import { ElMessage } from 'element-plus'


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
const titles = ref(['登录', '找回密码', '注册', '反馈意见'])

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
                    headerss.value.setinfo(true, res.data.data.username)
                    ElMessage({
                        message: "登录成功",
                        type: "success"
                    })
                    loginDialogVisible.value = false
                    loginuser.value.code = ""
                    loginuser.value.password = ""
                    loginuser.value.username = ""
                    reload()
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

let clearId = ref(null)
const codeNum = ref(60)
const isClickSend = ref(false)

const findPassword = () => {
    status.value = 1
}
const finduser = ref({
    email: "",
    code:"",
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
                    finduser.value.code = ""
                    finduser.value.email = ""
                    finduser.value.password = ""
                    finduser.value.secpassword = ""
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

const checksec2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== reguser.value.password) {
        callback(new Error('两次密码不一致'))
    } else {
        callback()
    }
}
const reguser = ref({
    username: "",
    password: "",
    email: "",
    secpassword: "",
    code: ""
})

const regrules = reactive({
    username: [
        { required: true, message: "请输入用户名,长度为5到10位", trigger: "blur" },
        { min: 5, max: 10, message: '长度为5到10位', trigger: ['blur', 'change'] }
    ],
    password: [
        { required: true, message: "请输入密码,长度为8到16位", trigger: "blur" },
        { min: 8, max: 16, message: "长度为8到16位", trigger: ['blur', 'change'] }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: "请输入正确的邮箱", trigger: ['blur', 'change'] }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ],
    secpassword: [
        { validator: checksec2, trigger: ['blur', 'change'] }
    ]
})
const regForm = ref(null)
const submitReg = async function (regForm) {
    await regForm.validate((valid) => {
        if (valid) {
            userreg({ username: reguser.value.username, password: reguser.value.password, email: reguser.value.email,code:reguser.value.code }).then(res => {
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
                    reguser.value.code = ""
                    reguser.value.email = ""
                    reguser.value.password = ""
                    reguser.value.secpassword = ""
                    reguser.value.username = ""
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

const sendCode = () => {
    if (isClickSend.value || codeNum.value != 60) return
    if (!reguser.value.email) {
        ElMessage({
            type: 'error',
            message: "请输入邮箱"
        })
        return
    }
    isClickSend.value = true
    getCode({ email: reguser.value.email,type:"reg" }).then(res => {
        clearId.value = setInterval(() => {
            codeNum.value--
            if (codeNum.value == 0) {
                clearInterval(clearId.value)
                codeNum.value = 60
                isClickSend.value = false
            }
        }, 1000)
    })
}

let clearId1 = ref(null)
const codeNum1 = ref(60)
const isClickSend1 = ref(false)

const sendCode1 = () => {
    if (isClickSend1.value || codeNum1.value != 60) return
    if (!finduser.value.email) {
        ElMessage({
            type: 'error',
            message: "请输入邮箱"
        })
        return
    }
    isClickSend1.value = true
    getCode({ email: finduser.value.email,type:"find" }).then(res => {
        clearId1.value = setInterval(() => {
            codeNum1.value--
            if (codeNum1.value == 0) {
                clearInterval(clearId1.value)
                codeNum1.value = 60
                isClickSend1.value = false
            }
        }, 1000)
    })
}


const isRouterAlive = ref(true)
const reload = () => {
    isRouterAlive.value = false
    nextTick(() => {
        isRouterAlive.value = true
    })
}
const logout = () => {
    reload()
}

const sug = ref({
    usersug: ""
})

const sugrules = reactive({
    usersug: [
        { required: true, message: "请输入意见", trigger: "blur" },
    ]
})

const sugForm = ref(null)

const openSuggest = () => {
    status.value = 3
    loginDialogVisible.value = true
}

const submitSug = async function (sugForm) {
    await sugForm.validate((valid) => {
        if (valid) {
            submitSuggest({ content: sug.value.usersug }).then(res => {
                if (res.data.code == 1) {
                    ElMessage({
                        type: "success",
                        message: res.data.msg
                    })
                    sug.value.usersug = ""
                    loginDialogVisible.value = false
                } else {
                    ElMessage({
                        type: "error",
                        message: res.data.msg
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