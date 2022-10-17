<template>
<Header/>
  <div class="mysql-container">
    <div class="mysql-aside">
      <div id="mysql-aside-info">
        <p>数据源信息：xx   数据源信息：xx</p>
        <p>数据源信息：xx</p>
      </div>
      <hr>
      <div class="mysql-aside-tree-box">
        <h1>树形菜单区域</h1>
      </div>
    </div>
    <div class="mysql-main">
      <h1>首页</h1>
    </div>
  </div>
</template>

<script>
import Header from "../../components/Header.vue";
export default {
  name: "MySQLView",
  components: {Header},

}
</script>

<style scoped>
.mysql-container{
  display: flex;
  background-color: #f1e232;
  width: 100%;
  height: calc(100vh - 50px);
}
.mysql-aside{
  width: 300px;
  height: inherit;
  background-color: #e186d2;
}
.mysql-main{
  background-color: #d98d8d;
  /*width: calc(100% - 300px);*/
  flex: 1;
  height: inherit;
}
</style>