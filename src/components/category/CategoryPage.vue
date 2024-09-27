<script setup lang="ts">


import {markRaw, onMounted, onUnmounted, ref, watch} from 'vue'
import TableCategory from "@/components/category/TableCategory.vue";
import FormControlPage from "@/components/category/FormControlPage.vue";
import {useI18n} from "vue-i18n";
import {eventBus} from "@/utils/EventBus";

let tabIndex = 1;
const editableTabsValue = ref('1');
const { t, locale } = useI18n();


watch(locale, () => {
  editableTabs.value[0].title = t('listCategory');
  editableTabs.value.forEach(tab => {
    if (tab.mode === 'view') {
      tab.title = t('viewCategory');
    }
    if (tab.mode === 'update') {
      tab.title = t('updateCategory');
    }
    if (tab.mode === 'add') {
      tab.title = t('addNewCategory');
    }
  });
});

const editableTabs = ref([
  {
    title: t('listCategory'),
    name: '1',
    content: TableCategory,
    props: {},
    mode: "home"
  },
]);

const addTab = ({ mode, id }: { mode: 'view' | 'update' | 'add'; id: string | number }) => {

  let title = '';
  const newTabName = `${++tabIndex}`;
  if (mode === 'view') {
    // newTabName.value = "view"
    title = t('viewCategory');
  } else if (mode === 'update') {
    // newTabName.value = "update"
    title =  t('updateCategory');
  } else {
    // newTabName.value = "add"
    title =  t('addNewCategory');
  }

  editableTabs.value.push({
    title: title,
    name: newTabName,
    content: markRaw(FormControlPage),
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
          <TableCategory @open-tab="addTab" />
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