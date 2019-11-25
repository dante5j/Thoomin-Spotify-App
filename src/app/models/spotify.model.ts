export interface Album {
  uri: string;
  name: string;
  images: Image[];
}

export interface Artist {
  name: string;
  uri: string;
}

export interface Error {
  message: string;
}

export type ErrorTypes =
  | 'account_error'
  | 'authentication_error'
  | 'initialization_error'
  | 'playback_error';

export interface Image {
  height?: number | null;
  url: string;
  width?: number | null;
}

export interface PlaybackContext {
  metadata: any;
  uri: string | null;
}

export interface PlaybackDisallows {
  pausing: boolean;
  peeking_next: boolean;
  peeking_prev: boolean;
  resuming: boolean;
  seeking: boolean;
  skipping_next: boolean;
  skipping_prev: boolean;
}

export interface PlaybackRestrictions {
  disallow_pausing_reasons: string[];
  disallow_peeking_next_reasons: string[];
  disallow_peeking_prev_reasons: string[];
  disallow_resuming_reasons: string[];
  disallow_seeking_reasons: string[];
  disallow_skipping_next_reasons: string[];
  disallow_skipping_prev_reasons: string[];
}

export interface PlaybackState {
  context: PlaybackContext;
  disallows: PlaybackDisallows;
  duration: number;
  paused: boolean;
  position: number;
  /**
   * 0: NO_REPEAT
   * 1: ONCE_REPEAT
   * 2: FULL_REPEAT
   */
  repeat_mode: 0 | 1 | 2;
  shuffle: boolean;
  restrictions: PlaybackRestrictions;
  track_window: PlaybackTrackWindow;
}

export interface PlaybackTrackWindow {
  current_track: Track;
  previous_tracks: Track[];
  next_tracks: Track[];
}

export interface PlayerInit {
  name: string;
  volume?: number;
  getOAuthToken(cb: (token: string) => void): void;
}

type ErrorListener = (err: Error) => void;
type PlaybackInstanceListener = (inst: WebPlaybackInstance) => void;
type PlaybackStateListener = (s: PlaybackState) => void;

type AddListenerFn = ((
  event: 'ready' | 'not_ready',
  cb: PlaybackInstanceListener
) => void) &
  ((event: 'player_state_changed', cb: PlaybackStateListener) => void) &
  ((event: ErrorTypes, cb: ErrorListener) => void);

export class SpotifyPlayer {
  constructor(options: PlayerInit) {}

  addListener: AddListenerFn;
  on: AddListenerFn;

  connect: () => Promise<boolean>;
  disconnect: () => void;
  getCurrentState: () => Promise<PlaybackState | null>;
  getVolume: () => Promise<number>;
  nextTrack: () => Promise<void>;

  removeListener: (
    event: 'ready' | 'not_ready' | 'player_state_changed' | ErrorTypes,
    cb?: ErrorListener | PlaybackInstanceListener | PlaybackStateListener
  ) => void;

  pause: () => Promise<void>;
  previousTrack: () => Promise<void>;
  resume: () => Promise<void>;
  // tslint:disable-next-line: variable-name
  seek: (pos_ms: number) => Promise<void>;
  setName: (name: string) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
  togglePlay: () => Promise<void>;
}

export interface Track {
  uri: string;
  id: string | null;
  type: 'track' | 'episode' | 'ad';
  media_type: 'audio' | 'video';
  name: string;
  is_playable: boolean;
  album: Album;
  artists: Artist[];
}

export interface WebPlaybackInstance {
  device_id: string;
}
