import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routerGuard'
import { createPinia } from "pinia";
import naive from 'naive-ui';

// 測試開關
localStorage.setItem('isMock', 'true');

// Vue 總管物件
const app = createApp(App);

// 錯誤處理
app.config.errorHandler = (err, instance, info) => {
    console.error(`Error: ${err} \n ${info.toString()}`);
}

app.use(router);
app.use(createPinia());
app.use(naive);
app.mount('#app');