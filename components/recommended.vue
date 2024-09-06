<template>
  <NuxtLink class="card" to="/recommended">
    <div class="container">
      <div class="icon-bounce">
        <i class="ri-play-circle-fill"></i>
      </div>
      <div class="flex flex-col gap-2">
        <p>Recommended</p>
        <p class="text-[var(--grey-dark)]">Based on your history</p>
      </div>
      <!-- <i
        class="ri-medal-fill text-[56px] leading-[56px] text-[var(--grey-dark)] absolute top-0 right-8"
      ></i> -->
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const { getTopTracks, getRecommendations } = useSpotify();

const topTracks = await getTopTracks();

const recommends = await getRecommendations(topTracks.items);

console.log("recommended:", recommends);
</script>

<style scoped lang="css">
.card {
  @apply flex flex-col gap-8 hover:scale-110;
  transition: transform 500ms var(--power2-out);
}

.container {
  --container: 320px;
  width: var(--container);
  height: var(--container);
  background-color: var(--grey);
  border-radius: calc(var(--container) / 6.4);
  position: relative;
  box-shadow: inset 0px 0px 0px 0.5px rgba(0, 0, 0, 5%);
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  text-align: center;
  /* overflow: hidden; */
  transition: transform 300ms ease;
  perspective: 800px;
  padding: calc(var(--container) / 10);
  font-size: 16px;
  letter-spacing: -0.4px;
}
</style>
