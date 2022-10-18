<template>
  <el-tree
      :props="defaultProps"
      :load="loadNode"
      lazy
      node-key="nodeKey">
  </el-tree>
</template>

<script setup>
import {onMounted} from "vue";
import mysqlApi from '../../utils/api/mysql.js'

const props = defineProps(['dataSourceId'])
onMounted(() => {

})

async function loadLevel0(resolve) {
  const res = await mysqlApi.getTreeLevel0({dataSourceId: props.dataSourceId})
  return resolve(res.data)
}

async function loadLevel1(node, resolve) {
  const res = await mysqlApi.getTreeLevel1({
    dataSourceId: props.dataSourceId,
    databaseName: node.label
  })
  return resolve(res.data)
}

function loadNode(node, resolve) {
  //如果展开第一级节点，从后台加载一级节点列表
  if (node.level === 0) {
    loadLevel0(resolve);
  }
  //如果展开其他级节点，动态从后台加载下一级节点列表
  if (node.level === 1) {
    loadLevel1(node, resolve);
  }
}

const defaultProps = {
  label: 'labelName',
  children: 'children',
  isLeaf: 'leaf',
  icon: 'Plus'
}
</script>

<style scoped>

</style>