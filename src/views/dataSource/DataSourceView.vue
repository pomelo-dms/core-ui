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
        <el-button type="primary" @click="openCreateDataSourceDrawer">添加数据源</el-button>

      </el-form-item>
    </el-form>
    <DataSourceSaveDrawer ref="dataSourceSaveDrawer"/>
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
          <el-button size="small" type="warning" @click="openUpdateDataSourceDrawer(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="primary" @click="testConnection(scope.$index, scope.row)">连通性测试</el-button>
          <el-button size="small" type="info" @click="goToGoodPlace(scope.$index, scope.row)">进入控制台</el-button>
          <el-button size="small" type="danger" @click="deleteDataSource(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dataSourceApi from "../../utils/api/dataSource.js";
import Header from "../../components/Header.vue";
import DataSourceSaveDrawer from "./fragments/DataSourceSaveDrawer.vue";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";

export default {
  name: "DataSourceView",
  components: {DataSourceSaveDrawer, Header},
  data() {
    return {
      currentUser: {},

      dataSourceName: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dataSourceList: [],
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

    // 测试数据源的连通性
    testConnection(index, row) {
      dataSourceApi.testConnection(row)
          .then(res => {
            if (res.code === 0) {
              if (res.data.connected) {
                ElNotification({
                  title: '成功',
                  message: res.data.msg +'：[' + row.name + ']',
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
    },

    // 打开创建数据源抽屉
    openCreateDataSourceDrawer() {
      this.$refs.dataSourceSaveDrawer.dataSourceId = 0
      this.$refs.dataSourceSaveDrawer.title = '创建数据源'
      this.$refs.dataSourceSaveDrawer.show = true
    },
    openUpdateDataSourceDrawer(index, row) {
      this.$refs.dataSourceSaveDrawer.dataSourceId = row.id
      this.$refs.dataSourceSaveDrawer.title = '修改数据源'
      this.$refs.dataSourceSaveDrawer.show = true
    },
    deleteDataSource(index, row) {
      ElMessageBox.confirm('确定要删除数据源 ['+ row.name +'] 吗？')
          .then(() => {
            dataSourceApi.deleteDataSource(row.id)
                .then(res => {
                  console.log(res)
                  if (res.code === 0 && res.data) {
                    ElMessage.success('数据源删除成功～')
                  } else {
                    ElMessage.error('数据源删除失败：' + res.msg)
                  }
                })
          })
          .catch(() => {
            // catch error
          })
    },
    goToGoodPlace(index, row) {
      dataSourceApi.testConnection(row)
          .then(res => {
            if (res.code === 0) {
              if (res.data.connected) {
                this.$router.push('/console/mysql')
              } else {
                ElNotification({
                  title: '数据源测试连接失败，请先检查数据源参数',
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