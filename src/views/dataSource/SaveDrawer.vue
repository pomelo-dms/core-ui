<template>
  <el-drawer
      ref="drawerRef"
      v-model="isShow"
      :title="title"
      size="30%"
      direction="rtl"
      :before-close="closeDrawer"
  >
    <div>
      <el-form :model="dataSourceFm" size="default" :label-width="100">
        <el-form-item label="数据源名称：">
          <el-input v-model="dataSourceFm.name" autocomplete="off" style="width: 180px"/>
        </el-form-item>
        <el-form-item label="数据源类型：">
          <el-select v-model="dataSourceFm.type" placeholder="请选择数据源类型">
            <el-option label="MySQl" value="1"/>
            <el-option label="Redis" value="2"/>
            <el-option label="MongoDB" value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="主机 IP：">
          <el-input v-model="dataSourceFm.host" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="端口号：">
          <el-input v-model="dataSourceFm.port" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="数据库用户：">
          <el-input v-model="dataSourceFm.username" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input type="password" v-model="dataSourceFm.password" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="dataSourceFm.description" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-switch v-model="dataSourceFm.enabled" />
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="closeDrawer">取消</el-button>
        <el-button type="primary" @click="saveDataSource">保存</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import dataSourceApi from '../../utils/api/dataSource.js'
import {ElMessage, ElMessageBox} from "element-plus";
import {ref} from "vue";

const emit = defineEmits(['refreshDataSourceTable'])

const title = ref('')
const isShow = ref(false)
const dataSourceId = ref(0)

let dataSourceFm = ref({})

function saveDataSource() {
  if (title.value.indexOf('创建') !== -1) {
    // 创建
    dataSourceApi.addDataSource(dataSourceFm.value)
        .then(res => {
          if (res.code === 0 && res.data) {
            ElMessage.success('数据源创建成功～')
            //  关闭抽屉
            isShow.value = false
            dataSourceFm = {}
            //  调用父组件的 doSearch 方法刷新表格
            emit('refreshDataSourceTable')
          }
        })
  } else {
    // 更新
    dataSourceApi.updateDataSource(dataSourceFm.value)
        .then(res => {
          if (res.code === 0 && res.data) {
            ElMessage.success('数据源修改成功～')
            //  关闭抽屉
            isShow.value = false
            dataSourceFm = {}
            //  调用父组件的 doSearch 方法刷新表格
            emit('refreshDataSourceTable')
          }
        })
  }
}

function init() {
  if (title.value.indexOf('修改') !== -1 && dataSourceId.value !== 0) {
    dataSourceApi.getDataSource(dataSourceId.value)
        .then(res => {
          if (res.code === 0) {
            dataSourceFm.value = res.data
          }
        })
  }
}
defineExpose({
  title,
  isShow,
  dataSourceId,
  init
})
function closeDrawer() {
  ElMessageBox.confirm('你可能有未保存的数据，确定要退出吗？')
      .then(() => {
        isShow.value = false
        dataSourceFm = {}
      })
      .catch(() => {
        // catch error
      })
}
</script>

<style scoped>

</style>