<template>
  <div class="flex flex-col gap-8">
    <div v-if="data" class="container">
      <NuxtLink
        v-for="(recent, index) in data"
        class="album"
        :style="{
          left: `${(index + 1) * 9}%`,
          top: `${index * 5}%`,
          ':hover': {
            top: `${index * 5 + -10}%`,
          },
        }"
        :key="recent.track.id"
        :to="`/playing/${recent.track.id}`"
      >
        <img
          class="w-full h-full"
          :src="recent.track.album.images[0].url"
          :srcset="
            recent.track.album.images
              .map((img) => `${img.url} ${img.width}w`)
              .join(',')
          "
        />
      </NuxtLink>
      <div>Recently Played</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import type { RecentlyPlayed } from "~/types/assets";

defineProps<{ data?: RecentlyPlayed[] }>();

onMounted(() => {
  gsap.to(".album", { y: 0, stagger: 0.2 });
});
</script>

<style scoped lang="css">
.container {
  --container: 320px;
  width: var(--container);
  height: var(--container);
  border-radius: calc(var(--container) / 6.4);
  position: relative;
  box-shadow: inset 0px 0px 0px 0.5px rgba(0, 0, 0, 5%);
  display: flex;
  justify-content: center;
  align-items: end;
  text-align: center;
  background-color: var(--grey);
  /* overflow: hidden; */
  transition: transform 300ms ease;
  perspective: 800px;
  padding: calc(var(--container) / 10);
  font-size: 16px;
  letter-spacing: -0.4px;
}

.album {
  width: calc(var(--container) / 2);
  height: calc(var(--container) / 2);
  background-color: black;
  flex-shrink: 0;
  position: absolute;
  transition: all 300ms ease;
  border-radius: calc(var(--container) / 20);
  transform: rotate3d(0, 1, 0, 30deg);
  overflow: hidden;
  box-shadow: 0px 2px 6px 0.5px rgba(0, 0, 0, 5%);
}

.album:hover {
  transform: translateY(0%) !important;
  z-index: 1;
  width: calc(var(--container) / 1.6);
  height: calc(var(--container) / 1.6);
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
