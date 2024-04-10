<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NMessageProvider, NNotificationProvider, NDialogProvider } from 'naive-ui'

const placement = "top-right"

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
