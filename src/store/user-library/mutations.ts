import { MutationTree } from 'vuex';
import { IStoreUser, UserLibraryStateInterface, OutputRange } from './state';

const mutation: MutationTree<UserLibraryStateInterface> = {
  SHOW_USER_LIBRARY (state) {
    state.show = true
  },
  HIDE_USER_LIBRARY (state) {
    state.show = false
  },
  UPDATE_USERS (state, users: IStoreUser[]  ) {
    state.users = users
  },
  SELECT_USER (state, id ) {
    state.selectedUser = id
  },
  SET_DIFFICULTY (state, { difficulty }: { difficulty: number }) {
    state.users = state.users.map(u => {
      if(u.id === state.selectedUser) {
        return { ...u, difficulty }
      } else {
        return u
      }
    })
    if (!state.selectedUser) {
      state.globalDifficulty = difficulty
    }
  },
  SET_OUTPUT_RANGE (state, { outputRange }: { outputRange: OutputRange }) {
    state.outputRange = outputRange
  }
};

export default mutation;
