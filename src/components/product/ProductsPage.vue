<script setup lang="ts">

import TableCategory from "@/components/category/TableCategory.vue";
import {markRaw, onMounted, onUnmounted, ref, watch} from "vue";
import FormProduct from "@/components/product/FormProduct.vue";
import TableProduct from "@/components/product/TableProduct.vue";
import {useI18n} from "vue-i18n";
import {eventBus} from "@/utils/EventBus";


let tabIndex = 1;
const editableTabsValue = ref('1');
const { t, locale } = useI18n();

watch(locale, () => {
  editableTabs.value[0].title = t('listProduct');
  editableTabs.value.forEach(tab => {
    if (tab.mode === 'view') {
      tab.title = t('viewProduct');
    }
    if (tab.mode === 'update') {
      tab.title = t('updateProduct');
    }
    if (tab.mode === 'add') {
      tab.title = t('addNewProduct');
    }
  });
});
const editableTabs = ref([
  {
    title: t('listProduct'),
    name: '1',
    content: TableCategory,
    props: {},
    mode: "home"
  },
]);

const addTab = ({ mode, id }: { mode: 'view' | 'update' | 'add'; id: string | number }) => {
  const newTabName = `${++tabIndex}`;
  let title = '';

  if (mode === 'view') {
    title = t('viewProduct');
  } else if (mode === 'update') {
    title = t('updateProduct');
  } else {
    title = t('addNewProduct');
  }

  editableTabs.value.push({
    title: title,
    name: newTabName,
    content: markRaw(FormProduct),
    props: { mode, id },
    mode: mode
  });

  editableTabsValue.value = newTabName;
};


const removeTab = (targetName: any) => {
  const tabs = editableTabs.value;
  let activeName = editableTabsValue.value;

  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          activeName = nextTab.name;
        }
      }
    });
  }

  editableTabsValue.value = activeName;
  editableTabs.value = tabs.filter((tab) => tab.name !== targetName);
};

const goToHomeTab = () => {
  editableTabsValue.value = '1';
};

onMounted(() => {
  eventBus.on('goBack', goToHomeTab);
})
onUnmounted(() => {
  eventBus.off('goBack', goToHomeTab);
})

</script>

<template>
  <div>
    <el-tabs
        v-model="editableTabsValue"
        type="card"
        class="demo-tabs"
        @tab-remove="removeTab"
    >
      <el-tab-pane
          v-for="item in editableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :closable="item.name!='1'"
      >
        <div v-if="item.name == '1'">
          <table-product @open-tab="addTab" />
        </div>
        <div v-else>
          <component :is="item.content" v-bind="item.props" />
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- Bảng được nhúng vào đây -->
  </div>
</template>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>