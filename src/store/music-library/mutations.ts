import { MutationTree } from 'vuex';
import { MusicLibraryStateInterface, Session, SessionPlayerState, SessionState } from './state';
import { TransportState } from './state'

const mutation: MutationTree<MusicLibraryStateInterface> = {
  SET_AUTH_STATE(state, auth_state: boolean) {
    state.isAuthenticated = auth_state
  },
  SET_MASTER_VOLUME(state, gain) {
    state.masterVolume = gain
  },
  UPDATE_TRANSPORT_STATE(state, transportState: TransportState) {
    state.transportState = transportState
  },
  SONG_PLAY(state) {
      state.transportState = TransportState.Playing
  },
  SONG_STOP(state) {
      state.transportState = TransportState.Stopped
  },
  SONG_PAUSE(state) {
    state.transportState = TransportState.Paused
  },
  TOGGLE_MUTE(state) {
    state.muted = !state.muted
  },
  SHOW_MUSIC_LIBRARY (state) {
    state.show = true
  },
  HIDE_MUSIC_LIBRARY (state) {
    state.show = false
  },
  UPDATE_SESSIONS (state, {localSessions, onlineSessions}: { localSessions?: Session[], onlineSessions?: Session[] }) {
    if (localSessions === undefined) {
      // localSessions = state.sessions.filter(s => s.state === SessionState.Idle || s.state === SessionState.Loading || s.state === SessionState.Active || s.state === SessionState.UpdateAvailable)
      localSessions = []
    }
    if (onlineSessions === undefined) {
      onlineSessions = []
    }
    const localSessionsMap: Record<string, Session> = {}
    // copy current sessions into local session map, so that we keep sessions alive that are currently downloading
    state.sessions.forEach((s) => {
      if (s.state === SessionState.Downloading) {
        localSessionsMap[s.id] = {...s}
      }
    })

    localSessions.forEach((s) => {
      if (!localSessionsMap[s.id]) {
        // const currentState = state.sessions.find(cs => cs.id === s.id)?.state || s.state
        // const downloadProgress = state.sessions.find(cs => cs.id === s.id)?.downloadProgress || s.downloadProgress
        localSessionsMap[s.id] = { ...s,
          state: state.selectedSession?.id === s.id ? SessionState.Active : SessionState.Idle,
          // downloadProgress
        }
      }
    })
    const filteredOnlineSessions = onlineSessions.filter(s => {
      // are we downloading this session at the moment?
      const known_session = state.sessions.find(ls => ls.id === s.id)
      if (known_session?.state === SessionState.Downloading) {
        console.log('Known Session in Online Sessions -> Downloading')
        localSessionsMap[s.id] = {...known_session}
        return false
      }
      if (Object.keys(localSessionsMap).includes(s.id)) {
        console.log(s.version, localSessionsMap[s.id].version)
        // there is local version of this session available
        if (s.version > localSessionsMap[s.id].version) {
          localSessionsMap[s.id].state = SessionState.UpdateAvailable
          localSessionsMap[s.id].title = s.title
          localSessionsMap[s.id].songs = s.songs
        }
        // and
        // remove session from list
        return false
      } else {
        return true
      }
    })
    localSessions = Object.values(localSessionsMap)
    let newSessions = [...localSessions, ...filteredOnlineSessions]
    newSessions.sort((s1, s2) => s1.title.toUpperCase() > s2.title.toUpperCase() ? 1 : -1)
    // Workaround to keep Playlist images constant
    newSessions = newSessions.map((s, i) => { return { ...s, image: s.image !== undefined ? `cover-${(i % 7) + 1}.png` : ''}})
    state.sessions = newSessions
  },
  UPDATE_SESSION_STATE (state, sessionPlayerState: SessionPlayerState) {
    state.loadingSong = sessionPlayerState.loading_song
    
    if (sessionPlayerState.song_id) {
      console.log(sessionPlayerState.song_id)
      state.currentSong = state.selectedSession?.songs.find(song => song.version_id === sessionPlayerState.song_id)
      state.previewSong = state.currentSong
    }
  },
  SET_DOWNLOADING (state, id: string ) {
    state.sessions = state.sessions.map(s => s.id === id ? {...s, state: SessionState.Downloading, progress: 0.0 } : s)
  },
  SET_SAVING (state, id: string ) {
    state.sessions = state.sessions.map(s => s.id === id ? {...s, state: SessionState.Saving, progress: 0.0 } : s)
  },
  SET_IDLE (state, id: string ) {
    state.sessions = state.sessions.map(s => s.id === id ? {...s, state: SessionState.Idle, progress: 0.0 } : s)
  },
  UPDATE_DOWNLOAD_PROGRESS (state, { id, progress }: { id: string, progress: number }) {
    state.sessions = state.sessions.map(s => s.id === id ? {...s, downloadProgress: progress} : s)
  },
  SELECT_SESSION (state, id: string) {
    state.selectedSession = state.sessions.find(s => s.id === id)
    state.sessions = state.sessions.map(s => {
      if(s.id === id) {
        s.state = SessionState.Active
      } else if (s.state === SessionState.Active) {
        s.state = SessionState.Idle
      }
      return s
    })
    state.currentSong = state.selectedSession?.songs[0]
    state.previewSong = state.selectedSession?.songs[0]
    console.log(state.previewSong)
  },
  SET_LOADING_STATE (state, id?: string) {
    state.sessions = state.sessions.map(s => {
      if (s.id === id) {
        s.state = SessionState.Loading
      }
      return s
    })
  },
  SET_LOADING_SONG (state, isLoading: boolean) {
    state.loadingSong = isLoading
  },
  SET_CURRENT_SONG (state, id?: string) {
    if (state.selectedSession) {
      state.currentSong = state.selectedSession.songs.find(song => song.id === id)
    }
  },
  PREVIEW_NEXT_SONG (state) {
    if (state.selectedSession) {
      const previewIndex = state.selectedSession.songs.findIndex(song => song.id === state.previewSong?.id)
      const nextPreviewIndex = (previewIndex + 1) % state.selectedSession.songs.length
      state.previewSong = state.selectedSession.songs[nextPreviewIndex]
    }
  },
  PREVIEW_PREVIOUS_SONG (state) {
    if (state.selectedSession) {
      const previewIndex = state.selectedSession.songs.findIndex(song => song.id === state.previewSong?.id)
      const previousPreviewIndex = (state.selectedSession.songs.length + (previewIndex - 1)) % state.selectedSession.songs.length
      state.previewSong = state.selectedSession.songs[previousPreviewIndex]
    }
  }
};

export default mutation;
