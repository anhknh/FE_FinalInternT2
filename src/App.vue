<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="240px">
        <side-bar></side-bar>
      </el-aside>
      <el-container>
        <el-header style="position: fixed; width: 100%; z-index: 100;">
          <header-page></header-page>
        </el-header>
        <el-main style="padding: 80px 25px 0; height: 100vh">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>


import SideBar from "@/components/layout/SideBar.vue";
import HeaderPage from "@/components/layout/HeaderPage.vue";
</script>

<style>
.el-header {
  --el-header-height : 56px;
  border-bottom: 1px solid #ebeef5;
  background-color: #ffffff;
}

.el-main {
  background-color: #ebeef5;
}
</style>
