<template>
  <div class="page flex justify-center items-center">
    <div class="flex flex-col gap-1 items-center">
      <h1>Welcome to Muse</h1>
      <p>Log in to Spotify to continue.</p>
      <button @click="login" class="btn mt-4">Login</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = () => {
  useToast("Testing toast");
};

const { login } = useSpotifyAuth();
</script>

<style scoped lang="css"></style>
