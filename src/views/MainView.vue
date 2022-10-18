<template>
  <Header/>
  <el-container class="main">
    <el-aside class="main-aside" width="250px">
      <MainMenu/>
    </el-aside>
    <div class="main-center-line"></div>
    <el-main class="main-main">
      <router-view/>
    </el-main>
  </el-container>
</template>

<script setup>
import Header from "../components/Header.vue";
import MainMenu from "../components/MainMenu.vue";

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
  background-color: #f1f2f6;
}

.main-main {
  flex: 1;
}
</style>