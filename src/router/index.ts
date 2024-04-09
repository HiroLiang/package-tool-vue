import { Router, createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../components/HomeView.vue';

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        }
    ]
});

export default router;