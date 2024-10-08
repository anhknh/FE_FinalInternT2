import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import "./assets/BaseCss.css"
import 'element-plus/dist/index.css';
import router from "@/router/index";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import i18n from "@/utils/i18n";
import App from './App.vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus)
app.use(router)
app.use(i18n);
app.mount('#app')
