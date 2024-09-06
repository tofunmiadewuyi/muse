import { union } from "lodash";

import type {
  Playlist,
  RecentlyPlayed,
  SpotifyUser,
  Track,
} from "~/types/assets";

export const useSpotify = () => {
  const getTrack = async (id: string) => {
    const { data, error } = await useFetchExtended(`/v1/tracks/${id}`);
    if (error.value) {
      console.error("Could not get track:", error.value);
    }
    return data.value;
  };

  const getRecentlyPlayed = async (): Promise<{
    items: RecentlyPlayed[];
  } | null> => {
    const { data, error } = await useFetchExtended<{ items: RecentlyPlayed[] }>(
      `/v1/me/player/recently-played`,
      {
        params: {
          limit: 5,
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

  const getPlaylistById = async (id: string) => {
    const { data, error } = await useFetchExtended(`/v1/playlists/${id}`);

    if (error.value) {
      console.error("Could not get this playlist:", { id }, error.value);
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
    seedTracks: Track[] = [],
    seedArtists?: string,
    seedGenres?: string
  ) => {
    const params: Record<string, string | number | undefined> = {
      seed_artists: seedArtists, //ex. 4NHQUGzhtTLFvgF5SZesLK
      seed_genres: seedGenres, //ex. classical, country
      seed_tracks: union(seedTracks.map((track) => track.id)).join(","), //ex. 0c6xIDDpzE81m2q797ordA
      limit: 5,
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

  return {
    getTrack,
    getRecentlyPlayed,
    getUserPlaylists,
    getPlaylistById,
    getTopTracks,
    getRecommendations,
    createPlaylist,
  };
};
