import router from ".";
import { ref } from "vue";

const isAuthed = ref(false);

router.beforeEach((to, from, next) => {
    console.log(to);
    console.log(from);
    if (isAuthed)
        next({ name: 'login' })
});

router.afterEach((to, from) => {
    console.log(to);
    console.log(from);
});

export default router;