<template>
  <div class="nav-page flex flex-col gap-10 items-center">
    <div class="flex gap-5 items-center mt-16 w-full">
      <div class="flex flex-col gap-2">
        <h1>Recommended Songs</h1>
        <p class="text-black/70 text-[14px]">Based on your listening history</p>
      </div>
      <div class="">
        <NuxtLink
          class="text-[80px] leading[80px] icon-bounce"
          :to="{
            path: '/playing/list',
            query: trackListQuery,
          }"
        >
          <i class="ri-play-circle-fill"></i>
        </NuxtLink>
      </div>
    </div>

    <div v-if="recommended" class="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <NuxtLink
        v-for="song in recommended.tracks"
        :key="song.id"
        class="card group hover:scale-105 smooth"
        :to="{ path: `/playing/${song.id}`, query: { type: 'track' } }"
      >
        <img
          :src="`${song.album.images && song.album.images[0].url}`"
          class="album-cover"
        />
        <div class="flex flex-col gap-1 items-center w-full">
          <p class="truncate w-full">{{ song.name }}</p>
          <p class="label line-clamp-2">
            {{ song.artists.map((a: any) => a.name).join(" • ") }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Track } from "~/types/assets";

const { getTopTracks, getRecommendations } = useSpotify();

const recommended = ref<{
  seeds: {}[];
  tracks: Track[];
}>();

const topTracks = await getTopTracks();

recommended.value = (await getRecommendations(20, topTracks.items)) as {
  seeds: {}[];
  tracks: Track[];
};

const trackListQuery = computed(() => {
  return {
    type: "recommended",
    ids: recommended.value?.tracks.map((t) => t.id),
  };
});

definePageMeta({
  layout: "navigation",
});
onMounted(() => {});
</script>

<style lang="css" scoped>
.smooth {
  transition: all 300ms cubic-bezier(0.39, 0.575, 0.565, 1);
}

.card {
  @apply flex flex-col items-center justify-between gap-4 text-center py-5 px-5 rounded-[32px];
  background-color: var(--grey);
  position: relative;
  animation: slideUp 150ms cubic-bezier(0.39, 0.575, 0.565, 1);
}

.album-cover {
  @apply w-full h-full rounded-xl smooth group-hover:scale-110 group-hover:rounded-3xl;
}

.label {
  @apply text-[var(--grey-dark)] text-[14px];
}

@keyframes slideUp {
  from {
    transform: translateY(5%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
