import { Router, createRouter, createWebHashHistory } from 'vue-router';
import LoginView from '../components/Login.vue';

const router: Router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginView
        }
    ]
});

export default router;