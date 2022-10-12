<template>
  <Header></Header>
  <div class="dataSource-main">
    <el-form :inline="true" class="demo-form-inline" size="default">
      <el-form-item label="输入数据源名称：">
        <el-input v-model="dataSourceName" placeholder="支持模糊搜索"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="doSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="openDataSourceSaveDrawer">添加数据源</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataSourceList"
              border
              style="width: 80%">
      <el-table-column prop="id" label="ID" width="50"/>
      <el-table-column prop="name" label="数据库名称" width="120"/>
      <el-table-column label="数据库类型" width="120" sortable="true">
        <template #default="scope">
          <el-tag>{{ scope.row.type == 1 ? 'MySQL' : 'Redis' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="host" label="主机" width="100"/>
      <el-table-column prop="port" label="端口" width="60"/>
      <el-table-column prop="username" label="数据库用户" width="80"/>
      <el-table-column prop="password" label="密码" v-if="false"/>
      <el-table-column prop="description" label="描述" width="120"/>
      <el-table-column prop="createTime" label="创建时间" width="150"/>
      <el-table-column prop="updateTime" label="更新时间" v-if="false"/>
      <el-table-column prop="enabled" label="是否启用" width="80">
        <template #default="scope">
          <el-switch
              v-model="scope.row.enabled"
              class="ml-2"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="primary" @click="testConnection(scope.$index, scope.row)">连通性测试</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dataSourceApi from "../../utils/api/dataSource.js";
import Header from "../../components/Header.vue";
import SaveDrawer from "./fragments/SaveDrawer.vue";
import {ElMessage, ElNotification} from "element-plus";

export default {
  name: "DataSourceView",
  components: {SaveDrawer, Header},
  data() {
    return {
      currentUser: {},

      dataSourceName: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dataSourceList: [],

      // 抽屉组件传值
      drawer: {}
    }
  },
  created() {
    this.doSearch()
  },
  methods: {
    doSearch() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        keyword: this.dataSourceName,
      }
      dataSourceApi.doSearch(params)
          .then(res => {
            if (res.code === 0) {
              this.dataSourceList = res.data.dataSourceDOList
              this.total = res.data.total
            }
          })
    },
    openDataSourceSaveDrawer() {
      this.drawer.isOpen = true
    },
    testConnection(index, row) {
      console.log(row)
      dataSourceApi.testConnection(row)
          .then(res => {
            console.log(res)
            if (res.code === 0) {
              if (res.data.connected) {
                ElNotification({
                  title: '成功',
                  message: res.msg +'[' + row.name + ']',
                  type: 'success',
                  offset: 20,
                })
              } else {
                ElNotification({
                  title: '数据源连接失败',
                  message: res.data.msg,
                  type: 'error',
                  offset: 20,
                })
              }
            }
          })
    }
  }
}
</script>

<style scoped>
.dataSource-main {
  width: 100%;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>