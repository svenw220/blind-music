import { store } from 'quasar/wrappers';
import Vuex from 'vuex';

import cyclingSession from './cycling-session';
import { CyclingSessionStateInterface } from './cycling-session/state';
import musicLibrary from './music-library';
import { MusicLibraryStateInterface } from './music-library/state';
import userLibrary from './user-library';
import { UserLibraryStateInterface } from './user-library/state';
import panels from './panels';
import { PanelStateInterface } from './panels/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  cyclingSession: CyclingSessionStateInterface;
  musicLibrary: MusicLibraryStateInterface;
  userLibrary: UserLibraryStateInterface;
  panels: PanelStateInterface;
}

export default store(function ({ Vue }: { Vue: any }) {
  Vue.use(Vuex);

  const Store = new Vuex.Store<StateInterface>({
    modules: {
      cyclingSession,
      musicLibrary,
      userLibrary,
      panels
    },    
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEBUGGING
  });

  return Store;
});
