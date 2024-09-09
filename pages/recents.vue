<template>
  <div class="nav-page flex flex-col gap-10 items-center">
    <div class="flex gap-5 items-center mt-16 w-full">
      <div class="flex flex-col gap-2">
        <h1>Recently played</h1>
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

    <div v-if="recents" class="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <NuxtLink
        v-for="song in recents.items"
        :key="song.track.id"
        class="card group hover:scale-105 smooth"
        :to="{ path: `/playing/${song.track.id}`, query: { type: 'track' } }"
      >
        <img
          :src="`${song.track.album.images && song.track.album.images[0].url}`"
          class="album-cover"
        />
        <div class="flex flex-col gap-1 items-center w-full">
          <p class="truncate w-full">{{ song.track.name }}</p>
          <p class="label line-clamp-2">
            {{ song.track.artists.map((a: any) => a.name).join(" • ") }}
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecentlyPlayed } from "~/types/assets";

const { getRecentlyPlayed } = useSpotify();

const recentsRes: { items: RecentlyPlayed[] } | null = await getRecentlyPlayed(
  50
);
const recents = {
  items: recentsRes?.items
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.track.id === value.track.id)
    )
    .splice(0, 20),
};

const trackListQuery = computed(() => {
  return {
    type: "recents",
    ids: recents?.items?.map((t) => t.track.id),
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
