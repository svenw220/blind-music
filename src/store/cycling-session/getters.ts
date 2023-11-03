import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { CyclingSessionStateInterface } from './state';

const getters: GetterTree<CyclingSessionStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default getters;
