<script setup lang="ts">

import {Plus} from "@element-plus/icons-vue";
import {onBeforeUnmount, onMounted, reactive, ref, watch} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {Product} from "@/components/product/Product";
import ApiService from "@/utils/ApiService";
import {Category} from "@/components/category/Category";
import NotificationCustom from "@/utils/NotificationCustom";

import {
  validateCode,
  validateDescription,
  validateName,
  validatePrice,
  validateQuantity
} from "@/utils/Validation";
import {eventBus} from "@/utils/EventBus";
import {useI18n} from "vue-i18n";
import {useDebounceFn} from "@vueuse/core";
import eVI from 'element-plus/es/locale/lang/vi'
import eEV from 'element-plus/es/locale/lang/en'
const { t, locale } = useI18n();
const language = ref()
language.value = localStorage.getItem('language');
const isLang = ref()
isLang.value = language.value === "en" ? eEV : eVI;

watch(locale, () => {
  language.value = localStorage.getItem('language');
  isLang.value = language.value === "en" ? eEV : eVI;
})


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

const options = ref<Array<{ label: string; value: number }>>([]);


const formData = ref<Product>({
  id: 0,
  productCode: '',
  name: '',
  description: '',
  price: 1,
  quantity: 1,
  urlImage: null,
  status: '',
  category: [],
  categoryId: '',
  createdDate: '',
  modifiedDate: '',
  createdBy: '',
  modifiedBy: '',
  categoryCode: []
});
const imageUrl = ref<string | null>(null);
const checkMode = ref()


const callAPIGetAll = async () => {
  try {
    const response = await ApiService.get<Category[]>('/view-all-category'); // Nhớ response là mảng
    options.value = response.data.map(category => ({
      label: category.categoryCode,
      value: category.id
    }));
  } catch (error: any) {
    NotificationCustom.error(error.response.data, t('error'));
  }
}

const callAPIGetDetail = async (id: any) => {
  try {
    const response = await ApiService.get<Product>('/view-detail-product', {
      params: {
        id: id
      }
    });
    formData.value = response.data;
    formData.value.categoryCode = JSON.parse(response.data.categoryId);
    if (response.data.urlImage != null) {
      imageUrl.value = response.data.urlImage;
    }
  } catch (error: any) {
    NotificationCustom.error(error.response.data, t('error'));
  }
}


const callAPICreateProduct = async (data: FormData) => {
  try {
    const response = await ApiService.post('/create-product', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // router.push('/category');
    eventBus.emit('loadData');
    NotificationCustom.success(t('addSuccessPRO'), t('success'));
  } catch (error: any) {
    NotificationCustom.error(error.response.data, t('error'));
  }
}

const callAPIUpdateProduct = async (data: FormData) => {
  try {
    const response = await ApiService.put('/update-product', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    // router.push('/category');
    eventBus.emit('loadData');
    NotificationCustom.success(t('updateSuccessPRO'), t('success'));
  } catch (error: any) {
    NotificationCustom.error(error.response.data, t('error'));
  }
}


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

const validateCategory = (t: (key: string) => string) => {
  return useDebounceFn(
      (rule: any, value: string[], callback: (error?: Error) => void): void => {
        console.log(value)
        if (!value || value.length === 0) {
          return callback(new Error(t('validateCategoryRequired')));
        }
        callback();
      },
      300
  );
};


const rules = reactive<FormRules<typeof formData>>({
  name: [
    { required: true, message: t('validateName'), trigger: ["change"] },
    {validator: validateName(t) as (rule: any, value: any, callback: any) => void, trigger: ["change"]}
  ],
  productCode: [
    { required: true, message: t('validateCode'), trigger: ["change"] },
      {validator: validateCode(t) as (rule: any, value: any, callback: any) => void, trigger: ["change"]}
  ],
  description: [
    { required: true, message: t('validateDescription'), trigger: ["change"] },
      {validator: validateDescription(t) as (rule: any, value: any, callback: any) => void, trigger: ["change"]}
  ],
  price: [
    { required: true, message: t('validatePrice'), trigger: ["change"] },
      {validator: validatePrice(t) as (rule: any, value: any, callback: any) => void, trigger: ["change"]}
  ],
  quantity: [
    { required: true, message: t('validateQuantity'), trigger: ["change"] },
      {validator: validateQuantity(t) as (rule: any, value: any, callback: any) => void, trigger: ["change"]}
  ],
  categoryCode: [
      { required: true, message: t('validateCategoryRequired'), trigger: ["change"] },
    {validator: validateCategory(t) as (rule: any, value: any, callback: any) => void, trigger: ["change"]}
  ]

})



const submitForm = (formEl: any) => {
  if (!formEl) return
  formEl.validate((valid: any) => {
    if (valid) {
      const productData = new FormData();
      productData.append("name", formData.value.name);
      productData.append("productCode", formData.value.productCode);
      productData.append("description", formData.value.description);
      productData.append("price", formData.value.price +"");
      productData.append("quantity", formData.value.quantity +"");
      formData.value.categoryCode.forEach(categoryId => {
        productData.append("categoryIds", categoryId.toString()); // Thêm từng phần tử
      });
      if (selectedFile) {
        productData.append('image', selectedFile);
      }
      if(checkMode.value === "add") {
        console.log(formData.value.category)
        callAPICreateProduct(productData)
      } else {
        console.log(formData.value.category)
        productData.append("status", formData.value.status == "ACTIVE" ? "1" : "0");
        productData.append("id", formData.value.id +"");
        callAPIUpdateProduct(productData)
      }
    } else {
      NotificationCustom.error(t('errorForm'), t('error'))
    }
  })
}

const mode = () => {
  // if (route.params.id === 'add') {
  if (props.mode === 'add') {
    textHeader.value = t('titleFormAddPRO');
    checkMode.value = "add"
    // } else if (route.query.mode === 'update') {
  } else if (props.mode === 'update') {
    textHeader.value = t('titleFormUpdatePRO');
    checkMode.value = "update"
  } else {
    textHeader.value = t('titleFormViewPRO');
    checkMode.value = "view"
  }
};

const goBack = () => {
  eventBus.emit('goBack')
}

onMounted(() => {
  mode()
  callAPIGetAll()
  if (checkMode.value != "add") {
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
            <div style="display: flex; flex-direction: column;align-items: center; justify-content: center; height: 100%;">
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
                  <el-tag type="info" class="category-tag">{{formData.productCode}}</el-tag>
                  <el-tag type="success" class="category-tag">{{$t('active')}}</el-tag>
                </div>
                <div class="category-details">
                  <div class="category-row">
                    <div class="category-label">{{$t('fieldCodePrice')}}</div>
                    <div class="category-value">{{formData.price}}</div>
                  </div>
                  <div class="category-row">
                    <div class="category-label">{{$t('fieldCodeQuantity')}}</div>
                    <div class="category-value">{{formData.quantity}}</div>
                  </div>
                  <div class="category-row">
                    <div class="category-label">{{$t('fieldCategory')}}</div>
                    <div class="category-value">{{formData.category}}</div>
                  </div>
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

        <div style="flex: 2; padding: 8px">
          <div style="display: flex">
            <div style="flex: 1; padding-right: 8px">
              <el-form-item :label="$t('fieldCodeProduct')" prop="productCode">
                <el-input :disabled="checkMode == 'update' " v-model="formData.productCode"/>
              </el-form-item>
              <el-form-item :label="$t('fieldNameCategory')" prop="name">
                <el-input v-model="formData.name"/>
              </el-form-item>
            </div>
            <div style="flex: 1; padding-left: 8px">
              <el-form-item :label="$t('fieldCodePrice')" prop="price">
                <el-input type="number" v-model="formData.price"/>
              </el-form-item>
              <el-form-item :label="$t('fieldCodeQuantity')"  prop="quantity">
                <el-input type="number" v-model="formData.quantity"/>
              </el-form-item>
            </div>
          </div>
          <el-form-item :label="$t('fieldDescriptionCategory')" prop="description">
            <el-input v-model="formData.description"/>
          </el-form-item>
          <el-form-item :label="$t('fieldCategory')" prop="categoryCode">
            <el-config-provider :locale="isLang">
              <el-select-v2
                  v-model="formData.categoryCode"
                  filterable
                  :options="options"
                  :placeholder="$t('placeholderSelectedCATEGORY')"
                  style="width: 100%"
                  multiple
                  :virtual-scroll="true"
              >
                <template #default="{ item }">
                  <span style="margin-right: 8px">{{ item.label }}</span>
                </template>
              </el-select-v2>
            </el-config-provider>
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
        <el-button type="info" @click="goBack()">{{$t('btnBack')}}</el-button>
        <el-button v-if="checkMode != 'view'" type="primary" @click="submitForm(ruleFormRef)">{{$t('btnSave')}}</el-button>
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
  width: 278px;
  height: 278px;
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
  padding: 12px;
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
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 278px;
  height: 278px;
  text-align: center;
}
</style>