import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { UserLibraryStateInterface, IStoreUser } from './state';
// import { db } from ''

const getters: GetterTree<UserLibraryStateInterface, StateInterface> = {
  getSelectedUser (state): IStoreUser | undefined {
    return state.users.find(user => user.id === state.selectedUser)
  },
  // getUsersWithAvatars (state) {
  //   return state.users.map(u => )
  // }
};

export default getters;
