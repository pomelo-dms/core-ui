<template>
  <Header/>
  <div class="mysql-container">
    <div class="mysql-aside">
      <div id="mysql-aside-info">
        <el-descriptions size="default" :column="2" title="数据源信息">
          <el-descriptions-item label="名称：">{{ dataSourceInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="类型：">
            <el-tag size="small">{{ dataSourceInfo.type == 1 ? 'MySQL' : 'Redis' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="数据库数量：">
            <span style="text-decoration: underline"> {{ dbCount }} </span> 个
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <el-divider/>
      <div class="mysql-aside-tree-box">
        <MySQLTree :data-source-id="dataSourceId"/>
      </div>
    </div>
    <div class="mysql-main">
      <h1>首页</h1>
    </div>
  </div>
</template>

<script setup>
import Header from "../../components/Header.vue";
import {onMounted, ref} from "vue";
import dataSourceApi from '../../utils/api/dataSource.js'
import {useRoute} from "vue-router";
import MySQLTree from "../../components/mysql/MySQLTree.vue";

const route = useRoute()
// 当前数据源 id
const dataSourceId = ref(route.query.dataSourceId)

const dataSourceInfo = ref({})
const dbCount = ref(0)

onMounted(() => {
  getDataSourceInfo()
})

// 获取数据源信息
function getDataSourceInfo() {
  dataSourceApi.getDataSource(dataSourceId.value)
      .then(res => {
        dataSourceInfo.value = res.data
      })
}
</script>

<style scoped>
.mysql-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 50px);
}

.mysql-aside {
  width: 300px;
  height: inherit;
  padding-left: 10px;
}

.mysql-main {
  background-color: #d98d8d;
  flex: 1;
  height: inherit;
}
.el-divider--horizontal{
  margin: 5px 0;
}
</style>