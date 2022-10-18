<template>
  <el-tree
      :props="props"
      :load="loadNode"
      lazy
  />
</template>

<script setup>
import {ref} from "vue";

const loadNode = (node, resolve) => {
  if (node.level === 0) {
    return resolve([{ name: 'region' }])
  }
  if (node.level > 1) return resolve([])

  setTimeout(() => {
    const data = [
      {
        name: 'leaf',
        leaf: true,
      },
      {
        name: 'zone',
      },
    ]

    resolve(data)
  }, 500)
}

const props = {
  label: 'name',
  children: 'children',
  isLeaf: 'leaf',
}
</script>

<style scoped>

</style>