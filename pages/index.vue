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

const baseURL = useRuntimeConfig().public.baseURL;

const route = useRoute();
const router = useRouter();

const cookie = useCookie("accessToken");
const { login } = useSpotifyAuth();

const trackId = ref("");
const trackData = ref(null);

const getTrack = async () => {
  if (!cookie.value || !trackId.value) {
    console.log("still no accessToken");
    return;
  }

  const { data, error } = await useFetch(
    `${baseURL}/v1/tracks/${trackId.value}`,
    {
      headers: { Authorization: `Bearer ${cookie.value}` },
    }
  );

  if (error.value) {
    console.error("Error fetching track:", error.value);
  } else {
    trackData.value = data.value;
  }
};
</script>

<style scoped lang="css"></style>
