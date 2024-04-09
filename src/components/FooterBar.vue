<script setup lang="ts">

const test = () => {
    // localStorage.removeItem("id");
}
</script>
<template>
    <div class="footer-box">
        <button @click="test">press</button>
    </div>
</template>
<style scoped>
.footer-box{
    position: fixed;
    bottom: 0;
    left: 0;
    height: 72px;
    width: 100%;
    background-color: rgb(182, 182, 183);
}
</style>