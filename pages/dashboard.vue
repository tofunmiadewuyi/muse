<template>
  <div class="page flex justify-center flex-col items-center">
    <h1 class="text-[32px] leading-8 mt-16 mb-10">
      Welcome to your dashboard, {{ user.display_name }}
    </h1>
    <!-- <Playing /> -->
    <div class="flex flex-wrap justify-center gap-10">
      <Playlists />
      <Recents :data="recents?.items" />
      <Recommended />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecentlyPlayed, SpotifyUser } from "~/types/assets";

definePageMeta({
  layout: "loggedin",
});

const { getRecentlyPlayed } = useSpotify();

const recents: { items: RecentlyPlayed[] } | null = await getRecentlyPlayed();

const user = useCookie<SpotifyUser>("user");
</script>

<style scoped></style>
