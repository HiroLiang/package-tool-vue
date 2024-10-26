<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUserAuth } from "./store/user-auth.ts";
import { NMessageProvider, NNotificationProvider, NDialogProvider } from 'naive-ui'

// position of notification
const placement = 'top-right';

// store of auth
const userAuth = useUserAuth();
userAuth.init();

</script>

<template>
  <n-message-provider :placement="placement" :max="8">
    <n-notification-provider :placement="placement">
      <n-dialog-provider>
        <RouterView />
      </n-dialog-provider>
    </n-notification-provider>
  </n-message-provider>
</template>

<style>
* {
  margin: 0;
  padding: 0;
}
</style>
