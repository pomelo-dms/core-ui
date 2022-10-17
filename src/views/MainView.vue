<template>
  <Header/>
  <el-container class="main">
    <el-aside class="main-aside" width="250px">
      <el-menu class="main-aside-menu" @select="menuClick">
        <el-menu-item index="/welcome">首页</el-menu-item>
        <el-menu-item index="/dataSource">数据源管理</el-menu-item>
        <el-sub-menu index="3">
          <template #title>
            系统管理
          </template>
          <el-menu-item index="#">用户管理</el-menu-item>
          <el-menu-item index="#">权限管理</el-menu-item>
          <el-menu-item index="#">角色管理</el-menu-item>
          <el-menu-item index="#">系统设置</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <div class="main-center-line"></div>
    <el-main class="main-main">
      <router-view/>
    </el-main>
  </el-container>
</template>

<script setup>
import Header from "../components/Header.vue";
import {useRouter} from "vue-router";

const router = useRouter()

function menuClick(index){
  //路由跳转
  router.push(index)
}
</script>

<style scoped>
.main {
  display: flex;
  width: 100%;
}

.main-aside {
  width: 250px;
  height: calc(100vh - 50px);
}

.main-aside .main-aside-menu {
  height: inherit;
  background-color: #f8d3f1;
}

.main-main {
  flex: 1;
}
</style>