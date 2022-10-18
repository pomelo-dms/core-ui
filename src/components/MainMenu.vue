<template>
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
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter()

function menuClick(index){
  //路由跳转
  router.push(index)
}
</script>

<style scoped>

</style>