<template>
  <el-menu
      active-text-color="red"
      :default-active="route.path"
      router
      class="main-aside-menu"
      @select="menuClick"
  >
    <template v-for="(item, index) in menuItemList">
      <el-sub-menu v-if="item.children && item.children.length > 0" :key="item.path" :index=item.path>
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"/>
          </el-icon>
          {{ item.meta.title }}
        </template>
        <el-menu-item v-for="child in item.children" :index="child.path">
          <el-icon>
            <component :is="child.meta.icon"/>
          </el-icon>
          {{ child.meta.title }}
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-if="!item.children" :index="item.path">
        <el-icon>
          <component :is="item.meta.icon"/>
        </el-icon>
        {{ item.meta.title }}
      </el-menu-item>
    </template>

  </el-menu>
</template>

<script setup>
import {useRouter, useRoute} from "vue-router";
import {onMounted} from "vue";

const router = useRouter()
const route = useRoute()
const routes = router.options.routes
const menuItemList = routes.filter(route => {
  return route.children && route.children.length > 0
})[0].children

onMounted(() => {
  // console.log(menuItemList)
})

function menuClick(index) {
  //路由跳转
  router.push(index)
}
</script>

<style scoped>

</style>