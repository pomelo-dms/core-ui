<template>
  <el-drawer
      ref="drawerRef"
      v-model="addDataSourceDrawer"
      :title="this.openParams.title"
      size="30%"
      direction="rtl"
      before-close="handle"
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
          <el-input v-model="dataSourceFm.password" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="dataSourceFm.description" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-input v-model="dataSourceFm.enabled" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div>
        <el-button @click="cancelCreate">取消</el-button>
        <el-button type="primary" @click="saveDataSource">保存</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import dataSourceApi from '../../../utils/api/dataSource.js'
import {ElMessage} from "element-plus";

export default {
  name: "SaveDrawer",
  props: {
    openParams: {
      title: String,
      isOpen: Boolean,
      dataSourceId: String
    }
  },
  data() {
    return {
      addDataSourceDrawer: this.openParams.isOpen,
      dataSourceFm: {},
    }
  },
  methods: {
    cancelCreate() {
      this.addDataSourceDrawer = false
    },
    saveDataSource() {
      if (this.openParams.title.contains('创建')) {
        // 创建
        dataSourceApi.addDataSource(this.dataSourceFm)
            .then(res => {
              console.log(res)
              if (res.code === 0 && res.data) {
                ElMessage.success('数据源创建成功～')
                // todo 创建成功，
                //  关闭抽屉
                //  调用父组件的 doSearch 方法刷新表格

              }
            })
      } else {
        // 更新
        dataSourceApi.updateDataSource(this.dataSourceFm)
            .then(res => {
              console.log(res)
              if (res.code === 0 && res.data) {
                ElMessage.success('数据源修改成功～')
                // todo 创建成功，
                //  关闭抽屉
                //  调用父组件的 doSearch 方法刷新表格

              }
            })
      }
    }
  }
}
</script>

<style scoped>

</style>