import type { SpotifyPlayer } from "~/types/assets";

declare global {
  interface Window {
    Spotify: {
      Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}
interface SpotifyPlayerOptions {
  name: string;
  getOAuthToken: (callback: (token: string) => void) => void;
  volume?: number;
}

function useSpotifyPlayer() {
  const playerInstance = ref<SpotifyPlayer>();

  const token = useCookie("accessToken");
  const deviceId = useCookie("deviceId");

  const deviceReady = ref(false);

  const currentState = ref();

  const { transferPlayback } = usePlayer();

  const initializePlayer = () => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new (window as any).Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb: any) => {
          cb(token.value);
        },
        volume: 0.5,
      });

      player.addListener("ready", async ({ device_id }: { device_id: any }) => {
        if (!deviceId.value || deviceId.value !== device_id) {
          deviceId.value = device_id;
          await transferPlayback(device_id);
        }
        deviceReady.value = true;
        console.log("Ready with Device ID", device_id);
      });

      player.addListener("not_ready", ({ device_id }: { device_id: any }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("initialization_error", ({ message }: any) => {
        console.error(message);
      });

      player.addListener("authentication_error", ({ message }: any) => {
        console.error(message);
      });

      player.addListener("account_error", ({ message }: any) => {
        console.error(message);
      });

      player.addListener(
        "player_state_changed",
        (state: {
          position: number;
          duration: number;
          track_window: { current_track: any };
        }) => {
          if (!state) {
            return;
          }
          currentState.value = state;
        }
      );

      player.connect();
      playerInstance.value = player;
    };
  };

  return {
    initializePlayer,
    playerInstance,
    deviceReady,
    currentState,
  };
}

export default useSpotifyPlayer;
