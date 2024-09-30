<script setup lang="ts">
import {Delete, Download, Edit, Plus, Search, View} from "@element-plus/icons-vue";
import {onMounted, onUnmounted, reactive, ref, watch} from "vue";
import ApiService from "@/utils/ApiService";
import NotificationCustom from "@/utils/NotificationCustom";
import {Category, CategoryResponse} from "@/components/category/Category";
import { useDebounceFn } from '@vueuse/core';
import {eventBus} from "@/utils/EventBus";
import {useI18n} from "vue-i18n";
import eVI from 'element-plus/es/locale/lang/vi'
import eEV from 'element-plus/es/locale/lang/en'
import {dayjs} from "element-plus";
const { t, locale } = useI18n();
const language = ref()
language.value = localStorage.getItem('language');
const isLang = ref()
isLang.value = language.value === "en" ? eEV : eVI;

watch(locale, () => {
  language.value = localStorage.getItem('language');
  isLang.value = language.value === "en" ? eEV : eVI;
})

// eslint-disable-next-line no-undef
const emit = defineEmits(['open-tab']);

const openTab = (mode: any, id: any) => {
  // Gọi hàm emit để phát ra sự kiện với các tham số
  emit('open-tab', { mode, id });
};


const tableData = ref();
const currentPage = ref(1);
const pageSize = ref(5);
const totalItems = ref(0);

const defaultTime = new Date(2000, 1, 1, 12, 0, 0)

const dataSearch = reactive({
  categoryCode: "",
  name: "",
  startDate: "",
  endDate: ""
})
const centerDialogVisible = ref(false)


const fetchData = async () => {
  try {
    const response = await ApiService.get<CategoryResponse>('/search-category', {
      params: {
        name: dataSearch.name.trim(),
        categoryCode: dataSearch.categoryCode.trim(),
        startDate: dataSearch.startDate,
        endDate: dataSearch.endDate,
        page: currentPage.value - 1,
        size: pageSize.value
      }
    });

    tableData.value = response.data.content;
    totalItems.value = response.data.totalElements;
  } catch (error: any) {
    NotificationCustom.error(error.response.data, t('error'));
  }
};

const callAPIDelete = async (id: any) => {
  try {
    const response = await ApiService.delete<Category>('/delete-category', {
      params: {
        id: id
      }
    });
    fetchData()
    NotificationCustom.success(t('deleteSuccess'), t('success'));
  } catch (error: any) {
    NotificationCustom.error(error.response.data, t('error'));
  }
}

const downloadFile = async () => {
  try {
    const response = await ApiService.get('/export-excel', {
      params: {
        name: dataSearch.name.trim(),
        categoryCode: dataSearch.categoryCode.trim(),
        startDate: dataSearch.startDate,
        endDate: dataSearch.endDate,
      },
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "categories.xlsx");
    document.body.appendChild(link);
    link.click();

    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    NotificationCustom.error(error.response.data, t('error'));
  }
};

const idDelete = ref()
const deleteCategory = (id: any) => {
  centerDialogVisible.value = true
  idDelete.value = id
}

const conFirmDelete = (check: any) => {
  if(check) {
    callAPIDelete(idDelete.value)
  }
  centerDialogVisible.value = false
}

const debouncedSearch = useDebounceFn(fetchData, 700);

const isValidCategoryCode = (categoryCode: string) => {
  return /^[a-zA-Z0-9 ]+$/.test(categoryCode);
}

const isValidCategoryName = (name: string) => {
  return /^[a-zA-Z0-9 ]+$/.test(name);
}

const validateDates = () => {
  const from = dayjs(dataSearch.startDate, 'DD-MM-YYYY'); // Parse startDate
  const to = dayjs(dataSearch.endDate, 'DD-MM-YYYY');     // Parse endDate

  if (dataSearch.startDate && dataSearch.endDate) {
    if (to.isBefore(from)) {
      NotificationCustom.error(t('errorSearchDate'), t('error'));
      return false;
    }
  }
  return true;
};

watch(
    () => [dataSearch.categoryCode, dataSearch.name, dataSearch.startDate, dataSearch.endDate],
    () => {
      const isCodeValid = dataSearch.categoryCode === '' || isValidCategoryCode(dataSearch.categoryCode);
      const isNameValid = dataSearch.name === '' || isValidCategoryName(dataSearch.name);
      if (validateDates() && isCodeValid && isNameValid) {
        debouncedSearch();
      } else {
        tableData.value = [];
      }
    }
);

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchData();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchData();
};
onMounted(() => {
  fetchData()
  eventBus.on('loadData', fetchData);
})
onUnmounted(() => {
  eventBus.off('loadData', fetchData);
})
</script>

<template>
  <div class="form-search">
    <div style="display: inline-block;">
      <el-form :model="dataSearch">
        <el-input v-model="dataSearch.categoryCode" style="width: 270px ; margin:4px 8px 4px 0"
                  :placeholder="$t('placeholderSearchCodeCATEGORY')"  maxlength="255" :prefix-icon="Search"/>
        <el-input v-model="dataSearch.name" style="width: 270px;  margin:4px 8px 4px 0"
                  :placeholder="$t('placeholderSearchNameCATEGORY')"  maxlength="255" :prefix-icon="Search"/>
        <el-date-picker v-model="dataSearch.startDate" style="width: 190px;" type="date"
                        format="DD-MM-YYYY"
                        value-format="DD-MM-YYYY"
                        :placeholder="$t('placeholderSearchCrtStCATEGORY')" :default-time="defaultTime"/>
        -
        <el-date-picker v-model="dataSearch.endDate" style="width: 190px;  margin:4px 12px 4px 0" type="date"
                        format="DD-MM-YYYY"
                        value-format="DD-MM-YYYY"
                        :placeholder="$t('placeholderSearchCrtEdCATEGORY')" :default-time="defaultTime"/>
        <el-button  @click="downloadFile" type="primary">
          <el-icon style=" margin:4px 8px 4px 0"><Download /></el-icon>
          {{$t('btnExportExcel')}}
        </el-button>
        <el-button @click="openTab('add', 0)" type="primary">
          <el-icon style=" margin:4px 8px 4px 0"><Plus /></el-icon>
          {{$t('btnAdd')}}
        </el-button>
      </el-form>
    </div>
  </div>
  <div class="page">
    <el-table border :data="tableData" style="width: 100%; height: 410px">
      <el-table-column prop="STT" label="STT" width="60" align="center" >
        <template #default="scope">
          {{ ((currentPage ?? 1) - 1) * (pageSize ?? 10) + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="image" :label="$t('fieldImageCategory')" width="150" align="center">
        <template #default="scope">
         <el-image v-if="scope.row.urlImage != null"
                   style="width: 50px; height: 50px"
                   :src="scope.row.urlImage" :fit="'cover'">
         </el-image>
          <el-image v-else style="width: 50px; height: 50px" src="imgError.png" :fit="'cover'"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="categoryCode" :label="$t('fieldCodeCategory')" width="150" />
      <el-table-column prop="name" :label="$t('fieldNameCategory')" width="120" />
      <el-table-column prop="description" :label="$t('fieldDescriptionCategory')" width="220" />
      <el-table-column prop="createdDate" :label="$t('fieldCreateDateCategory')" width="180" align="center" />
      <el-table-column prop="status" align="center" :label="$t('fieldStatusCategory')" width="120">
        <template #default="scope">
          <el-tag v-if="scope.row.status == 'ACTIVE'" type="success">{{$t('active')}}</el-tag>
          <el-tag v-else type="danger">{{$t('inactive')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" :label="$t('fieldOperationsCategory')" min-width="120" align="center">
        <template #default="scope">
          <el-tooltip :content="$t('viewDetails')" placement="top">
<!--            <el-button link type="primary" @click="redirectFormDetail(scope.row.id)">-->
            <el-button link type="primary" @click="openTab('view', scope.row.id)">
              <el-icon style="font-size: 18px"><View /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip :content="$t('update')" placement="top">
<!--            <el-button link type="primary" @click="redirectFormUpdate(scope.row.id)">-->
            <el-button link type="primary" @click="openTab('update', scope.row.id)">
              <el-icon style="font-size: 18px"><Edit /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip :content="$t('delete')" placement="top">
            <el-button @click="deleteCategory(scope.row.id)" link type="danger">
              <el-icon style="font-size: 18px"><Delete /></el-icon>
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px 10px; display: flex;justify-content: flex-end; align-items: center">
      <div class="demo-pagination-block">
        <el-config-provider :locale="isLang">
          <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[5, 10, 20, 50]"
              :background="true"
              :total="totalItems"
              layout="total ,sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </el-config-provider>
      </div>
    </div>
  </div>
  <el-dialog
      v-model="centerDialogVisible"
      :title="$t('btnConfirm')"
      width="500"
  >
    <span>{{$t('confirmDelete')}}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">{{$t('btnCancel')}}</el-button>
        <el-button type="primary" @click="conFirmDelete(true)">
          {{$t('btnConfirm')}}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.form-search{
  margin: 0 auto 12px;
  display: flex;
}

.page {
  width: 100%;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 8px;
}

.el-pagination{
  flex-wrap: wrap;
}
</style>