<template>
  <div class="nav-page flex flex-col gap-10 items-center relative">
    <div class="content flex flex-col w-full gap-10 pt-20">
      <div class="heading-box"><Back /></div>
      <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="cover relative flex-shrink-0">
          <img
            :src="`${
              details.images ? details.images[0].url : '/images/default.svg'
            }`"
            class="cover-image"
          />

          <NuxtLink
            v-if="details.tracks.total > 0"
            class="icon-play"
            :to="{ path: `/playing/${id}`, query: { type: 'playlist' } }"
          >
            <i class="ri-play-circle-fill"></i>
          </NuxtLink>
        </div>

        <div class="title flex flex-col gap-8 items-center mt-8 w-full">
          <div class="heading-box flex-col gap-2">
            <h1 class="">{{ details.name }}</h1>
            <p>
              <span class="text-[var(--grey-dark)] mr-1">by</span
              >{{ details.owner.display_name }}
            </p>
          </div>
          <div class="heading-box gap-4">
            <button :disabled="details.tracks.total < 1" class="btn">
              Play songs
            </button>
            <button @click="() => (isModalOpen = true)" class="btn sec">
              Add songs
            </button>
            <button @click="() => handleCopy()" class="btn sec">
              <p v-if="!copying" class="copy-default">Share</p>
              <p v-else class="copy-active">Link Copied!</p>
            </button>
            <Modal
              :isOpen="isModalOpen"
              @close="() => (isModalOpen = false)"
              title="Add Songs to Playlist"
            >
              <FormsAddSongsPlaylist
                :tracks="details.tracks.items"
                :playlistId="id"
                @addedItem="handleItemAdded"
              />
            </Modal>
          </div>
        </div>
      </div>

      <div class="w-full">
        <p class="text-black/80 mb-2">Tracks</p>
        <div class="grid grid-cols-1 md:grid-cols-3 text-center gap-6 w-full">
          <div v-for="(item, index) in details.tracks.items">
            <NuxtLink
              :to="{
                path: `/playing/${id}`,
                query: { type: 'playlist', position: index },
              }"
              class="song-btn"
            >
              <i class="ri-play-fill"></i>
              <p class="line-clamp-1">{{ item.track.name }}</p>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Playlist, Track } from "~/types/assets";

const isModalOpen = ref(false);

const { getPlaylist } = useSpotify();

const id = useRoute().params.id as string;
const details = ref();

const [data, refresh] = await getPlaylist(id as string);

details.value = data as Playlist & {
  tracks: { items: { track: Track }[] };
};
const refreshPlaylist = refresh as () => Promise<void>;

const handleItemAdded = async () => {
  isModalOpen.value = false;
  refreshPlaylist();
};

const copying = ref(false);
const handleCopy = () => {
  copying.value = true;
  copyCode(`https://open.spotify.com/playlist/${id}`);
  setTimeout(() => {
    copying.value = false;
  }, 2000);
};

definePageMeta({
  layout: "navigation",
});
</script>

<style lang="css" scoped>
.cover-image {
  width: 320px;
  height: 320px;
  border-radius: 50px;
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.05);
}

.disabled {
  @apply pointer-events-none;
}

.song-btn {
  @apply rounded-full py-4 px-6 flex gap-2 hover:scale-105;
  background-color: var(--grey);
  transition: all 500ms var(--power2-out);
}

.icon-play {
  @apply text-[80px] leading-[80px] hover:scale-110 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-white;
  transition: all 2s var(--elastic-out);
}
</style>
