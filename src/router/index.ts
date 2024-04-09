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
                }
            ]
        }
    ]
});

export default router;