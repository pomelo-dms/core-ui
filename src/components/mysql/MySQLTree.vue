<template>
  <el-tree
      :props="defaultProps"
      :load="loadNode"
      lazy
      node-key="nodeKey">
    <template #default="{ node, data }">
      <el-icon>
        <component :is="data.icon"></component>
      </el-icon>
      <span>{{ node.label }}</span>
    </template>
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
  let arr = initTreeData(Array.from(res.data))
  return resolve(arr)
}

async function loadLevel1(node, resolve) {
  const res = await mysqlApi.getTreeLevel1({
    dataSourceId: props.dataSourceId,
    databaseName: node.label
  })
  let arr = initTreeData(Array.from(res.data))
  return resolve(arr)
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
const initTreeData = (arr) => {
  arr.forEach(n => {
    if (n.nodeKey.startsWith('1-1-db')) {
      console.log('数据库')
      n.icon = 'List'
    } else if (n.nodeKey.startsWith('2-1-t')) {
      n.icon = 'Calendar'
    } else if (n.nodeKey.startsWith('2-1-v')) {
      n.icon = 'Picture'
    } else if (n.nodeKey.startsWith('2-1-p')) {
      n.icon = 'Film'
    }
  })
  return arr
}
</script>

<style scoped>

</style>