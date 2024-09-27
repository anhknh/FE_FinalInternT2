<script setup lang="ts">

import {onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import {ElMessage, FormInstance, FormRules} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'
import {Category} from "@/components/category/Category";
import ApiService from "@/utils/ApiService";
import NotificationCustom from "@/utils/NotificationCustom";
import {validateCode, validateDescription, validateName} from "@/utils/Validation";
import {eventBus} from "@/utils/EventBus";
import {useI18n} from "vue-i18n";

const {t, locale} = useI18n();
const textHeader = ref();
const ruleFormRef = ref<FormInstance>()
watch(locale, () => {
  mode()
});
// eslint-disable-next-line no-undef
const props = defineProps({
  mode: String,
  id: Number
})

const formData = ref<Category>({
  id: 0,
  categoryCode: '',
  name: '',
  description: '',
  urlImage: null,
  status: '',
  createdDate: '',
  modifiedDate: '',
  createdBy: '',
  modifiedBy: ''
});
const imageUrl = ref<string | null>(null);
const checkMode = ref()

const callAPIGetDetail = async (id: any) => {
  try {
    const response = await ApiService.get<Category>('/view-detail', {
      params: {
        id: id
      }
    });
    formData.value = response.data;
    if (response.data.urlImage != null) {
      imageUrl.value = "http://192.168.1.2:8081" + response.data.urlImage;
    }
  } catch (error: any) {
    NotificationCustom.error(error.response.data, t('error'));
  }
}

const callAPICreateCategory = async (data: FormData) => {
  try {
    const response = await ApiService.post('/create-category', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // router.push('/category');
    eventBus.emit('loadData');
    NotificationCustom.success(t('addSuccess'), t('success'));
  } catch (error: any) {
    NotificationCustom.error(error.response.data, t('error'));
  }
}

const callAPIUpdateCategory = async (data: FormData) => {
  try {
    const response = await ApiService.put('/update-category', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // router.push('/category');
    eventBus.emit('loadData');
    NotificationCustom.success(t('updateSuccess'), t('success'));
  } catch (error: any) {
    NotificationCustom.error(error.response.data, t('error'));
  }
}

const mode = () => {
  // if (route.params.id === 'add') {
  if (props.mode === 'add') {
    textHeader.value = t('titleFormAdd');
    checkMode.value = "add"
    // } else if (route.query.mode === 'update') {
  } else if (props.mode === 'update') {
    textHeader.value = t('titleFormUpdate');
    checkMode.value = "update"
  } else {
    textHeader.value = t('titleFormView');
    checkMode.value = "view"
  }
};


let selectedFile: File | null = null;

const handleFileChange = (file: File) => {
  if (file instanceof File) {
    selectedFile = file;
    imageUrl.value = URL.createObjectURL(selectedFile);
  }
}

const beforeAvatarUpload = (file: { raw: File }) => {
  const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
  const isLt2M = file.raw.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error(t('errorFileType'));
    return;
  }
  if (!isLt2M) {
    ElMessage.error(t('errorFileSize'));
    return;
  }
  handleFileChange(file.raw);
};


const rules = reactive<FormRules<typeof formData>>({
  name: [{validator: validateName(t) as (rule: any, value: any, callback: any) => void, trigger: ["change"]}],
  categoryCode: [{validator: validateCode(t) as (rule: any, value: any, callback: any) => void, trigger: ["change"]}],
  description: [{
    validator: validateDescription(t) as (rule: any, value: any, callback: any) => void,
    trigger: ["change"]
  }]
})

const submitForm = (formEl: any) => {
  if (!formEl) return
  formEl.validate((valid: any) => {
    if (valid) {
      const categoryData = new FormData();
      categoryData.append('name', formData.value.name.trim());
      categoryData.append('categoryCode', formData.value.categoryCode.trim());
      categoryData.append('description', formData.value.description.trim());
      if (selectedFile) {
        categoryData.append('image', selectedFile);
      }
      if (checkMode.value === "add") {
        callAPICreateCategory(categoryData)
      } else {
        categoryData.append("status", formData.value.status == "ACTIVE" ? "1" : "0");
        categoryData.append("id", formData.value.id + "");
        callAPIUpdateCategory(categoryData)
      }
    } else {
      NotificationCustom.error(t('errorForm'), t('error'))
    }
  })
}

const goBack = () => {
  eventBus.emit('goBack')
}


onMounted(() => {
  mode()
  if (checkMode.value != "add") {
    // callAPIGetDetail(route.params.id);
    callAPIGetDetail(props.id);
  }
})
onBeforeUnmount(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
});
</script>

<template>
  <div class="page">
    <h3 class="title">{{ textHeader }}</h3>
    <el-form :disabled="checkMode == 'view'" label-position="top"
             ref="ruleFormRef"
             :rules="rules"
             :model="formData">
      <div style="display:flex">
        <div style="flex: 1">
          <el-form-item style="height: 100%">
            <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
              <div>
                <el-upload
                    :disabled="checkMode == 'view'"
                    class="avatar-uploader"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" alt="" class="avatar"/>
                  <el-icon v-else class="avatar-uploader-icon">
                    <Plus/>
                  </el-icon>
                </el-upload>
              </div>
              <div v-if="checkMode == 'view'" class="category-container">
                <p class="category-title">{{formData.name}}</p>
                <div style="text-align: center">
                  <el-tag type="info" class="category-tag">{{formData.categoryCode}}</el-tag>
                  <el-tag type="success" class="category-tag">{{$t('active')}}</el-tag>
                </div>
                <div class="category-details">
                  <div class="category-row">
                    <div class="category-label">{{$t('fieldDescriptionCategory')}}</div>
                    <div class="category-value">{{formData.description}}</div>
                  </div>
                  <div class="category-row">
                    <div class="category-label">{{$t('fieldCreateDateCategory')}}</div>
                    <div class="category-value">{{formData.createdDate}}</div>
                  </div>
                  <div class="category-row">
                    <div class="category-label">{{$t('fieldUpdateDateCategory')}}</div>
                    <div class="category-value">{{formData.modifiedDate}}</div>
                  </div>
                  <div class="category-row">
                    <div class="category-label">{{$t('fieldCreateBy')}}</div>
                    <div class="category-value">{{formData.createdBy}}</div>
                  </div>
                  <div class="category-row">
                    <div class="category-label">{{$t('fieldUpdateBy')}}</div>
                    <div class="category-value">{{formData.modifiedBy}}</div>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>

        </div>

        <div style="flex: 2">
          <el-form-item :label="$t('fieldCodeCategory')" prop="categoryCode">
            <el-input :disabled="checkMode == 'update' " v-model="formData.categoryCode"/>
          </el-form-item>
          <el-form-item :label="$t('fieldNameCategory')" prop="name">
            <el-input v-model="formData.name"/>
          </el-form-item>
          <el-form-item :label="$t('fieldDescriptionCategory')" prop="description">
            <el-input v-model="formData.description"/>
          </el-form-item>
          <div v-if="checkMode != 'add'">
            <el-form-item :label="$t('fieldCreateDateCategory')" prop="createdDate">
              <el-input :disabled="checkMode == 'update' " v-model="formData.createdDate"/>
            </el-form-item>
            <el-form-item :label="$t('fieldUpdateDateCategory')" prop="modifiedDate">
              <el-input :disabled="checkMode == 'update' " v-model="formData.modifiedDate"/>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <div style="display: flex; align-items: flex-end; justify-content: flex-end; margin-right: 20px">
      <div>
        <el-button type="info" @click="goBack()">{{ $t('btnBack') }}</el-button>
        <el-button v-if="checkMode != 'view'" @click="submitForm(ruleFormRef)" type="primary">{{ $t('btnSave') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
::v-deep .el-form-item__content {
  align-items: center;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  font-size: var(--font-size);
  line-height: 32px;
  min-width: 0;
  position: relative;
  justify-content: center;
  height: 100%;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.title {
  padding: 12px;
}

.page {
  width: 100%;
  margin: 0 auto 12px;
  background-color: #ffffff;
  border-radius: 4px;
  padding: 24px;
}

.category-container {
  font-family: Arial, sans-serif;
}

.category-title {
  font-weight: bold;
  text-align: center;
}

.category-tag {
  margin-right: 8px;
}
.category-details {
  width: 320px;
}

.category-row {
  display: flex;
}

.category-label {
  text-align: right;
  margin-right: 12px;
  display: inline-block;
  width: 120px;
}
.category-value {
  text-align: left;
  display: inline-block;
  width: 200px;
}

</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 178px;
  height: 178px;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>