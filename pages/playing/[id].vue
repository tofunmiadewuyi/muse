<template>
  <div class="page flex justify-center items-center">
    <Playing
      v-if="isReady"
      :deviceReady="deviceReady"
      :playerInstance="playerInstance!"
      :trackPlaying="track"
      :playbackState="playbackState"
    />
  </div>
</template>

<script setup lang="ts">
import type { PlaybackState, SpotifyPlayer, Track } from "~/types/assets";

const id = useRoute().params.id;
const {
  playerInstance,
  deviceReady,
  currentTrack,
  playTrack,
  getPlaybackState,
} = useSpotifyPlayer();

const { getTrack } = useSpotify();

const track = (await getTrack(id as string)) as Track;

const playbackState = ref();

const isReady = ref(false);

console.log("playerInst:", playerInstance);
console.log("deviceReady", deviceReady);

watch([playerInstance, deviceReady], async ([player, ready]) => {
  if (player && ready) {
    try {
      await playTrack([track.uri]);
      playbackState.value = await getPlaybackState();
      console.log("pb state:", playbackState.value);
      isReady.value = !!playbackState.value;
    } catch (e) {
      console.error("Error initializing playback:", e);
      isReady.value = false;
    }
  }
});

// if (playerInstance.value && deviceReady.value) {
//       await playTrack([track.uri]);
//       playbackState.value = await getPlaybackState();
//       console.log("pb state:", playbackState.value);
//     }

console.log("track details:", track);
console.log("currentTrack", currentTrack);

definePageMeta({
  layout: "loggedin",
});

onUnmounted(() => {
  playerInstance.value?.disconnect();
});
</script>

<style scoped></style>
