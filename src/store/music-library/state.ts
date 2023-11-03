import { MetaInfo } from './song'

type TransportStateString = 'Playing' | 'Stopped' | 'Paused';

export interface TransportStateMessage {
  TransportStateMessage: TransportStateString;
}


export enum TransportState {
  Stopped,
  Paused,
  Playing
}

export interface Duration {
  infinite: boolean;
  seconds?: number;
  bars?: number;
}

export interface TimedEvent {
  message: string;
  args: unknown[];
  when: number; // simplified version for now. This represents the Bar at which the event should be triggered
  hasBeenTriggered: boolean;
}

export interface Song {
  id: string;
  version_id: string;
  title: string;
  author: string;
  duration: Duration;
  timedEvents?: TimedEvent[];
}

export interface OrderedMapForApiSessionSongs {
  map: Record<string, ApiSessionSong>;
  order: string[];
}

export interface SongDbEntry {
  id: string;
  title: string;
  composer: string;
}

export interface ApiSessionSong {
  id: string;
  song_db_entry: SongDbEntry;
  duration: Duration;
}

export interface OnlineSession {
  id: string;
  meta_info: MetaInfo;
  songs: OrderedMapForApiSessionSongs;
  version_timestamp: number;
  next_song_index: number;
  repeat: boolean;
  cross_fade: boolean;
}

export interface Translation {
  language: string;
  title?: string;
  genre?: string;
  description?: string;
}
export interface Session {
  id: string;
  title: string;
  songs: Song[];
  image: string;
  state: SessionState;
  downloadProgress?: number;
  genre: string;
  description: string;
  version: number;
  local: boolean;
  i18n?: Record<string, Translation>
}

export enum SessionState {
  NotDownloaded,
  Downloading,
  Saving,
  Idle,
  Loading,
  Active,
  UpdateAvailable,
}

export interface MusicLibraryStateInterface {
  show: boolean;
  sessions: Session[];
  selectedSession?: Session;
  currentSong?: Song;
  previewSong?: Song;
  busy: boolean;
  loadingSong: boolean;
  nextSongLoading: boolean;
  transportState: TransportState;
  masterVolume: number;
  isAuthenticated: boolean;
  muted: boolean;
}

export interface SessionPlayerState {
  has_error: boolean;
  song_id?: string;
  loading_song: boolean;
}

function state(): MusicLibraryStateInterface {
  return {
    transportState: TransportState.Stopped,
    masterVolume: 1.0,
    loadingSong: false,
    nextSongLoading: false,
    show: false,
    busy: false,
    selectedSession: undefined,
    currentSong: undefined,
    previewSong: undefined,
    sessions: [],
    isAuthenticated: false,
    muted: false
  };
}

export default state;
