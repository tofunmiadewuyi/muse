<template>
  <div class="page flex justify-center items-center relative">
    <!-- <Playing
      v-if="isReady"
      :deviceReady="deviceReady"
      :playerInstance="playerInstance!"
      :trackPlaying="track"
      :playbackState="playbackState"
    /> -->
    <ShimmersPlaying :deviceReady="false" />
    <div class="absolute bottom-10 right-10">
      <PlayingAlbum />
    </div>
    <div class="absolute bottom-10 left-10">
      <PlayingQueue />
    </div>
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

console.log("trackDetails:", track);
console.log("currentTrack:", currentTrack);

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

definePageMeta({
  layout: "loggedin",
});

onUnmounted(() => {
  playerInstance.value?.disconnect();
});
</script>

<style scoped></style>
