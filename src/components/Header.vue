<template>
  <div class="header-box">
    <img class="logo-img" @click="backMain" src="../assets/vue.svg" alt="">
    <h2 class="logo-text">Pomelo 多数据源管理系统</h2>
    <div class="header-menu">
      <slot></slot>
    </div>
    <div class="userInfo-box">
      <el-dropdown size="default" @command="handleCommand">
        <div>
          <img src="/avatar.jpg"
               style="border-radius: 15px;width: 40px;height: 40px;"/>
          <el-icon size="large"><CaretBottom/></el-icon>
          {{ currentUser.name }}
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="changeUser" divided>切换用户</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import {CaretBottom} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from 'element-plus'
// import {useDark, useToggle} from '@vueuse/core'
//
// const isDark = useDark()
// const toggleDark = useToggle(isDark)

const currentUser = JSON.parse(window.localStorage.getItem('currentUser'))
const router = useRouter()

function handleCommand(cmd) {
  switch (cmd) {
    case 'logout':
      ElMessageBox.confirm('您即将退出系统？', '提示', {
        confirmButtonText: '确定退出',
        cancelButtonText: '取消'
      }).then(() => {
        window.localStorage.removeItem('currentUser')
        window.localStorage.removeItem('token')
        router.push('login')
      })
          .catch(() => {
            // catch error
          })
      break;
    case 'changeUser':
      ElMessageBox.confirm('您即将退出系统？', '提示', {
        confirmButtonText: '确定退出',
        cancelButtonText: '取消'
      }).then(() => {
        window.localStorage.removeItem('currentUser')
        window.localStorage.removeItem('token')
        router.push('login')
      })
          .catch(() => {
            // catch error
          })
      break;
    case 'userInfo':
      ElMessage.success('当前用户信息：' + JSON.stringify(currentUser))
      break;
    case 'changePwd':
      ElMessage.warning('功能待实现…')
      break;
    default:
      ElMessage.error('错了，出大错了…')
      break;
  }

}

function backMain() {
  router.push({
    name: 'WelcomeView'
  })
}
</script>

<style scoped>
.header-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  color: #fff;
  background-color: #292e31;
}

.header-box .logo-img {
  width: 30px;
  margin: auto 10px;
}

.header-box .logo-text {
  font-weight: normal;
  font-size: 18px;
}

.header-box .header-menu {
  flex: 1;
  margin: auto 20px;
}

.userInfo-box {
  margin-right: 20px;
}
</style>