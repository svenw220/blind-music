import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { MusicLibraryStateInterface, SessionState, Session } from './state';

const getters: GetterTree<MusicLibraryStateInterface, StateInterface> = {
  loadingSession (state): Session | undefined {
    return state.sessions.find(s => s.state === SessionState.Loading)
  },
  currentSongIndex (state): number | undefined {
    return state.selectedSession?.songs.findIndex(s => state.currentSong?.id === s.id)
  },
  previewSongIndex (state): number | undefined {
    return state.selectedSession?.songs.findIndex(s => state.previewSong?.id === s.id)
  },
  numSongsInSelectedSession (state): number | undefined {
    return state.selectedSession?.songs.length
  }
};

export default getters;
