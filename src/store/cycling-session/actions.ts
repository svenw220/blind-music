import { invoke } from '@tauri-apps/api/tauri';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { CyclingData, ConnectionState, DeviceConnection, CyclingSessionState, CyclingSessionStateInterface, CyclingSession, SessionTime, OutputRange, SessionResults } from './state';

const actions: ActionTree<CyclingSessionStateInterface, StateInterface> = {
  updateTime ({ commit }, data: SessionTime) {
    commit('UPDATE_TIME', data.SessionTime)
  },
  updateCyclingData ({ commit }, data: CyclingData) {
    // console.log(data)
    commit('UPDATE_CYCLING_DATA', data.TigoData)
  },
  updateSessionState ({ commit, state, dispatch }, newStateMessage: CyclingSession ) {
    const newState: CyclingSessionState = newStateMessage.CyclingSession
    if ((state.sessionState === 'Playing' || state.sessionState === 'Paused') && newState === 'Stopped') {
      dispatch('showSessionFinishedScreen', true)
    } else if (state.showSessionFinished && newState === 'Playing') {
      dispatch('showSessionFinishedScreen', false)
    }

    commit('UPDATE_SESSION_STATE', newState)
  },
  setOutputRange ({ commit }, outputRange: OutputRange) {
    commit('SET_OUTPUT_RANGE', outputRange)
  },
  updateConnectionState ({ commit }, newStateMessage: DeviceConnection) {
    const newState: ConnectionState = newStateMessage.DeviceConnection
    commit('SET_CONNECTION_STATE', newState)
  },
  setConnectionState ({ commit }, newState: ConnectionState) {
    commit('SET_CONNECTION_STATE', newState)
  },
  setCurrentTime ({ commit }, currentTime: number) {
    commit('SET_CURRENT_TIME', currentTime)
  },
  setTotalTime ({ commit }, totalTime: number) {
    commit('SET_TOTAL_TIME', totalTime)
  },
  async showSessionFinishedScreen ({ commit }, show: boolean) {
    if (show) {
      // calculate the results of the current session in the backend...
      const sessionResults: SessionResults | null = await invoke('last_session_results')
      commit('SHOW_SESSION_FINISHED', { show, sessionResults })
    } else {
      // TODO: Add SessionResults as optional parameter to show session finished
      commit('SHOW_SESSION_FINISHED', { show, sessionResults: null })
    }
  }

};

export default actions;
