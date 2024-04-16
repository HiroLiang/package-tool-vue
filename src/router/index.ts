import { Router, createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../components/HomeView.vue';

const router: Router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            children: [
                {
                    path: '',
                    name: 'branchList',
                    component: () => import('../components/BranchList.vue')
                },
                {
                    path: '/cms',
                    name: 'cms',
                    component: () => import('../components/CmsPage.vue')
                }
            ]
        }
    ]
});

export default router;