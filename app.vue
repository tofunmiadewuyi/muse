<template>
  <div>
    <NuxtLoadingIndicator color="black" :height="2" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import "remixicon/fonts/remixicon.css";
</script>
