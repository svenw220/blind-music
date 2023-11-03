// import { ipcRenderer } from 'electron';
import { StateInterface } from '../index';
// import { ActionTree, ActionContext } from 'vuex';
import { ActionTree } from 'vuex';
import { SessionState, MusicLibraryStateInterface, TransportState, TransportStateMessage, SessionPlayerState, Session, ApiSessionSong } from './state';
import { invoke } from '@tauri-apps/api/tauri'
import { LocalStorage } from 'quasar';
import { download_song, list_online_sessions, fetch_and_save_session, list_local_sessions, MusicSession } from 'tauri-plugin-jymmin-music-lib-api'
import { pause, stop, set_master_volume } from 'tauri-plugin-jymmin-audio-core-api' 
import { is_authenticated } from 'tauri-plugin-jymmin-auth-api'

function convertOnlineToUISessionObject(s: MusicSession): Session {
  // Typescript is not handling the Image type well, 
  // it complains that { Path: string } has no Url 
  // and that { Url: string } has no Path property.
  // Hence, the funny workaround with casting Image to any first.
  const img = (s.meta_info.image as any)
  const img_path = img ? (img.Path || img.Url) : ''

  return {
    id: s.id,
    title: s.meta_info.title,
    songs: s.songs.map((song: ApiSessionSong) => {
      return {
        id: song.id,
        version_id: song.song_db_entry.id,
        title: song.song_db_entry.title,
        author: song.song_db_entry.composer,
        duration: song.duration
      }
    }),
    image: img_path,
    state: SessionState.NotDownloaded, // download state is currently only held in the vuex store
    downloadProgress: 0,
    genre: s.meta_info.genre,
    description: s.meta_info.description,
    version: s.version_timestamp,
    local: false,
    i18n: s.meta_info.i18n
  }
}

function convertLocalToUISessionObject(s: MusicSession, i: number): Session {
  // Typescript is not handling the Image type well, 
  // it complains that { Path: string } has no Url 
  // and that { Url: string } has no Path property.
  // Hence, the funny workaround with casting Image to any first.
  const img = (s.meta_info.image as any)
  const img_path = img ? (img.Path || img.Url) : `cover-${(i % 7) + 1}.png`
  return {
    id: s.id,
    title: s.meta_info.title,
    songs: s.songs.map((song: ApiSessionSong) => {
      return {
        id: song.id,
        version_id: song.song_db_entry.id,
        title: song.song_db_entry.title,
        author: song.song_db_entry.composer,
        duration: song.duration
      }
    }),
    image: img_path,
    state: SessionState.Idle,
    downloadProgress: 0,
    genre: s.meta_info.genre,
    description: s.meta_info.description,
    version: s.version_timestamp,
    local: true,
    i18n: s.meta_info.i18n
  }
}

const actions: ActionTree<MusicLibraryStateInterface, StateInterface> = {
  async setMasterVolume({ commit }, { scaledGain, gain }: { scaledGain: number, gain: number}) {
    console.log(scaledGain)
    await set_master_volume(scaledGain)
    commit('SET_MASTER_VOLUME', gain)
  },
  async togglePlayPause({ dispatch, state }) {
      if (state.transportState === TransportState.Playing) {
          dispatch('songPause')
      } else {
          dispatch('songPlay')
      }
  },
  async updateTransportState({ commit }, msg: TransportStateMessage) {
    commit('UPDATE_TRANSPORT_STATE', TransportState[msg.TransportStateMessage])
  },
  async songPlay({ commit }) {
    await invoke('play')
    commit('SONG_PLAY')
  },
  async songStop({ commit }) {
    commit('SONG_STOP')
    await stop()
  },
  async songPause({ commit }) {
    await pause()
    commit('SONG_PAUSE')
  },
  async toggleMute({ state, commit }) {
    if (state.muted) {
      await set_master_volume(1.0)
    } else {
      await set_master_volume(0.0)
    }
    commit('TOGGLE_MUTE')
  },
  async showMusicLibrary ({ commit, dispatch }) {
    dispatch('updateSessions')
    const auth_state: boolean = await is_authenticated()
    commit('SET_AUTH_STATE', auth_state)
    commit('SHOW_MUSIC_LIBRARY')
  },
  hideMusicLibrary ({ commit }) {
    commit('HIDE_MUSIC_LIBRARY')
  },
  async updateSessions ({ commit }) {
    console.log('UPDATING SESSION LIST')
    // speed up session list display by first showing the local sessions
    const localSessions: MusicSession[] = await list_local_sessions()
    const convertedLocalSessions: Session[] = localSessions.map((s, i) => convertLocalToUISessionObject(s, i))
    commit('UPDATE_SESSIONS', { localSessions: convertedLocalSessions })

    const onlineSessions: MusicSession[] = await list_online_sessions()
    if (onlineSessions.length > 0) {
      const convertedOnlineSessions: Session[] = onlineSessions.map(s => convertOnlineToUISessionObject(s)) 
      commit('UPDATE_SESSIONS', { localSessions: convertedLocalSessions, onlineSessions: convertedOnlineSessions })
    }
  },
  async downloadSession ({ commit, state, dispatch }, id) {
    console.log('Download Session');
    console.log(id)
    commit('SET_DOWNLOADING', id)

    const session = state.sessions.find(s => s.id === id) 
    
    if (session) {
      const numSongs = session.songs.length
      dispatch('updateDownloadProgress', { id: session.id, progress: 0.05 })
      for (const [index, song] of session.songs.entries()) {
        console.log(song)
        await download_song(song.version_id);
        dispatch('updateDownloadProgress', { id: session.id, progress: (index + 1) / numSongs })
      }
    }
    await fetch_and_save_session(id)
    // await fakeDownload(ctx, id)
    // await ipcRenderer.invoke('download-session', state.sessions.find(s => s.id === id))
    // ctx.commit('SET_SAVING', id)
    // await fakeSave(id)
    commit('SET_IDLE', id)
    dispatch('updateSessions')

  },
  async updateDownloadProgress ({ commit }, { id, progress }: { id: string, progress: number } ) {
    commit('UPDATE_DOWNLOAD_PROGRESS', { id, progress })
  },
  setAuthState({ commit }, isAuthenticated: boolean) {
    commit('SET_AUTH_STATE', isAuthenticated)
  },
  async selectSession ({ commit, state, dispatch }, id: string) {
    console.log(`Dispatch Session ${id}`)
    // hide music library immediately
    commit('HIDE_MUSIC_LIBRARY')
    // const songId = id.length > 2 ? await loadFakeSession(state, id) : await fakeLoadSession(id)
    // for the demo
    if (state.loadingSong) {
      setTimeout(() => {
        dispatch('selectSession', id)
      }, 500)
      return
    }
    const session = state.sessions.find(s => s.id === id)
    
    if (session !== undefined) {
      try {
        await invoke('load_session_with_cycling_session_play_state', { id: session.id })
        commit('SELECT_SESSION', id)
        LocalStorage.set('last-session-loaded', session.id)
        console.log(`last-session-loaded: ${LocalStorage.getItem('last-session-loaded')}`)
      } catch (e) {
        console.log(`Failed to load Session ${session.title}`);
      }
    } else {
      // TODO: Deselect Session
    }
  },
  setCurrentSong ({ commit }, id: string ) {
    commit('SET_CURRENT_SONG', id)
  },
  setLoadingSong ({ commit }, isLoading: boolean ) {
    commit('SET_LOADING_SONG', isLoading)
  },
  updateSessionState({ commit }, sessionPlayerState: SessionPlayerState) {
    commit('UPDATE_SESSION_STATE', sessionPlayerState)
  },
  previewNextSong({ commit }) {
    commit('PREVIEW_NEXT_SONG')
  },
  previewPreviousSong({ commit }) {
    commit('PREVIEW_PREVIOUS_SONG')
  }
};

export default actions;
