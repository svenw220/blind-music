import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { PanelStateInterface } from './state';

const getters: GetterTree<PanelStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default getters;
