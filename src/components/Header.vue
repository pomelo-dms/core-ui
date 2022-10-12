<template>
<div class="header-box">
  <img src="../assets/vue.svg" alt="">
  Pomelo xx系统
  <div class="userInfo-box">
    当前用户：一个柚子
  </div>
</div>
</template>

<script>
export default {
  name: "Header"
}
</script>

<style scoped>
.header-box{
  width: 100%;
  height: 50px;
  background-color: aquamarine;
}
.userInfo-box{
  float: right;
}
</style>