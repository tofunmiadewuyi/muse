<template>
  <div class="card" @click="() => navigateTo('/recents')">
    <div v-if="data" class="container">
      <NuxtLink
        v-for="(recent, index) in data"
        class="album"
        :key="recent.track.id"
        :to="{ path: `/playing/${recent.track.id}`, query: { type: 'track' } }"
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
.card {
  @apply flex flex-col gap-8 hover:scale-110 cursor-pointer;
  transition: transform 500ms var(--power2-out);
}
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
  /* transition: transform 500ms var(--elastic-out); */
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
  transition: all 600ms var(--back-out);
  border-radius: calc(var(--container) / 12);
  /* transform: rotate3d(0, 1, 0, 30deg); */
  overflow: hidden;
  /* box-shadow: 0px 2px 6px 0.5px rgba(0, 0, 0, 5%); */
  border: 6px solid var(--grey);
}

.album:nth-child(1) {
  top: 12%;
  left: 12%;
  transform: rotate(-10deg);
}
.album:nth-child(2) {
  top: 6%;
  left: 28%;
  transform: rotate(5deg);
}
.album:nth-child(3) {
  top: 18%;
  left: 45%;
  transform: rotate(10deg);
}
.album:nth-child(4) {
  top: 24%;
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
