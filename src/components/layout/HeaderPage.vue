<script setup lang="ts">

import {Bell} from "@element-plus/icons-vue";
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n()
const currentLanguage = ref(locale.value);
const language = ref(localStorage.getItem('language') || 'en');

const changeLanguage = () => {
  locale.value = currentLanguage.value;
  localStorage.setItem('language', currentLanguage.value);
};

currentLanguage.value = localStorage.getItem('language') || 'en';
</script>

<template>
<div class="header">
  <div style="font-weight: bold">{{ $t('welcomeMessage')}}</div>
  <div style="display:flex; align-items: flex-end">
    <div style="display: flex; align-items: center;">
      <select v-model="currentLanguage" @change="changeLanguage">
        <option value="en">English</option>
        <option value="vi">Tiếng Việt</option>
      </select>
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