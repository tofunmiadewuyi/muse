<template>
  <div>Processing login...</div>
</template>

<script setup>
const router = useRouter();
const { handleCallback } = useSpotifyAuth();

onMounted(async () => {
  await handleCallback();
  router.push("/");
});
</script>
