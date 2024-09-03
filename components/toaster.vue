<template>
  <Toaster
    :toastOptions="{
      class: 'toast',
      style: toastStyle,
    }"
    position="top-right"
  >
    <template #warning-icon>
      <i class="ri-error-warning-fill text-red-500/90"></i>
    </template>
    <template #success-icon>
      <i class="ri-checkbox-circle-fill text-green-500"></i>
    </template>
  </Toaster>
</template>

<script setup lang="ts">
import { Toaster } from "vue-sonner";

const toastStyle = {
  background: "rgba(25,25,25, 1)",
  border: "1px solid rgba(255,255,255, 0.1)",
  color: "white",
  borderRadius: "16px",
  backdropFilter: "blur(8px)",
};
</script>

<style scoped></style>
