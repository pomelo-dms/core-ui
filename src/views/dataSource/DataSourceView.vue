<template>
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
    <DataSourceSaveDrawer
        ref="dataSourceSaveDrawer"
        @refreshDataSourceTable="doSearch"
    />
    <el-table :data="dataSourceList"
              border>
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
          <el-button size="small" type="warning" @click="openUpdateDataSourceDrawer(scope.$index, scope.row)">编辑
          </el-button>
          <el-button size="small" type="primary" @click="testConnection(scope.$index, scope.row)">连通性测试</el-button>
          <el-button size="small" type="info" @click="goToGoodPlace(scope.$index, scope.row)">进入控制台</el-button>
          <el-button size="small" type="danger" @click="deleteDataSource(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import dataSourceApi from "../../utils/api/dataSource.js";
import DataSourceSaveDrawer from "../../components/dataSource/DataSourceSaveDrawer.vue";
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {ref, onMounted} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const dataSourceName = ref('')
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dataSourceList = ref([])

onMounted(() => {
  doSearch()
})

// 数据源表格初始化查询方法
function doSearch() {
  const params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    keyword: dataSourceName.value,
  }
  dataSourceApi.doSearch(params)
      .then(res => {
        if (res.code === 0) {
          dataSourceList.value = res.data.dataSourceDOList
          total.value = res.data.total
        }
      })
}

// 测试数据源的连通性
function testConnection(index, row) {
  dataSourceApi.testConnection(row)
      .then(res => {
        if (res.code === 0) {
          if (res.data.connected) {
            ElNotification({
              title: '成功',
              message: res.data.msg + '：[' + row.name + ']',
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

// 打开创建数据源更新和添加的抽屉
const dataSourceSaveDrawer = ref(null)

// 打开创建数据源抽屉
function openCreateDataSourceDrawer() {
  dataSourceSaveDrawer.value.title = '创建数据源'
  dataSourceSaveDrawer.value.isShow = true
  dataSourceSaveDrawer.value.init()
}
// 打开更新数据源抽屉
function openUpdateDataSourceDrawer(index, row) {
  dataSourceSaveDrawer.value.dataSourceId = row.id
  dataSourceSaveDrawer.value.title = '修改数据源'
  dataSourceSaveDrawer.value.isShow = true
  dataSourceSaveDrawer.value.init()
}

// 删除数据源
function deleteDataSource(index, row) {
  ElMessageBox.confirm('确定要删除数据源 [' + row.name + '] 吗？')
      .then(() => {
        dataSourceApi.deleteDataSource(row.id)
            .then(res => {
              if (res.code === 0 && res.data) {
                doSearch()
                ElMessage.success('数据源删除成功～')
              } else {
                ElMessage.error('数据源删除失败：' + res.msg)
              }
            })
      })
      .catch(() => {
        // catch error
      })
}

// 跳转到控制台
function goToGoodPlace(index, row) {
  dataSourceApi.testConnection(row)
      .then(res => {
        if (res.code === 0) {
          if (res.data.connected) {
            router.push({
              path : '/console/mysql',
              query: {dataSourceId: row.id}
            })
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
</script>

<style scoped>
.dataSource-main {
  width: 100%;
}
</style>