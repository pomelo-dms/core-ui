<template>
  <h2>对象信息</h2>
 当前选中的节点为: {{ props }}
</template>
    
    <script setup>
import mysqlApi from "../../utils/api/mysql.js";
import {useRoute} from "vue-router";
import {onMounted, ref,onBeforeUnmount} from "vue";
import emitter from '../../utils/bus.js'
// import codeMirror from '../../components/codeMirror/codeMirror.vue'
const props = defineProps(["nodeKey"]);
const route = useRoute();
// 当前数据源 id
const dataSourceId = ref(route.query.dataSourceId);
onMounted(() => {
  emitter.on(("currentDatabaseName"),e=>{
    // console.log('接受的值',e)
    mysqlApi.databaseInfo(e,{dataSourceId:dataSourceId.value}).then((res) => {
    console.log("res", res);
  })
  });

  
});
onBeforeUnmount(() => {
  emitter.off('currentDatabaseName')
})

</script>
    
    <style scoped>
</style>