<template>
  <div class="p-20 flex flex-col gap-10 items-center relative">
    <div class="flex gap-5 justify-between items-center mt-8 w-full">
      <div class="heading-box"><Back /></div>
      <div class="heading-box">
        <h1 class="">{{ details.name }}</h1>
      </div>
      <div class="heading-box">
        <button class="btn">Add songs</button>
      </div>
    </div>
    <div>
      <img
        :src="`${
          details.images ? details.images[0].url : '/images/default.svg'
        }`"
        class="cover-image"
      />
    </div>
    <p>
      <span class="text-[var(--grey-dark)] mr-1">by</span
      >{{ details.owner.display_name }}
    </p>

    <div class="grid grid-cols-1 text-center gap-4 w-full max-w-[320px]">
      Tracks
      <div v-for="item in details.tracks.items">
        <NuxtLink :to="`/playing/${item.track.id}`" class="song-btn">
          <i class="ri-play-fill"></i>
          <p class="text-center w-full">{{ item.track.name }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Playlist, Track } from "~/types/assets";

definePageMeta({
  layout: "loggedin",
});

const { getPlaylistById } = useSpotify();

const id = useRoute().params.id;
const details = ref();
const data = (await getPlaylistById(id as string)) as Playlist & {
  tracks: { items: { track: Track }[] };
};

details.value = data;
</script>

<style lang="css" scoped>
.cover-image {
  width: 320px;
  height: 320px;
  border-radius: 50px;
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 0.05);
}

.song-btn {
  @apply rounded-full py-4 px-6 flex gap-1;
  background-color: var(--grey);
}
</style>
