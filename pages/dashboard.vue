<template>
  <div class="page flex justify-center flex-col items-center px-12 py-20">
    <h1 class="text-[32px] leading-8 my-8">
      Welcome to your dashboard, {{ user.display_name }}
    </h1>
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

const recentsRes: { items: RecentlyPlayed[] } | null = await getRecentlyPlayed(
  50
);

const recents = {
  items: recentsRes?.items
    .filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.track.id === value.track.id)
    )
    .splice(0, 4),
};

const user = useCookie<SpotifyUser>("user");
</script>

<style scoped></style>
