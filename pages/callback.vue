<template>
  <div>Processing login...</div>
</template>

<script setup>
const router = useRouter();
const { handleCallback, getUser } = useSpotifyAuth();

onMounted(async () => {
  const res = await handleCallback();
  if (res) await getUser();
  router.push("/");
});
</script>
