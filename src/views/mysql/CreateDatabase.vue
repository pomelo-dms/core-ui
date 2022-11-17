<template>
  <el-drawer
      v-model="isShow"
      title="创建数据库"
      size="30%"
      direction="rtl"
      @open="init"
  >
    <el-form :model="databaseCreate" label-width="80px">
      <el-form-item label="数据库名称:">
        <el-input v-model="databaseCreate.databaseName" autocomplete="off" style="width: 190px;"/>
      </el-form-item>
      <el-form-item label="字符集:">
        <el-select v-model="databaseCreate.characterSet"
                   placeholder="默认"
                   @change="initCollation"
        >
          <el-option v-for="(item, index) in characterSetList" :label="item.characterSet" :value="item.characterSet"/>
        </el-select>
      </el-form-item>
      <el-form-item label="校验规则:">
        <el-select v-model="databaseCreate.collation" placeholder="默认">
          <el-option v-for="(item, index) in collationList" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="saveDatabase">
          确认
        </el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup>
import {ref} from "vue";
import mysqlApi from '../../utils/api/mysql.js'
import {ElMessage} from "element-plus";

const props = defineProps(['dataSourceId'])
const dataSourceId = props.dataSourceId

const isShow = ref(false)

const characterSetList = ref([]) // 字符集下拉框数据
const collationList = ref([])  // 校验规则下拉框数据

function getCharacterSets() {
  mysqlApi.getCharacterSets({dataSourceId: dataSourceId})
      .then(res => {
        if (res.code === 0) {
          characterSetList.value = res.data
        }
      })
}

function initCollation() {
  mysqlApi.getCollations({dataSourceId: dataSourceId, characterSet: databaseCreate.value.characterSet})
      .then(res => {
        if (res.code === 0) {
          collationList.value = res.data
        }
      })
}

const databaseCreate = ref({
  dataSourceId: props.dataSourceId,
  databaseName: '',
  characterSet: '',
  collation: '',
})
defineExpose({
  isShow
})

// 新建数据库
function saveDatabase() {
  mysqlApi.createDatabase(databaseCreate.value)
      .then(res => {
        if (res.code === 0) {
          ElMessage.success('创建数据库成功~')
          isShow.value = false
        }
      })
}

function init() {
  // 初始化字符集下拉框
  getCharacterSets()
}
</script>

<style scoped>

</style>