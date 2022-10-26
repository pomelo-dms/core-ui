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
      <span style="margin-left: 5px">{{ node.label }}</span>
    </template>
  </el-tree>
</template>

<script setup>
import {onMounted} from "vue";
import mysqlApi from '../../utils/api/mysql.js'
import {ElMessage} from "element-plus";

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

async function loadLevel2(node, resolve) {
  const nodeKey = node.key + ''
  console.log(nodeKey)
  // 展开表
  if (nodeKey.startsWith('1-t')) {
    const res = await mysqlApi.getTreeLevel2({
      dataSourceId: props.dataSourceId,
      databaseName: node.parent.label
    })
    let arr = initTreeData(Array.from(res.data))
    return resolve(arr)
  }
  // 展开视图
  if (nodeKey.startsWith('1-v')) {
    ElMessage.warning('视图查询未实现')
    return resolve([])
  }
  // 展开存储过程
  if (nodeKey.startsWith('1-p')) {
    ElMessage.warning('存储过程查询未实现')
    return resolve([])
  }
}

function loadNode(node, resolve) {
  //如果展开第一级节点，从后台加载一级节点列表
  if (node.level === 0) {
    loadLevel0(resolve);
  }
  //如果展开第二级节点，动态从后台加载下一级节点列表
  if (node.level === 1) {
    loadLevel1(node, resolve);
  }
  //如果展开第三级级节点，动态从后台加载下一级节点列表
  if (node.level === 2) {
    loadLevel2(node, resolve);
  }
}

const defaultProps = {
  label: 'labelName',
  children: 'children',
  isLeaf: 'leaf',
}
const initTreeData = (arr) => {
  arr.forEach(n => {
    const str = n.nodeKey.substring(0, 4)
    switch (str) {
      case '0-db':
        n.icon = 'List'
        break;
      case '1-t-':
        n.icon = 'Calendar'
        break;
      case '1-v-':
        n.icon = 'Picture'
        break;
      case '1-p-':
        n.icon = 'Film'
        break;
      case '2-t-':
        n.icon = 'Pear'
        break;
      case '2-v-':
        n.icon = 'Sugar'
        break;
      case '2-p-':
        n.icon = 'Apple'
        break;
      default:
        break
    }
  })
  return arr
}
</script>

<style scoped>

</style>