<template>
  <div class="page flex justify-center items-center relative">
    <Playing
      v-if="currentState"
      :deviceReady="deviceReady"
      :playerInstance="playerInstance!"
      :state="currentState"
    />

    <ShimmersPlaying v-else :deviceReady="false" />

    <button
      @click="() => handleCopy()"
      class="btn sec absolute top-28 right-10"
    >
      <p v-if="!copying" class="copy-default">Share</p>
      <p v-else class="copy-active">Link Copied!</p>
    </button>

    <div class="absolute bottom-10 right-10">
      <PlayingAlbum v-if="currentState" :state="currentState" />
    </div>

    <div class="absolute bottom-10 left-10">
      <PlayingQueue v-if="currentState" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Album, Track, Playlist, Queue, TrackList } from "~/types/assets";
const route = useRoute();
const id = route.params.id;
const query = route.query as unknown as {
  type: string;
  position?: number;
  ids?: string[];
};
const deviceId = useCookie("deviceId");

const { playerInstance, deviceReady, currentState, initializePlayer } =
  useSpotifyPlayer();

const { getTrack, getTracks, getAlbum, getPlaylist } = useSpotify();

const { startPlayback } = usePlayer();

let content = ref<Track | Album | Playlist | TrackList>();

interface TracksRes {
  tracks: Track[];
}

const isReady = ref(false);

async function loadContent() {
  try {
    switch (query.type) {
      case "track":
        content.value = (await getTrack(id as string)) as Track;
        break;
      case "album":
        content.value = (await getAlbum(id as string)) as Album;
        break;
      case "playlist":
        const [playlistData] = await getPlaylist(id as string);
        content.value = playlistData as Playlist;
        break;
      case "recommended":
      case "recents":
        const data = (await getTracks(
          query.ids?.join(",") as string
        )) as TracksRes;
        content.value = {
          ...data,
          type: "tracklist",
          uri: data.tracks.map((t) => t.uri),
        };
        break;
      default:
        useToast("You didn't select anything to play");
    }
  } catch (e) {
    console.error("Error in setup:", e);
  }
}

async function initializePlayback() {
  if (!content.value) return;
  try {
    switch (content.value.type) {
      case "track":
        await startPlayback(deviceId.value as string, [
          content.value.uri as Track["uri"],
        ]);
        break;
      case "album":
      case "playlist":
        startPlayback(
          deviceId.value as string,
          undefined,
          content.value.uri as Album["uri"] | Playlist["uri"],
          query.position
        );
        break;
      case "tracklist":
        await startPlayback(
          deviceId.value as string,
          content.value.uri as TrackList["uri"]
        );
        break;
      default:
        useToast("");
    }
    isReady.value = true;
  } catch (e) {
    console.error("Error initializing playback:", e);
    useToast("Failed to start playback");
    isReady.value = false;
  }
}

const copying = ref(false);
const handleCopy = () => {
  copying.value = true;
  copyCode(`https://open.spotify.com/track/${id}`);
  setTimeout(() => {
    copying.value = false;
  }, 2000);
};

onMounted(async () => {
  initializePlayer();
  await loadContent();
});

watch(
  [playerInstance, deviceReady, content],
  async ([player, ready, currentContent]) => {
    if (player && ready && currentContent) {
      await initializePlayback();
    }
  }
);

onUnmounted(() => {
  playerInstance.value?.disconnect();
});

definePageMeta({
  layout: "navigation",
});
</script>

<style scoped></style>
