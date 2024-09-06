<template>
  <button
    @click="goBack"
    class="bg-black/5 hover:bg-black/10 flex items-center justify-center h-8 w-8 rounded-xl"
  >
    <i class="ri-arrow-left-line text-[20px] leading-[20px]"></i>
  </button>
</template>

<script setup lang="ts">
const router = useRouter();
const goBack = () => router.back();
</script>

<style scoped></style>
