export const usePlayer = () => {
  const transferPlayback = async (deviceId: string) => {
    const { data, error } = await useFetchExtended("/v1/me/player", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_ids: [deviceId],
      }),
    });

    if (error.value) {
      console.error("Could not transfer playback.");
    }
  };

  const getPlaybackState = async () => {
    const { data, error } = await useFetchExtended(`/v1/me/player`);

    if (error.value) {
      console.error("Could not get playback state:", error.value);
    }
    return data.value;
  };

  const getQueue = async () => {
    const { data, error } = await useFetchExtended("/v1/me/player/queue");
    if (error.value) {
      console.error("Could not get queue:", error.value);
    }
    return data.value;
  };

  const queueTrack = async (trackUri: string, deviceId?: string) => {
    const endpoint = "/v1/me/player/queue";
    const { data, error } = await useFetchExtended(endpoint, {
      method: "POST",
      params: {
        uri: trackUri,
      },
    });
    if (error.value) {
      console.error("Could not add track to queue", error.value);
    }
    return data.value;
  };

  const startPlayback = async (
    deviceId: string,
    trackUris?: string[],
    contextUri?: string,
    position?: number
  ) => {
    let reqBody = {
      ...(trackUris && { uris: trackUris }),
      ...(contextUri && { context_uri: contextUri }),
      ...(position && { offset: { position } }),
    };

    const res = await useFetchExtended("/v1/me/player/play", {
      method: "PUT",
      params: {
        device_id: deviceId,
      },
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });
  };

  const pausePlayback = async () => {
    const res = await useFetchExtended('("/v1/me/player/pause');

    let code = res.status.value;
    if (Number(code) === 204) return true;

    if (res.error.value) {
      console.error("Could not pause playback");
      return false;
    }
  };

  return {
    getQueue,
    queueTrack,
    startPlayback,
    pausePlayback,
    transferPlayback,
    getPlaybackState,
  };
};
