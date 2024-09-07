<template>
  <div class="p-20 pl-80 flex flex-col gap-10 items-center">
    <div
      class="flex gap-5 justify-between items-center mt-8 w-full max-w-[840px]"
    >
      <div class="heading-box"><h1>My Playlists</h1></div>
      <div class="heading-box">
        <button @click="() => (isModalOpen = true)" class="btn">
          <p>Create Playlist</p>
          <Modal
            :isOpen="isModalOpen"
            @close="() => (isModalOpen = false)"
            title="Test Modal"
          >
            <FormsCreatePlaylist />
          </Modal>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-[840px]">
      <NuxtLink
        v-for="playlist in playlists"
        :key="playlist.id"
        class="card group hover:scale-105 smooth"
        :to="`/playlists/${playlist.id}`"
      >
        <img
          :src="`${
            playlist.images ? playlist.images[0].url : '/images/default.svg'
          }`"
          class="w-full h-full rounded-xl smooth group-hover:scale-110"
        />
        <div class="flex flex-col gap-1 items-center w-full">
          <p class="truncate w-full">{{ playlist.name }}</p>
          <p class="text-[var(--grey-dark)]">
            {{ playlist.tracks.total }} songs
          </p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Playlist } from "~/types/assets";

const isModalOpen = ref();

const { getUserPlaylists } = useSpotify();

const data = (await getUserPlaylists()) as { items: Playlist[] };
const playlists = ref();

playlists.value = data.items;

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
