<template>
  <div class="w-full flex justify-center">
    <div class="input w-full max-w-[320px] relative">
      <i class="ri-search-line search-icon"></i>
      <input
        type="text"
        v-model="searchValue"
        ref="searchbar"
        placeholder="Search Spotify"
        class="search-input"
        @input="handleSearch"
        @focus="handleFocus"
      />
    </div>

    <div v-show="isSearching" class="search-results" ref="container">
      <div v-if="!searchResults" class="empty">Type to search</div>
      <div
        v-if="searchResults"
        class="flex text-[13px] gap-2 items-center mb-3"
      >
        <div>Sort by</div>
        <button
          @click="() => (popularityFilter = !popularityFilter)"
          class="tag"
          :class="`${popularityFilter && 'active'}`"
        >
          Popularity
        </button>
        <button
          @click="() => (genreFilter = !genreFilter)"
          class="tag"
          :class="`${genreFilter && 'active'}`"
        >
          Genre
        </button>
      </div>
      <div
        v-if="searchResults"
        class="grid grid-cosl-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        <NuxtLink
          v-for="result in searchResults?.artists.items"
          :key="result.id"
          class="search-result-item"
        >
          <img :src="result.images[0].url" class="w-16 h-16 rounded-[12px]" />
          <div class="w-2/3">
            <p class="line-clamp-1">{{ result.name }}</p>
            <p class="label">Artist</p>
          </div>
        </NuxtLink>

        <NuxtLink
          v-for="result in searchResults?.albums.items"
          :key="result.id"
          :to="{ path: `/playing/${result.id}`, query: { type: 'album' } }"
          class="search-result-item group"
        >
          <div class="relative">
            <img :src="result.images[0].url" class="w-16 h-16 rounded-[12px]" />

            <div class="icon-play">
              <i class="ri-play-circle-fill"></i>
            </div>
          </div>
          <div class="w-2/3">
            <p class="truncate max-w-full">{{ result.name }}</p>
            <p class="label">
              Album • {{ result.artists.map((a) => a.name).join() }}
            </p>
          </div>
        </NuxtLink>

        <NuxtLink
          v-for="result in sortedTracks"
          :key="result.id"
          class="search-result-item group"
          :to="{ path: `/playing/${result.id}`, query: { type: 'track' } }"
        >
          <div class="relative">
            <img
              :src="result.album.images[0].url"
              class="w-16 h-16 rounded-[12px]"
            />
            <div class="icon-play">
              <i class="ri-play-circle-fill"></i>
            </div>
          </div>

          <div class="w-2/3">
            <p class="line-clamp-1">{{ result.name }}</p>
            <p class="label">Song • {{ result.artists[0].name }}</p>
          </div>
        </NuxtLink>

        <NuxtLink
          v-for="result in searchResults.playlists.items"
          :key="result.id"
          class="search-result-item group"
          :to="{ path: `/playlists/${result.id}` }"
        >
          <img :src="result.images[0].url" class="w-16 h-16 rounded-[12px]" />
          <div class="w-2/3">
            <p class="truncate max-w-full">{{ result.name }}</p>
            <p class="label">Playlist</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchResults } from "~/types/assets";

const router = useRouter();
const { search } = useSpotify();

const container = ref();
const searchbar = ref();

const searchValue = ref<string>();
const isSearching = ref(false);

const popularityFilter = ref(false);
const genreFilter = ref(false);

const searchResults = ref<SearchResults | null>();

const handleFocus = (event: any) => {
  isSearching.value = true;
  window.addEventListener("click", (event) => listener(event));
};

const listener = (event: MouseEvent) => {
  if (container.value) {
    if (
      !container.value.contains(event.target) &&
      !searchbar.value.contains(event.target)
    ) {
      isSearching.value = false;
      if (!searchValue.value || searchValue.value?.length < 1)
        searchResults.value = null;
      window.removeEventListener("click", listener);
    }
  }
};

const handleSearch = async () => {
  if (searchValue.value && searchValue.value.length > 0) {
    searchResults.value = await search(searchValue.value, {
      type: "artist,album,track,playlist",
      limit: popularityFilter.value || genreFilter.value ? 16 : 3,
    });
  }
};

const sortedTracks = computed(() => {
  if (!searchResults.value || !searchResults.value.tracks) return [];

  let tracks = [...searchResults.value.tracks.items];

  if (popularityFilter.value) {
    tracks = tracks.sort((a, b) => b.popularity - a.popularity);
  }

  if (genreFilter.value) {
    tracks = tracks.sort((a, b) => {
      const genreA = a.artists[0]?.genres?.[0] || "";
      const genreB = b.artists[0]?.genres?.[0] || "";
      return genreA.localeCompare(genreB);
    });
  }

  return tracks;
});

watch(
  () => router.currentRoute.value,
  () => {
    isSearching.value = false;
  }
);
</script>

<style scoped>
.search-input {
  @apply bg-[var(--grey)] rounded-[16px] py-2 pl-8 w-full;
}

.search-icon {
  @apply text-[20px] leading-[20px] absolute top-1/2 -translate-y-1/2 text-[var(--grey-dark)] left-2;
}

.search-results {
  @apply p-6 rounded-[32px] absolute top-[100%] left-1/2 -translate-x-1/2 w-full max-w-[840px] min-h-[240px] bg-white;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.07);
  animation: slideDown 500ms var(--power2-out);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.empty {
  @apply rounded-[24px] w-full h-full flex items-center justify-center p-6 text-black/60 text-[13px];
}

.search-result-item {
  @apply flex gap-3 p-3 rounded-[20px] bg-[var(--grey)] items-center hover:scale-105 cursor-pointer;
  transition: all 500ms var(--power2-out);
}

.label {
  @apply text-[12px] text-[var(--grey-dark)];
}

.icon-play {
  @apply text-[20px] leading-[20px] opacity-0 group-hover:opacity-100 hover:scale-110 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-black bg-white;
  transition: all 2s var(--elastic-out);
  border: 1px solid white;
  border-radius: 50vw;
}

.tag {
  @apply px-4 py-2 bg-black/10 rounded-full;
}

.tag.active {
  @apply text-white bg-black;
}

@keyframes slideDown {
  from {
    opacity: 0;
    /* transform: translateY(-5%); */
    top: 95%;
  }
  to {
    opacity: 1;
    /* transform: translateY(0); */
    top: 100%;
  }
}
</style>
