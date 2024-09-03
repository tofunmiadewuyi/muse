<template>
  <div class="page">
    <div>Welcome to Muse</div>
    <button class="btn" @click="toast">Toast</button>
  </div>
</template>

<script setup lang="ts">
const toast = () => {
  useToast("Testing toast");
};
</script>

<style scoped lang="css"></style>
