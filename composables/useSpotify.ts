import type {
  Playlist,
  RecentlyPlayed,
  SpotifyUser,
  Track,
  SearchQuery,
  SearchResults,
} from "~/types/assets";

export const useSpotify = () => {
  const getTrack = async (id: string) => {
    const { data, error } = await useFetchExtended(`/v1/tracks/${id}`);
    if (error.value) {
      console.error("Could not get track:", error.value);
    }
    return data.value;
  };

  const getTracks = async (ids: string) => {
    const { data, error } = await useFetchExtended(`/v1/tracks/`, {
      params: {
        ids: ids,
      },
    });
    if (error.value) {
      console.error("Could not get track:", error.value);
    }
    return data.value;
  };

  const getAlbum = async (id: string) => {
    const { data, error } = await useFetchExtended(`/v1/albums/${id}`);
    if (error.value) {
      console.error("Could not get album:", error.value);
    }
    return data.value;
  };

  const getPlaylist = async (id: string) => {
    const { data, error, refresh } = await useFetchExtended<Playlist>(
      `/v1/playlists/${id}`
    );
    if (error.value) {
      console.error("Could not get playlist:", error.value);
    }
    return [data.value, refresh];
  };

  const getRecentlyPlayed = async (
    limit: number
  ): Promise<{
    items: RecentlyPlayed[];
  } | null> => {
    const { data, error } = await useFetchExtended<{ items: RecentlyPlayed[] }>(
      `/v1/me/player/recently-played`,
      {
        params: {
          limit: limit,
        },
      }
    );

    if (error.value) {
      console.error("Could not get history:", error.value);
    }
    return data.value;
  };

  const getUserPlaylists = async () => {
    const userId = useCookie<SpotifyUser>("user").value.id;
    const { data, error } = await useFetchExtended(
      `/v1/users/${userId}/playlists`
    );

    if (error.value) {
      console.error("Could not get playlists:", error.value);
    }
    return data.value;
  };

  const getTopTracks = async (): Promise<{ items: Track[] }> => {
    const { data, error } = await useFetchExtended<{ items: Track[] }>(
      `/v1/me/top/tracks`,
      {
        params: {
          time_range: "long_term",
          limit: 5,
        },
      }
    );

    if (error.value) {
      console.error("Could not get top tracks:", error.value);
    }
    return data.value ?? { items: [] };
  };

  const getRecommendations = async (
    limit: number,
    seedTracks: Track[] = [],
    seedArtists?: string,
    seedGenres?: string
  ) => {
    const params: Record<string, string | number | undefined> = {
      seed_artists: seedArtists, //ex. 4NHQUGzhtTLFvgF5SZesLK
      seed_genres: seedGenres, //ex. classical, country
      seed_tracks: lodashUnion(seedTracks.map((track) => track.id)).join(","), //ex. 0c6xIDDpzE81m2q797ordA
      limit: limit,
    };

    const { data, error } = await useFetchExtended(`/v1/recommendations/`, {
      params,
    });

    if (error.value)
      console.error("Could not get recommendations:", error.value);

    return data.value;
  };

  const createPlaylist = async (
    playlistName: string,
    playlistDesc: string,

    isPublic: boolean = false
  ) => {
    const user = useCookie<SpotifyUser>("user").value;

    const { data, error } = await useFetchExtended<Playlist>(
      `/v1/users/${user.id}/playlists`,
      {
        method: "POST",
        body: {
          name: playlistName,
          description: playlistDesc,
          public: isPublic,
        },
      }
    );

    if (error.value) {
      console.error("Could not create playlist:", playlistName, error.value);
    }

    return data.value;
  };

  const addItemsToPlaylist = async (
    playlistId: string,
    tracksUri: string[]
  ) => {
    const { data, error } = await useFetchExtended(
      `/v1/playlists/${playlistId}/tracks`,
      {
        method: "POST",

        params: {
          uris: tracksUri.join(","),
        },
      }
    );
  };

  const search = async (searchString: string, query: SearchQuery) => {
    const { data, error } = await useFetchExtended<SearchResults>(
      "/v1/search",
      {
        query: {
          q: searchString,
          type: query?.type,
          limit: query?.limit,
        },
      }
    );
    if (error.value) {
      console.error("Could not complete search:", error.value);
    }

    return data.value;
  };

  return {
    getTrack,
    getTracks,
    getAlbum,
    getPlaylist,
    getRecentlyPlayed,
    getUserPlaylists,
    getTopTracks,
    getRecommendations,
    createPlaylist,
    search,
    addItemsToPlaylist,
  };
};
