<template>
  <div class="side-nav">
    <div class="grid grid-cols-1 gap-2 mt-5">
      <NuxtLink class="page-tab" :class="{ 'active-page': nowPlaying }">
        <i class="ri-play-circle-fill text-[20px] leading-[20px]"></i>
        <p>Now Playing</p>
      </NuxtLink>

      <NuxtLink class="page-tab" to="/dashboard" activeClass="active-page">
        <i class="ri-user-smile-fill text-[20px] leading-[20px]"></i>
        <p>Dashboard</p>
      </NuxtLink>

      <NuxtLink
        class="page-tab"
        to="/playlists"
        :class="{ 'active-page': playlists }"
      >
        <i class="ri-folder-music-fill text-[20px] leading-[20px]"></i>
        <p>Playlists</p>
      </NuxtLink>

      <NuxtLink class="page-tab" to="/recents" activeClass="active-page">
        <i class="ri-hourglass-fill text-[20px] leading-[20px]"></i>
        <p>Recently Played</p>
      </NuxtLink>

      <NuxtLink class="page-tab" to="/recommended" activeClass="active-page">
        <i class="ri-lightbulb-flash-fill text-[20px] leading-[20px]"></i>
        <p>Recommended</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const nowPlaying = computed(() => {
  return route.path.includes("/playing") ? true : false;
});

const playlists = computed(() => {
  return route.path.includes("/playlists") ? true : false;
});
</script>

<style scoped>
.side-nav {
  @apply fixed left-6 top-32  w-[240px] hidden lg:block;
}
.page-tab {
  @apply p-2 rounded-[16px] hover:bg-black/90 hover:text-white flex gap-1 hover:px-4 hover:gap-2 items-center text-[16px] cursor-pointer;
  transition: all 200ms var(--power2-out);
}

.page-tab i {
  @apply text-[var(--grey-dark)];
}

.page-tab:hover i {
  @apply text-white;
}

.active-page {
  @apply bg-black text-white;
}
</style>
