import router from ".";

router.beforeEach((to, from, next) => {
    let isMock = localStorage.getItem("isMock");
    if(isMock && isMock == 'true')
        next();
});

router.afterEach((to, from) => {
});

export default router;