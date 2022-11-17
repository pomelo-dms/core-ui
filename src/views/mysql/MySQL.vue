<template>
  <Header>
    <ul>
      <li><span>SQL 控制台</span></li>
      <li><span>用户权限操作</span></li>
      <li><span>数据导入与导出</span></li>
      <li><span>帮助</span></li>
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
      <div :style="{'z-index': 9999, position: 'absolute',left: optionCardX + 'px',
				top:optionCardY + 'px', width: '130px', background: 'white',
				 'box-shadow': '2px 2px 14px rgba(0, 0, 0, .06), -2px -2px 4px rgba(0, 0, 0, .06)', 'text-align': 'center'}"
           v-show="menuVisible"
           id="rightClickMenuDom"
           ref="rightClickMenuDom"
      >
        <template v-for="m in menuData">
          <el-button class="menu-button"
                     :id="m.id"
                     @click="handleRightClick(m.id, m.type)">
            {{ m.title }}
          </el-button>
          <el-divider v-if="m.divider" style="width:100px; margin: 5px 15px"></el-divider>
        </template>
      </div>
      <CreateDatabase ref="createDatabase" :data-source-id="dataSourceId"/>
    </div>

    <!-- 分割竖线 -->
    <div class="mysql-border"></div>

    <!-- MySQL tab 页主体操作区域-->
    <div class="mysql-main">
      <el-tabs type="card" v-model="tabName" @tab-remove="closeTab">
        <el-tab-pane
            :key="index"
            :label="item.label"
            :name="item.name"
            :closable="item.closable"
            v-for="(item, index) in tabDataList">
          <KeepAlive>
            <component :is="item.content"  :nodeKey="currentRightClickNodeKey"></component>
          </KeepAlive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import Header from "../../components/Header.vue";
import {markRaw, onBeforeUnmount, onMounted, ref} from "vue";
import dataSourceApi from '../../utils/api/dataSource.js'
import {useRoute} from "vue-router";
import mysqlApi from '../../utils/api/mysql.js'
import {ElMessage,ElMessageBox} from "element-plus";
import rightMenu from "../../utils/mysql/rightClickMenu.js";
import emitter from '../../utils/bus.js'


import Welcome from './Welcome.vue'
import Info from './Info.vue'
import TableCreate from './TableCreate.vue'
import CreateDatabase from "./CreateDatabase.vue";

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
  window.oncontextmenu = function (e) {
    //取消默认的浏览器自带右键
    e.preventDefault();
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('click', () => {
  }, true)

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
let currentDatabaseName = ref('')

// 右键打开菜单
function rightClick(event, data, node, target) {
  menuVisible.value = false
  currentDatabaseName = data.labelName
  let currentheight = document.body.scrollHeight-event.y-300//当前浏览器内容高度-元素距离顶部距离-元素本身高度
  optionCardX.value = event.x
  if(currentheight<0){
    optionCardY.value = document.body.scrollHeight-300
  }else{
    optionCardY.value = event.y
  }
  const nodeKey = data.nodeKey
  // 设置当前节点为选中状体
  mysqlTree.value.setCurrentKey(nodeKey)
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
const currentRightClickNodeKey = ref('')

const createDatabase = ref(null)
function handleRightClick(value, type) {
  // todo 根据 value 和 type 判断出事件类型，根据当前选中的树节点获取出自己的节点 和 父节点
  currentRightClickNodeKey.value = mysqlTree.value.getCurrentKey()
  switch (type) {
    case 1:  // 数据库操作
      switch (value) {
        case 'createDatabase':
          createDatabase.value.isShow = true
          break
        case 'renameDatabase':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'dropDatabase':
        ElMessageBox.confirm(
       '确认删除么',
       '提示',
       {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
      )
      .then(() => {
        mysqlApi.dropDatabase(currentDatabaseName,{dataSourceId: dataSourceId.value})
        .then(res => {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      })
       
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: 'Delete canceled',
        })
      })
          break
        case 'createTable':
          addTable('创建表', TableCreate)
          break
        case 'createView':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'createProcedure':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'exportData':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'exportTableStructure':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'openSQLConsole':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'refreshDatabase':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'databaseInfo':
          addTable('对象信息', Info)
          emitter.emit('currentDatabaseName', currentDatabaseName)
          break
      }
      break
    case 2:  // 表目录操作
      switch (value) {
        case 'createTable':
          addTable('创建表', TableCreate)
          break
        case 'refreshTable':
          ElMessage.warning(`${value} 功能未实现`)
          break
      }
      break
    case 3:  // 视图目录操作
      switch (value) {
        case 'createView':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'refreshView':
          ElMessage.warning(`${value} 功能未实现`)
          break
      }
      break
    case 4:  // 存储过程目录操作
      switch (value) {
        case 'createProcedure':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'refreshProcedure':
          ElMessage.warning(`${value} 功能未实现`)
          break
      }
      break
    case 5:  // 表操作
      switch (value) {
        case 'openTable':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'importData':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'exportData':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'createTable':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'copyTable':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'alterTable':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'dropTable':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'truncationTable':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'tableInfo':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'tableSqlScript':
          ElMessage.warning(`【${value}】功能未实现`)
          break
      }
      break
    case 6:  // 视图操作
      switch (value) {
        case 'showViewData':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'exportViewData':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'createView':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'updateView':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'dropView':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'viewInfo':
          ElMessage.warning(`【${value}】功能未实现`)
          break
      }
      break
    case 7:  // 存储过程操作
      switch (value) {
        case 'showProcedure':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'createProcedure':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'dropProcedure':
          ElMessage.warning(`【${value}】功能未实现`)
          break
        case 'procedureInfo':
          ElMessage.warning(`【${value}】功能未实现`)
          break
      }
      break
  }
}

// 获取树形 dom
const mysqlTree = ref(null)

// 将 MYSQL 树全部折叠
function collapseTree1() {
  let allNodes = mysqlTree.value.store._getAllNodes()
  mysqlTree.value.store._
  allNodes.forEach(node => {
    node.expanded = false
  })
}

// 标签操作相关
const tabName = ref('1')  // 当前激活的 tab 页名称,注意这个名称不是标签页的标题,它类似于id,
const tabIndex = ref(1)  // 用于构造 tab 页名称的,没实际意义
// 标签页列表
const tabDataList = ref([{
  label: '首页',
  name: '1',
  content: markRaw(Welcome),
  closable: false
}])

/**
 * 添加标签页
 * @param label  标签页的 title
 * @param component  标签页内容组件
 * @param closable 是否可关闭
 */
function addTable(label, component, closable = true) {
  if (tabDataList.value.length >= 10) {
    ElMessage.warning('您打开的标签页过多,请先关闭不需要的标签页')
    return
  }
  const newTabName = ++tabIndex.value + ''
  tabDataList.value.push({
    label: label, //tab 页的名称
    name: newTabName,  // 标签 name,与 tab 的 v-model 绑定,为当前展示的标签页
    content: markRaw(component),  // 标签内容组件
    closable: closable  // 是否可关闭
  })
  tabName.value = newTabName
}

/**
 * 删除标签页
 * @param targetName 要删除的标签页的 name
 */
function closeTab(targetName) {
  let tabs = tabDataList.value;
  let activeName = tabName.value;
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        let nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.name;
        }
      }
    });
  }
  tabName.value = activeName;
  tabDataList.value = tabs.filter(tab => tab.name !== targetName);
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
  margin: 0;
  padding: 0;
  border: none;
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
/* 树形菜单 子节点过长展示滚动条  el-tree-node是个div 块级元素 */
:deep(.el-tree > .el-tree-node) {
  display: inline-block;
  min-width: 100%;
}

</style>