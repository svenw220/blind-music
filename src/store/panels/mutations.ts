import { MutationTree } from 'vuex';
import { PanelStateInterface } from './state';

const mutation: MutationTree<PanelStateInterface> = {
  SHOW_HELP (state: PanelStateInterface, showHelp: boolean) {
    state.showHelp = showHelp
  },
  SHOW_CONNECTION_TROUBLE_SHOOTING (state: PanelStateInterface, show: boolean) {
    state.showConnectionTroubleShooting = show
  },
  SHOW_SLIDER_HELP (state: PanelStateInterface, showSliderHelp: boolean) {
    state.showSliderHelp = showSliderHelp
  }
};

export default mutation;
