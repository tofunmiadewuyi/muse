<template>
  <div class="album p-5 rounded-[24px] bg-[var(--grey)] w-[320px] relative">
    <button
      @click="() => (expanded = !expanded)"
      class="hover:bg-black/10 flex items-center justify-center h-8 w-8 rounded-xl absolute top-5 right-5"
    >
      <i
        v-if="expanded"
        class="ri-arrow-down-s-line text-[20px] leading-[20px]"
      ></i>
      <i v-else class="ri-arrow-up-s-line text-[20px] leading-[20px]"></i>
    </button>

    <div>
      <div class="flex gap-1 pb-1 items-center text-[var(--grey-dark)]">
        <i class="ri-album-fill text-[20px] leading-[20px]"></i>
        <p>Album</p>
      </div>
      <p>{{ currentTrack.album.name }}</p>
    </div>

    <div class="expandable wrapper" :class="{ open: expanded }">
      <div class="inner">
        <div class="content v-grid mt-5">
          <div>
            <div class="flex gap-1 pb-1 items-center text-[var(--grey-dark)]">
              <i class="ri-speak-fill text-[20px] leading-[20px]"></i>
              <p>Artist</p>
            </div>
            <p>{{ currentTrack.artists.map((a) => a.name).join(", ") }}</p>
          </div>

          <!-- <div>
            <div class="flex gap-1 pb-1 items-center text-[var(--grey-dark)]">
              <i class="ri-information-2-fill text-[20px] leading-[20px]"></i>
              <p>Details</p>
            </div>
            <p>Artist</p>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const expanded = ref(false);

const { state } = defineProps<{ state: PlayerState }>();

const currentTrack = ref(state.track_window.current_track);
</script>

<style scoped>
.v-grid {
  @apply grid grid-cols-1 gap-4;
}

.album {
  transition: all 300ms ease;
}

.wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 1s var(--expo-out);
}

.wrapper.open {
  grid-template-rows: 1fr;
}

.inner {
  overflow: hidden;
}
</style>
