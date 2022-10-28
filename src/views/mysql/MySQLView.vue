<template>
  <Header>
    <ul>
      <li><a href="#">SQL 控制台</a></li>
      <li><a href="#">用户权限操作</a></li>
      <li><a href="#">数据导入与导出</a></li>
      <li><a href="#">帮助</a></li>
    </ul>
  </Header>
  <div class="mysql-container">
    <!-- 侧边栏区域-->
    <div class="mysql-aside">
      <!-- 数据源信息展示区域 -->
      <div id="mysql-aside-info">
        <el-descriptions size="default" :column="2" title="数据源信息">
          <el-descriptions-item label="名称：">{{ dataSourceInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="类型：">
            <el-tag size="small">{{ dataSourceInfo.type == 1 ? 'MySQL' : 'Redis' }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="数据库数量：">
            <span style="text-decoration: underline"> {{ dbCount }} </span> 个
          </el-descriptions-item>
          <el-descriptions-item>
            <el-button type="primary" @click="collapseTree1">折叠所有</el-button>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!-- 分割线区域 -->
      <el-divider/>
      <!-- MySQL 树区域 -->
      <el-scrollbar class="mysql-aside-tree-box">
        <el-tree
            ref="mysqlTree"
            @node-click="menuVisible = false"
            @node-contextmenu="rightClick"
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
      </el-scrollbar>
      <div :style="{'z-index': 9999, position: 'fixed',left: optionCardX + 'px',
				top: optionCardY + 'px', width: '130px', background: 'white',
				 'box-shadow': '2px 2px 14px rgba(0, 0, 0, .06), -2px -2px 4px rgba(0, 0, 0, .06)', 'text-align': 'center'}"
           v-show="menuVisible"
           id="rightClickMenuDom"
      >
        <template v-for="m in menuData">
          <a href="#" class="menu-button" :id="m.id" @click="handleRightClick(m.id)">{{ m.title }}</a>
          <el-divider v-if="m.divider" style="width:100px; margin: 5px 15px"></el-divider>
        </template>
      </div>
    </div>


    <!-- 分割竖线 -->
    <div class="mysql-border"></div>

    <!-- MySQL tab 页主体操作区域-->
    <div class="mysql-main">
      <h1>首页</h1>
    </div>
  </div>
</template>

<script setup>
import Header from "../../components/Header.vue";
import {onBeforeUnmount, onMounted, ref} from "vue";
import dataSourceApi from '../../utils/api/dataSource.js'
import {useRoute} from "vue-router";
import mysqlApi from '../../utils/api/mysql.js'
import {ElMessage} from "element-plus";
import rightMenu from "../../utils/mysql/rightClickMenu.js";

const route = useRoute()
// 获取当前数据源 id
const dataSourceId = ref(route.query.dataSourceId)

const dataSourceInfo = ref({})
const dbCount = ref(0)

onMounted(() => {
  getDataSourceInfo()
  document.addEventListener('click', (e) => {
    // if (e.target.id !== 'rightClickMenuDom') {
      menuVisible.value = false
    // }
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('click', () => {}, true)
})

// 获取数据源信息
function getDataSourceInfo() {
  dataSourceApi.getDataSource(dataSourceId.value)
      .then(res => {
        dataSourceInfo.value = res.data
      })
}

async function loadLevel0(resolve) {
  const res = await mysqlApi.getTreeLevel0({dataSourceId: dataSourceId.value})
  let arr = initTreeData(Array.from(res.data))
  dbCount.value = arr.length
  return resolve(arr)
}

async function loadLevel1(node, resolve) {
  const res = await mysqlApi.getTreeLevel1({
    dataSourceId: dataSourceId.value,
    databaseName: node.label
  })
  let arr = initTreeData(Array.from(res.data))
  return resolve(arr)
}

async function loadLevel2(node, resolve) {
  const nodeKey = node.key + ''
  // 展开表
  if (nodeKey.startsWith('1-t')) {
    const res = await mysqlApi.getTreeLevel2Table({
      dataSourceId: dataSourceId.value,
      databaseName: node.parent.label
    })
    let arr = initTreeData(Array.from(res.data))
    return resolve(arr)
  }
  // 展开视图
  if (nodeKey.startsWith('1-v')) {
    const res = await mysqlApi.getTreeLevel2View({
      dataSourceId: dataSourceId.value,
      databaseName: node.parent.label
    })
    let arr = initTreeData(Array.from(res.data))
    return resolve(arr)
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

// 右键菜单
const menuVisible = ref(false)
const optionCardX = ref(null)
const optionCardY = ref(null)
let menuData = ref()
// 右键打开菜单
function rightClick(event, data, node, target) {
  menuVisible.value = false
  optionCardX.value = event.x + 10
  optionCardY.value = event.y

  const nodeKey = data.nodeKey

  if (nodeKey.includes('0-db')) {
    menuData.value = rightMenu.level0_db
  } else if (nodeKey.includes('1-t')) {
    menuData.value = rightMenu.level1_t
  } else if (nodeKey.includes('1-v')) {
    menuData.value = rightMenu.level1_v
  } else if (nodeKey.includes('1-p')) {
    menuData.value = rightMenu.level1_p
  } else if (nodeKey.includes('2-t')) {
    menuData.value = rightMenu.level2_t
  } else if (nodeKey.includes('2-v')) {
    menuData.value = rightMenu.level2_v
  } else if (nodeKey.includes('2-p')) {
    menuData.value = rightMenu.level2_p
  }
  menuVisible.value = true  // 展示右键菜单
}

// 右键菜单点击事件处理，value 为点击的 id
function handleRightClick(value) {
  // todo 根据 id 判断事件类型，根据当前选中的树节点获取出自己的节点 和 父节点
  console.log(value)
}

// 将 MYSQL 树全部折叠
const mysqlTree = ref(null)

function collapseTree1() {
  let allNodes = mysqlTree.value.store._getAllNodes()
  allNodes.forEach(node => {
    node.expanded = false
  })
}


</script>

<style scoped>
.mysql-container {
  display: flex;
  width: 100%;
  height: calc(100vh - 50px);
}

.mysql-container .mysql-border {
  width: 1px;
  background-color: lightgray;
  height: inherit;
}

.mysql-container .mysql-aside {
  display: flex;
  flex-direction: column;
  width: 320px;
  height: calc(100vh - 50px - 20px);
  padding-left: 5px;
}

.mysql-container .mysql-aside #mysql-aside-info {
  height: 100px;
}

.mysql-aside .mysql-aside-tree-box {
  /*flex: 1;*/
}

.menu-button {
  display: inline-block;
  width: 100%;
  padding: 6px 0;
  font-size: 12px;
  text-decoration: none;
  color: black;
}

.menu-button:hover {
  background-color: #99a9bf;
}

.mysql-main {
  flex: 1;
  height: inherit;
}

.el-divider--horizontal {
  margin: 5px 0;
}

ul {
  display: flex;
  margin-left: 100px;
}

ul li {
  padding-left: 30px;
}

ul a {
  display: inline-block;
  line-height: 50px;
  color: white;
  text-decoration: none;
  font-size: 16px;
}

ul a:hover {
  color: red;
}
</style>