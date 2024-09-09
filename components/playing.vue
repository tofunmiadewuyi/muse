<template>
  <div class="flex items-center flex-col gap-8">
    <div class="container" :class="{ playing: !isPaused }">
      <div
        class="disc spin"
        :class="`${isPaused ? 'paused' : 'playing'} ${
          isPaused && 'animate-pulse'
        }`"
        :style="{
          backgroundImage: `${
            state &&
            `url(${state.track_window.current_track.album.images[0].url})`
          }`,
          transform: `rotate(${0}deg)`,
        }"
      >
        <div class="disc-center">
          <div class="disc-band-outer">
            <div class="disc-band-middle">
              <div class="disc-band-inner"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="!isPaused" class="details flex flex-col gap-2">
        <!-- <i class="ri-voiceprint-line text opacity-40 text-[20px]"></i> -->
        <div class="flex justify-center">
          <Wave :playing="!isPaused" />
        </div>
        <div v-if="state" class="song-details">
          <p class="line-clamp-2">{{ currentTrack.name }}</p>
          <p class="opacity-40 line-clamp-1">{{ artists }}</p>
        </div>
        <div class="timer">
          <p>{{ convertTimeToReadable(position) }}</p>
          <p>/ {{ convertTimeToReadable(duration) }}</p>
        </div>
      </div>
    </div>

    <div class="w-full relative">
      <div class="track" ref="track" />
      <div class="progress" :style="{ width: `${progress}%` }" />
      <div class="knob" id="knob" :style="{ marginLeft: `${progress}%` }"></div>
    </div>

    <div
      class="controls"
      :class="`${!deviceReady && 'pointer-events-none opacity-55'}`"
    >
      <button class="control-btn"><i class="ri-shuffle-fill"></i></button>
      <button @click="playPrev" class="control-btn">
        <i class="ri-skip-left-fill"></i>
      </button>
      <button v-if="!isPaused" @click="togglePlay" class="control-btn">
        <i class="ri-pause-circle-fill"></i>
      </button>
      <button v-if="isPaused" @click="togglePlay" class="control-btn">
        <i class="ri-play-circle-fill"></i>
      </button>
      <button @click="playNext" class="control-btn">
        <i class="ri-skip-right-fill"></i>
      </button>
      <button class="control-btn"><i class="ri-repeat-2-fill"></i></button>
    </div>

    <div
      class="tag flex items-center gap-2 max-w-max px-4 py-2 rounded-full"
      :class="`${deviceReady ? 'bg-green-500/15' : 'bg-yellow-500/15'}`"
    >
      <div
        v-if="deviceReady"
        class="h-2 w-2 rounded-full bg-green-500 animate-pulse"
      />
      <div v-else class="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
      <p v-if="deviceReady" class="text-[12px]">Connected</p>
      <p v-else class="text-[12px] text-[var(--grey-dark)]">Connecting...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";

import { Draggable } from "gsap/Draggable";
import type { SpotifyPlayer, PlayerState } from "~/types/assets";

gsap.registerPlugin(Draggable);

const { playerInstance, deviceReady, state } = defineProps<{
  playerInstance: SpotifyPlayer;
  deviceReady: boolean;
  state: PlayerState;
}>();

const currentTrack = ref(state.track_window.current_track);
const position = ref(state.position);
const duration = ref(state.duration);
const isPaused = ref(state.paused);

const artists = computed(() => {
  return currentTrack.value.artists
    .map((artist: { uri: string; name: string }) => artist.name)
    .join(", ");
});

const progress = computed(() => (position.value / duration.value) * 100);

const track = ref<HTMLDivElement | null>(null);

let trackWidth = 0;
let progressInterval: NodeJS.Timeout;

const togglePlay = () => {
  isPaused.value = !isPaused.value;
  playerInstance.togglePlay();
};

const playNext = () => {
  playerInstance.nextTrack().then(() => {});
};

const playPrev = () => {
  playerInstance.previousTrack().then(() => {});
};

const seek = (pos: number) => {
  playerInstance.seek(pos * 1000).then(() => {
    console.log("Changed position!");
  });
};

onMounted(async () => {
  trackWidth = track.value!.offsetWidth;

  progressInterval = setInterval(async () => {
    if (playerInstance) {
      const state = await playerInstance.getCurrentState();
      if (state) {
        currentTrack.value = state.track_window.current_track;
        position.value = state.position;
        isPaused.value = state.paused;
      }
    }
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(progressInterval);
});
</script>

<style scoped lang="css">
.container {
  width: 320px;
  height: 320px;
  background-color: var(--grey);
  border-radius: 50px;
  position: relative;
  box-shadow: inset 0px 0px 0px 0.5px rgba(0, 0, 0, 10%);
  display: flex;
  justify-content: center;
  align-items: end;
  text-align: center;
  overflow: hidden;
  transition: transform 300ms ease;
}

.container.playing {
  padding: 28px;
}

.details {
  animation: slideIn 200ms ease;
}

.song-details {
  @apply flex flex-col gap-1 items-center;
}

.timer {
  @apply flex gap-1 justify-center;
}

.disc,
.knob,
.disc-center,
.disc-band-outer,
.disc-band-middle,
.disc-band-inner {
  border-radius: 50vw;
}
.disc {
  --disc-size: 320px;
  --disc-center: 96px;
  width: var(--disc-size);
  height: var(--disc-size);
  background-color: rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
  padding: calc((var(--disc-size) - var(--disc-center)) / 2);
  background-size: cover;
  position: absolute;
  top: 0%;
  transition: all 300ms ease;
}

.spin {
  animation: spin 12s linear infinite;
}

.spin.paused {
  animation-play-state: paused;
  scale: 0.8;
}

.spin.playing {
  animation-play-state: running;
  top: -50%;
}

.disc-center {
  width: var(--disc-center);
  height: var(--disc-center);
  background-color: rgba(0, 0, 0, 16%);
  backdrop-filter: blur(8px);
  padding: calc(var(--disc-size) / 40);
  mix-blend-mode: overlay;
  position: relative;
}

.disc_center::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: var(--grey);
  border-radius: 50vw;
  width: calc(var(--disc-center) / 2.2857142857);
  height: calc(var(--disc-center) / 2.2857142857);
}

.disc-band-outer,
.disc-band-middle,
.disc-band-inner {
  width: 100%;
  height: 100%;
}

.disc-band-outer {
  border: calc(var(--disc-size) / 320) solid #c9c3c7; /* 1px */
  background-color: #9799a5;
  padding: calc(var(--disc-center) / 8); /* 12px */
}

.disc-band-middle {
  border: calc(var(--disc-size) / 64) solid #e4dfe5; /* 5px */
  background-color: #c9c3c7;
  padding: calc(var(--disc-center) / 13.7142857143); /* 7px */
}

.disc-band-inner {
  border: calc(var(--disc-size) / 320) solid rgba(0, 0, 0, 0.3); /* 1px */
  background-color: var(--grey);
}

.knob {
  --knob-size: 20px;
  position: relative;
  width: var(--knob-size);
  height: var(--knob-size);
  border: 4px solid white;
  background-color: black;
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 8%);
}

.knob,
.progress {
  transition: width 50ms linear;
}

.track {
  background-color: var(--grey);
  height: 2px;
  width: 100%;
  @apply absolute top-[9px] left-0 right-0 rounded-full;
}

.progress {
  background-color: black;
  height: 2px;
  @apply absolute top-[9px] left-0 right-0 rounded-full;
}

.controls {
  @apply flex gap-3 justify-between w-full;
}

.control-btn:nth-child(1),
.control-btn:nth-child(5) {
  font-size: 24px;
}
.control-btn:nth-child(2n) {
  font-size: 40px;
}
.control-btn:nth-child(3n) {
  font-size: 56px;
}

.control-btn {
  @apply hover:scale-110 active:scale-95;
  transition: all 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideIn {
  from {
    transform: translateY(5%);
    opacity: 0;
  }
  to {
    transform: translateY(0%);
    opacity: 1;
  }
}
</style>
