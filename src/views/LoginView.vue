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
                  v-model="loginForm.code"
                  placeholder="验证码">
              </el-input>
            </el-col>
            <el-col :span="12">
              <img class="verifyCodeImg" :src="imgUrl" @click="resetCode">
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%;" type="primary" @click="doLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";
import userApi from '../utils/api/user.js'
export default {
  name: "LoginView",
  data() {
    return {
      loginForm: {
        account: 'admin',
        password: 'admin',
        code: ''
      },
      imgUrl: 'http://localhost:9001/api/v1/user/code?time=' + new Date(),
    }
  },
  methods: {
    doLogin() {
      userApi.doLogin(this.loginForm)
          .then(res => {
            if (res.code === 0 && res.data.token) {
              console.log(res)
              window.localStorage.setItem('token', res.data.token)
              this.$router.push('/dataSource')
              ElMessage.success('登录成功～')
            }
          })
    },
    resetCode() {
      this.imgUrl = 'http://localhost:9001/api/v1/user/code?time=' + new Date()
    }
  }
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
  height: 350px;
  border-radius: 10px;
  border: 1px solid lightgray;
  background: white;
}

#container .login-box h1 {
  text-align: center;
  margin-top: 12px;
  margin-bottom: 15px;
}

#container .login-box .form-box {
  padding-left: 20px;
  padding-right: 20px;
}
</style>