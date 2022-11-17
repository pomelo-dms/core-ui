<template>
  <el-form
      ref="ruleFormRef"
      label-width="120px"
      :inline="true"
  >
    <el-form-item label="表名：">
      <el-input autocomplete="off"/>
    </el-form-item>
    <el-form-item label="注释：">
      <el-input autocomplete="off"/>
    </el-form-item>
    <el-form-item label="引擎：">
      <el-input autocomplete="off"/>
    </el-form-item>
  </el-form>
  <el-button plain type="primary" @click="addRow">
    添加列
  </el-button>
  <el-button plain type="danger" @click="removeRows">
    删除列
  </el-button>
  <el-table ref="createTableRef"
            :data="tableData"
            :row-class-name="tableRowClassName"
            style="width: 100%" border>
    <el-table-column type="selection" width="50"/>
    <el-table-column prop="columnName" label="列名称" width="180">
      <template #default="scope">
        <el-input v-model="scope.row.columnName"/>
      </template>
    </el-table-column>
    <el-table-column prop="typeInfo" label="数据类型" width="180">
      <template #default="scope">
        <el-autocomplete
            v-model="scope.row.typeInfo"
            :fetch-suggestions="queryTypeInfoList"
            clearable
        />
        <!--        <el-select v-model="scope.row.typeInfo" filterable>-->
        <!--          <el-option-->
        <!--              v-for="(item) in dataTypeList"-->
        <!--              :key="item.dataType"-->
        <!--              :label="item.dataType"-->
        <!--              :value="item.dataType"-->
        <!--          />-->
        <!--        </el-select>-->
      </template>
    </el-table-column>
    <el-table-column prop="isNull" label="非空" width="60">
      <template #default="scope">
        <el-checkbox v-model="scope.row.isNull"/>
      </template>
    </el-table-column>
    <el-table-column prop="unique" label="唯一" width="60">
      <template #default="scope">
        <el-checkbox v-model="scope.row.unique"/>
      </template>
    </el-table-column>
    <el-table-column prop="increment" label="自增" width="60">
      <template #default="scope">
        <el-checkbox v-model="scope.row.increment"/>
      </template>
    </el-table-column>
    <el-table-column prop="primaryKey" label="主键" width="60">
      <template #default="scope">
        <el-checkbox v-model="scope.row.primaryKey"/>
      </template>
    </el-table-column>
    <el-table-column prop="defaultValue" label="默认值" width="120">
      <template #default="scope">
        <el-input v-model="scope.row.defaultValue" clearable/>
      </template>
    </el-table-column>
    <el-table-column prop="description" label="描述">
      <template #default="scope">
        <el-input v-model="scope.row.description" clearable/>
      </template>
    </el-table-column>
  </el-table>

  <el-button>取消</el-button>
  <el-button type="primary">创建表</el-button>
</template>

<script setup>
import {ref} from 'vue'
import {ElMessage} from "element-plus";

import tableApi from '../../utils/api/table'

const props = defineProps(['nodeKey'])
const nodeKey = props.nodeKey

const createTableRef = ref(null)

const queryTypeInfoList = (queryString, cb) => {
  let result = []
  if (queryString === '') {
    cb(result)
  } else {
    try {
      tableApi.listDataInfos()
          .then(res => {
            if (res.code === 0) {
              let originalData = res.data
              let result = []
              originalData.forEach(str => {
                let item = {}
                item.value = str.toLowerCase()
                result.push(item)
              })
              result = queryString ? result.filter(createFilter(queryString)) : result;
              //cb是回调函数，返回筛选出的结果数据到输入框下面的输入列表
              cb(result)
            }
          })
    } catch (e) {
      ElMessage.error(e)
    }
  }
}

function createFilter(queryString) {
  return (item) => {
    return item.value.toUpperCase().startsWith(queryString.toUpperCase())
  }
}

const tableData = ref([
  {
    columnName: 'columnName',
    typeInfo: 'varchar(20)',
  }
])

// 添加表格行下标，贼扯淡，ElementX 竟然没有直接获取选中行索引的方法，如果再来一次我必不用 ElementX
function tableRowClassName({row, rowIndex}) {
  row.row_index = rowIndex
}

function addRow() {
  tableData.value.unshift({
    columnName: 'columnName',
    typeInfo: 'varchar(20)',
  })
}

function removeRows() {
  let selectionRows = createTableRef.value.getSelectionRows();
  console.log(selectionRows[0].row_index);
  tableData.value.filter(row => {

  })
}
</script>

<style scoped>

</style>