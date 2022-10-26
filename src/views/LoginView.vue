<template>
  <div id="container">
    <div class="login-box">
      <h1>登录</h1>
      <el-form :model="loginForm" size="large" class="form-box">
        <el-form-item>
          <el-input v-model="loginForm.account"/>
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginForm.password"
                    type="password"
                    show-password/>
        </el-form-item>
        <el-form-item prop="verifyCode">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input
                  autofocus
                  ref="code"
                  size="default"
                  v-model="loginForm.code"
                  placeholder="验证码">
              </el-input>
            </el-col>
            <el-col :span="12">
              <img class="verifyCodeImg" :src="imgUrl" @click="resetCode" alt="验证码">
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="rememberMe" label="记住我"></el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%;" type="primary" @click="doLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive} from "vue";
import {ElMessage} from "element-plus";
import userApi from '../utils/api/user.js'
import {userStore} from "../store/user.js";
import {useRouter} from 'vue-router'

const store = userStore()
const router = useRouter()

let loginForm = reactive({
  account: 'admin',
  password: 'admin',
  code: '9527'
})
const rememberMe = ref(true)
let imgUrl = ref(import.meta.env.VITE_BASE_URL + '/user/code?time=' + new Date())

function doLogin() {
  userApi.doLogin(loginForm)
      .then(res => {
        if (res.code === 0 && res.data.token) {
          store.currentUser = res.data
          window.localStorage.setItem('token', res.data.token)
          window.localStorage.setItem('currentUser', JSON.stringify(res.data))
          router.push('/main')
          ElMessage.success('登录成功～')
        }
      })
}

function resetCode() {
  imgUrl.value = import.meta.env.VITE_BASE_URL + '/user/code?time=' + new Date()
}
</script>

<style scoped>
#container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /*background: url("public/pic.webp");*/
  background-image: linear-gradient(#fcec3c, #ee0cc9);
}

#container .login-box {
  width: 350px;
  height: 360px;
  border-radius: 10px;
  border: 1px solid lightgray;
  background: white;
}

#container .login-box h1 {
  text-align: center;
  margin-top: 12px;
  margin-bottom: 15px;
  color: rgb(91, 89, 89);
}

#container .login-box .form-box {
  padding-left: 20px;
  padding-right: 20px;
}

.el-form-item--large {
  margin-bottom: 16px !important;
}
</style>