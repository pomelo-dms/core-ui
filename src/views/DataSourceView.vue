<template>
  <h1>数据源页面</h1>
  <h2>当前登录用户信息为：</h2>
  <p>{{currentUser.name}}</p>
  <p>{{currentUser.account}}</p>
  <p>{{currentUser.password}}</p>
  <p>{{currentUser.phone}}</p>
  <p>{{currentUser.email}}</p>
</template>

<script>

import userApi from "../utils/api/user.js";

export default {
  name: "DataSourceView",
  data(){
    return{
      currentUser:{}
    }
  },
  mounted(){
    this.getCurrentUser()
  },
  methods: {
    getCurrentUser() {
      userApi.getUserById(1)
          .then(res => {
            if (res.code === 0) {
              this.currentUser = res.data
            }
          })
    }
  }
}
</script>

<style scoped>

</style>