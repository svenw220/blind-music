import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { PanelStateInterface } from './state';

const actions: ActionTree<PanelStateInterface, StateInterface> = {
  showHelp ({ commit }, showHelp: boolean) {
    commit('SHOW_HELP', showHelp)
  },
  showConnectionTroubleShooting ({ commit }, show: boolean) {
    commit('SHOW_CONNECTION_TROUBLE_SHOOTING', show)
  },
  showSliderHelp ({ commit }, showSliderHelp: boolean) {
    commit('SHOW_SLIDER_HELP', showSliderHelp)
  }
};

export default actions;
