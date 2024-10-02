<template>
  <el-aside class="sidebar">
    <el-menu :default-active="activeMenu" class="sidebar-menu">
      <div class="logo">
        <span style="width: 100%; text-align: center; line-height: 36px; color: #fff">KNHA</span>
      </div>

      <el-menu-item index="2" @click="handleMenuClick('2', 'Categories')">
        <el-icon>
          <DocumentCopy />
        </el-icon>
        <span>{{t('categories')}}</span>
      </el-menu-item>

      <el-menu-item index="3" @click="handleMenuClick('3', 'Products')">
        <el-icon>
          <Box />
        </el-icon>
        <span>{{t('products')}}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ElAside, ElMenu, ElMenuItem } from 'element-plus';
import {Box, DocumentCopy, HomeFilled, Setting, ShoppingCartFull, User} from "@element-plus/icons-vue";
import Router from "@/router";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();
const activeMenu = ref(localStorage.getItem('activeMenu') || '1'); // Lấy từ localStorage hoặc mặc định là '1'

// Hàm xử lý khi người dùng chọn menu
function handleMenuClick(index, label) {
  activeMenu.value = index;
  localStorage.setItem('activeMenu', index); // Lưu vào localStorage
  Router.push({ name: label });
}

// Cập nhật `localStorage` khi `activeMenu` thay đổi
watch(activeMenu, (newValue) => {
  localStorage.setItem('activeMenu', newValue);
});

onMounted(() => {
  const savedMenu = localStorage.getItem('activeMenu');
  if (savedMenu) {
    activeMenu.value = savedMenu; // Lấy giá trị từ localStorage nếu có
  }
});
</script>



<style scoped>
.logo {
  text-align: center;
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  height: 56px;
}

.sidebar {
  background-color: #172554;
  border-right: 1px solid #ebeef5;
  height: 100vh; /* Chiều cao cố định bằng chiều cao của màn hình */
}

.sidebar-menu {
  height: 100%; /* Đảm bảo menu chiếm toàn bộ chiều cao của sidebar */
  border-right: 1px solid #ebeef5;
  background-color: #0d1638;
}

.el-menu-item {
  padding: 12px 20px;
  display: flex;
  align-items: center; /* Căn chỉnh icon và văn bản theo chiều dọc */
  color: #fff;
}

.el-menu-item i {
  font-size: 20px; /* Kích thước biểu tượng */
  margin-right: 16px; /* Khoảng cách giữa biểu tượng và văn bản */
  color: #409eff; /* Màu biểu tượng */
}

.el-menu-item:hover {
  background-color: #202D3D; /* Màu nền khi hover */
  color: #ccc;
}

.el-menu-item.is-active  {
  background-color: #409eff ; /* Màu nền khi mục menu đang hoạt động */
  color: #fff; /* Màu văn bản khi mục menu đang hoạt động */
}

.el-menu-item.is-active i {
  color: #fff; /* Màu biểu tượng */
}



.el-menu-item span {
  font-size: 16px; /* Kích thước văn bản */
}
</style>
