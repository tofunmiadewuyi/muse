export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface SpotifyUser {
  display_name: string;
  email: string;
  id: string;
  followers: {
    href: string;
    total: number;
  };
  href: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  uri: string;
}

export interface SpotifyPlayer {
  addListener: (eventName: string, callback: (data: any) => void) => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  getCurrentState: () => Promise<any>;
  getVolume: () => Promise<number>;
  nextTrack: () => Promise<void>;
  pause: () => Promise<void>;
  previousTrack: () => Promise<void>;
  resume: () => Promise<void>;
  seek: (position_ms: number) => Promise<void>;
  setName: (name: string) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  togglePlay: () => Promise<void>;
}

export interface Artist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  popularity: number;
  images: [
    {
      height: number;
      width: number;
      url: string;
    }
  ];
}

export interface Album {
  album_type: string;
  artists: Artist[];
  href: string;
  id: string;
  images: [
    {
      height: number;
      width: number;
      url: string;
    }
  ];
  name: string;
  uri: string;
  type: album;
}

export interface Track {
  album: Album;
  artists: Artist[];
  duration_ms: number;
  id: string;
  name: string;
  explicit: boolean;
  href: string;
  popularity: number;
  uri: string;
  type: "track";
}

export interface Image {
  height: number;
  width: number;
  url: string;
}

export interface Device {
  id: string;
  is_active: boolean;
  name: string;
  volume_percent: number;
}

export interface RecentlyPlayed {
  track: Track;
}

export interface Playlist {
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    diplay_name: string;
    href: string;
    id: string;
  };
  primary_color: string;
  public: boolean;
  tracks: { href: string; total: number };
  uri: string;
  type: "playlist";
}

type StateTrack = Pick<
  Track,
  "album" | "artists" | "duration_ms" | "id" | "name" | "uri"
>;
export interface PlayerState {
  context: {
    uri: string;
  };
  duration: number;
  position: number;
  loading: boolean;
  paused: boolean;
  track_window: {
    current_track: StateTrack;
    next_tracks: StateTrack[];
    previous_tracks: StateTrack[];
  };
}

interface PlaybackState {
  context: {
    uri: string;
    href: string;
  };
  device: Device;
  progress_ms: number;
  repeat_state: "context" | "off" | "track";
  shuffle_state: boolean;
  smart_shuffle: boolean;
  timestamp: number;
  is_playing: boolean;
  item: {
    album: Album;
    artists: Artist[];
    id: string;
    name: string;
    uri: string;
  };
}

interface CurrentTrack {
  uri: string;
  id: string;
  album: { uri: string; name: string; images: [{ url: string }] };
  artists: [{ uri: string; name: string }];
  name: string;
  is_playable: boolean;
}

interface CurrentTrack {
  device: Device;
  repeat_state: "context" | "off" | "track";
  shuffle_state: boolean;
  timestamp: number;
  is_playing: boolean;
  progress_ms;
  number;
  actions: {
    interrupting_playback: boolean;
    pausing: boolen;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
    toggling_repeat_context: boolean;
    toggling_shuffle: boolean;
    toggling_repeat_track: boolean;
    transferring_playback: booolean;
  };
}

export interface TrackList {
  tracks: Track[];
  type: "tracklist";
  uri: string[];
}

const types = [
  "album",
  "artist",
  "playlist",
  "track",
  "episode",
  "audiobook",
  "show",
];

export interface SearchQuery {
  type: (typeof types)[number];
  limit?: number = 5;
}

export interface SearchResults {
  albums: {
    next: string;
    previous: string;
    total: string;
    items: Album[];
  };
  artists: {
    next: string;
    previous: string;
    total: string;
    items: Artist[];
  };
  tracks: {
    next: string;
    previous: string;
    total: string;
    items: Track[];
  };
  playlists: {
    items: Playlist[];
    next: string;
    previous: string;
    total: string;
  };
}

interface Queue {
  currently_playing: {
    album: Album;
  };
  queue: Album[];
}
