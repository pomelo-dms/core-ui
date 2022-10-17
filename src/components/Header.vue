<template>
  <div class="header-box">
    <img src="../assets/vue.svg" alt="">
    Pomelo xx系统
    <div class="userInfo-box">
      <el-dropdown size="default" @command="handleCommand">
    <span class="el-dropdown-link">
      <img src="../../public/avatar.jpg" style="margin-top: 3px;border-radius: 15px;width: 42px;height: 42px;"/>
      <el-icon size="large"><CaretBottom/></el-icon>
    </span>
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
</script>

<style scoped>
.header-box {
  width: 100%;
  height: 50px;
  color: #fff;
  background-color: #292e31;
}

.userInfo-box {
  float: right;
  color: #777676;
  margin-right: 30px;
  line-height: 50px;
}
</style>