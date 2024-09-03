<template>
  <div class="flex flex-col gap-8">
    <div class="container">
      <div
        class="disc"
        :class="{ spin: isPlaying }"
        :style="{
          backgroundImage: 'url(/lob.png)',
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

      <div class="details flex flex-col gap-2">
        <i class="ri-voiceprint-line text opacity-40 text-[20px]"></i>
        <div class="song-details">
          <p>Title</p>
          <p class="opacity-40">Artist</p>
        </div>
        <div class="timer">
          <p>1:07</p>
          <p>/ 2:56</p>
        </div>
      </div>
    </div>

    <div class="w-full relative">
      <div class="track" ref="track" />
      <div class="progress" :style="{ width: `${progress}%` }" />
      <div class="knob" id="knob"></div>
    </div>

    <div class="controls">
      <button class="control-btn"><i class="ri-shuffle-fill"></i></button>
      <button class="control-btn"><i class="ri-skip-left-fill"></i></button>
      <button v-if="isPlaying" @click="togglePlay" class="control-btn">
        <i class="ri-pause-circle-fill"></i>
      </button>
      <button v-if="!isPlaying" @click="togglePlay" class="control-btn">
        <i class="ri-play-circle-fill"></i>
      </button>
      <button class="control-btn"><i class="ri-skip-right-fill"></i></button>
      <button class="control-btn"><i class="ri-repeat-2-fill"></i></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";

import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const track = ref<HTMLDivElement | null>(null);

let trackWidth = 0;

const progress = ref(0);

const isPlaying = ref(false);

const dragValue = ref(0);

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying) {
  }
};

onMounted(() => {
  trackWidth.value = track.value.offsetWidth;
  Draggable.create("#knob", {
    type: "x",
    bounds: track.value,
    onClick: function () {
      console.log("knob clicked with gsap");
    },
    onDrag: function (event) {
      //   dragValue.value = this.x;
    },
    onDragEnd: function (event) {
      console.log("dragging stopped");
      dragValue.value = this.x;
      progress.value = (this.x / trackWidth.value) * 100;
    },
  });
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
  padding: 28px;
  justify-content: center;
  align-items: end;
  text-align: center;
  overflow: hidden;
}

.song-details {
  @apply flex flex-col gap-1;
}

.timer {
  @apply flex gap-1;
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
  position: absolute;
  top: -50%;
  --disc-size: 320px;
  --disc-center: 96px;
  width: var(--disc-size);
  height: var(--disc-size);
  background-color: blue;
  flex-shrink: 0;
  padding: calc((var(--disc-size) - var(--disc-center)) / 2);
  background-size: cover;
}

.spin {
  animation: spin 12s linear infinite;
}

.disc-center {
  width: var(--disc-center);
  height: var(--disc-center);
  background-color: rgba(0, 0, 0, 16%);
  backdrop-filter: blur(8px);
  padding: calc(var(--disc-size) / 40);
  mix-blend-mode: overlay;
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
