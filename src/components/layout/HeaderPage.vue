<script setup lang="ts">

import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n()
const currentLanguage = ref(locale.value);
const language = ref(localStorage.getItem('language') || 'en');

const changeLanguage = () => {
  locale.value = currentLanguage.value;
  console.log(currentLanguage.value)
  localStorage.setItem('language', currentLanguage.value);
};

currentLanguage.value = localStorage.getItem('language') || 'en';
</script>

<template>
<div class="header">
  <div style="display:flex; align-items: flex-end">
    <div style="display: flex; align-items: center;">
      <el-radio-group v-model="currentLanguage" @change="changeLanguage">
        <el-radio-button label="EN" value="en" />
        <el-radio-button label="VI" value="vi" />
      </el-radio-group>
    </div>
  </div>
</div>
</template>

<style scoped>
.header{
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 100%;
}
</style>