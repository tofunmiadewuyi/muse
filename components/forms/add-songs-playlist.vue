<template>
  <div>
    <div class="input w-full relative mb-3">
      <i class="ri-search-line search-icon"></i>
      <input
        type="text"
        v-model="searchValue"
        ref="searchbar"
        placeholder="Search Spotify"
        class="search-input"
        @input="handleSearch"
        @focus="() => (isSearching = true)"
        @blur="handleLostFocus"
      />
    </div>

    <div class="results-container flex min-h-[388px]">
      <div v-if="recommended && !isSearching" class="suggestions-container">
        <p class="label">Recommendations</p>
        <button
          v-for="song in recommended.tracks"
          :key="song.id"
          @click="addToPlaylist(song.uri)"
          class="suggestion-result-item group"
        >
          <div class="relative shrink-0">
            <img :src="`${song.album.images[0].url}`" class="album-cover" />
            <div class="icon-play">
              <i class="ri-add-circle-fill"></i>
            </div>
          </div>
          <div class="text-left">
            <p class="line-clamp-1">{{ song.name }}</p>
            <p class="label line-clamp-1">
              {{ song.artists.map((a: any) => a.name).join(" • ") }}
            </p>
          </div>
        </button>
      </div>

      <div v-if="isSearching" class="search-container">
        <div
          v-if="!searchResults"
          class="text-[12px] text-black/60 p-6 rounded-[12px] bg-black/5"
        >
          Type to search
        </div>
        <p v-if="searchResults" class="label">Search results</p>
        <button
          v-for="song in searchResults?.tracks.items"
          :key="song.id"
          @click="addToPlaylist(song.uri)"
          class="suggestion-result-item group"
        >
          <div class="relative shrink-0">
            <img :src="`${song.album.images[0].url}`" class="album-cover" />
            <div class="icon-play">
              <i class="ri-add-circle-fill"></i>
            </div>
          </div>
          <div class="text-left">
            <p class="line-clamp-1">{{ song.name }}</p>
            <p class="label line-clamp-1">
              {{ song.artists.map((a: any) => a.name).join(" • ") }}
            </p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Track, SearchResults } from "~/types/assets";
const { getTopTracks, getRecommendations, search, addItemsToPlaylist } =
  useSpotify();

const { tracks, playlistId } = defineProps<{
  tracks: { track: Track }[];
  playlistId: string;
}>();

const emit = defineEmits(["close", "addedItem"]);

const recommended = ref<{
  seeds: {}[];
  tracks: Track[];
}>();

const searchValue = ref<string>();
const isSearching = ref(false);

const searchResults = ref<SearchResults | null>();

const getSeedTracks = async () => {
  if (tracks.length > 0) return tracks.map((track) => track.track).slice(0, 5);
  else return await getTopTracks().then((top) => top.items);
};

recommended.value = (await getRecommendations(5, await getSeedTracks())) as {
  seeds: {}[];
  tracks: Track[];
};

const handleSearch = async () => {
  if (searchValue.value && searchValue.value.length > 0) {
    searchResults.value = await search(searchValue.value, {
      type: "track",
      limit: 5,
    });
  }
};

const handleLostFocus = () => {
  isSearching.value = false;
  if (!searchValue.value || searchValue.value?.length < 1)
    searchResults.value === null;
};

const addToPlaylist = (uri: string) => {
  addItemsToPlaylist(playlistId, [uri]);
  emit("addedItem");
};
</script>

<style scoped>
.suggestion-result-item {
  @apply flex gap-3 p-3 rounded-[20px] bg-[var(--grey)] items-center hover:scale-105 cursor-pointer;
  transition: all 500ms var(--power2-out);
}

.label {
  @apply text-[12px] text-[var(--grey-dark)];
}

.album-cover {
  @apply w-10 h-10 rounded-[12px] flex-shrink-0;
}

.icon-play {
  @apply text-[20px] leading-[20px] opacity-0 group-hover:opacity-100 hover:scale-110 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-black bg-white;
  transition: all 2s var(--elastic-out);
  border: 1px solid white;
  border-radius: 50vw;
}

.search-input {
  @apply bg-[var(--grey)] rounded-[16px] p-2 pl-8 w-full;
}

.search-input:focus {
  @apply bg-white;
}

.search-icon {
  @apply text-[20px] leading-[20px] absolute top-1/2 -translate-y-1/2 text-[var(--grey-dark)] left-2;
}

.results-container {
  animation: slideIn 500ms var(--power2-out);
}
.suggestions-container {
  @apply grid grid-cols-1 gap-2 w-full;
  animation: slideIn 500ms var(--power2-out);
}
.search-container {
  @apply grid grid-cols-1 gap-2 w-full;
  animation: slideOut 500ms var(--power2-out);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(5%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes slideOut {
  from {
    opacity: 0;
    transform: translateY(-5%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
