<template>
  <el-row class="tac">
    <el-col :span="45">
      <!-- router属性可根据边框中的index属性进行路由跳转，例如index为user，
      点击就变为了localhost：xxxx/user -->
      <!-- :default-active="$route.path.substr(1)" 默认高亮 -->
      <el-menu
        style="width: 200px; min-height: calc(100vh - 50px)"
        :default-active="$route.path.substr(1)"
        router
        :default-openeds="['1']"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-sub-menu index="1" v-if="user.role === 1">
          <template #title>
            <el-icon><Grid /></el-icon>系统管理
          </template>
          <el-menu-item index="user"
            ><el-icon><User /></el-icon>用户管理</el-menu-item
          >
        </el-sub-menu>
        <el-sub-menu index="2" v-if="user.role === 2 || 1">
          <template #title>
            <el-icon><Notebook /></el-icon>数据处理库
          </template>
          <el-menu-item index="book"
            ><el-icon><CoffeeCup /></el-icon>图书管理</el-menu-item
          >
          <el-menu-item index="news"
            ><el-icon><TrendCharts /></el-icon>新闻管理</el-menu-item
          >
        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Aside",
  props: ["user"],
};
</script>
<style>
</style>