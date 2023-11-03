import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UserLibraryStateInterface, IStoreUser, OutputRange } from './state';
import { db, IAvatar } from '../db'
import { v4 as uuidv4 } from 'uuid'
import { invoke } from '@tauri-apps/api/tauri'

const actions: ActionTree<UserLibraryStateInterface, StateInterface> = {
  toggleUserLibrary ({ state, commit }) {
    if (state.show) {
      commit('HIDE_USER_LIBRARY')
    } else {
      commit('SHOW_USER_LIBRARY')
    }
  },
  showUserLibrary ({ commit }) {
    commit('SHOW_USER_LIBRARY')
  },
  hideUserLibrary ({ commit }) {
    commit('HIDE_USER_LIBRARY')
  },
  async selectUser ({ state, commit, dispatch }, id) {
    const user = state.users.find(user => user.id === id)
    if (user) {
      await dispatch('saveChangesToSelectedUser')
      await dispatch('setDifficulty', user.difficulty)
      if (user.lastSelectedSession) {
        await dispatch('musicLibrary/selectSession', user.lastSelectedSession, { root: true })
      }
      commit('SELECT_USER', id)
      dispatch('hideUserLibrary')
    }
    
  },
  async saveChangesToSelectedUser ({ getters, dispatch, rootState }) {
    if (getters.getSelectedUser) {
      const userUpdate = { ...getters.getSelectedUser }
      userUpdate.difficultyLevel = userUpdate.difficulty
      userUpdate.lastMusic = rootState.musicLibrary.selectedSession?.id
      await dispatch('updateUser', userUpdate)
    }
  },
  async setDifficulty ({ commit }, difficulty) {
    difficulty = Math.min(10, Math.max(0, difficulty))
    await invoke('set_difficulty', { difficulty })
    commit('SET_DIFFICULTY', { difficulty })
  },
  async setOutputRange ({ commit, dispatch }, outputRangeTuple: [number, number]) {
    // TODO: Implement set_output_range in backend
    const outputRange: OutputRange = { min: outputRangeTuple[0], max: outputRangeTuple[1] }
    commit('SET_OUTPUT_RANGE', { outputRange })
    dispatch('cyclingSession/setOutputRange', outputRange, { root: true })
  },
  async updateUserList ({ commit }) {
    const users = await db.users.toArray()
    const settings = await db.userSettings.toArray()
    const joinedUsers: IStoreUser[] = users.map(u => {
      const userSettings = settings.find(s => s.userId === u.id)
      let avatar = {
        name: 'avatar-0'
      }
      let difficulty = 5
      if (userSettings) {
        avatar = userSettings.avatar
        difficulty = userSettings.difficultyLevel
      }
      return {
        id: u.id,
        name: u.name,
        username: u.username,
        avatar,
        difficulty,
        lastSelectedSession: userSettings?.lastMusic
      }
    })

    commit('UPDATE_USERS', joinedUsers)
  },
  async createUser ({ dispatch }, { name, username, avatar, difficultyLevel }: { name: string, username: string, avatar: IAvatar, difficultyLevel: number }) {
    if (!db.isOpen()) {
      try {
        await db.open()
      } catch (err) {
        console.error(`Open failed: ${err.stack}`)
        return
      }
    }
    const id = uuidv4()
    await db.users.put({ id, name, username, lastModified: new Date(Date.now()) }, id)
    await db.userSettings.add({
      userId: id,
      avatar: avatar,
      difficultyLevel
    })
    await dispatch('updateUserList')
    return id
  },
  async updateUser ({ dispatch }, { id, name, username, avatar, difficultyLevel, lastMusic }: { id: string, name: string, username: string, avatar: IAvatar, difficultyLevel: number, lastMusic: string | undefined }) {
    if (!db.isOpen()) {
      try {
        await db.open()
      } catch (err) {
        console.error(`Open failed: ${err.stack}`)
        return
      }
    }
    await db.users.put({ id, name, username, lastModified: new Date(Date.now()) }, id)
    await db.userSettings.where('userId').equals(id).modify({
      userId: id,
      avatar: avatar,
      difficultyLevel,
      lastMusic,
    })
    await dispatch('updateUserList')
    return id
  },
  async deleteUser ({ dispatch }, id) {
    await db.users.delete(id);
    let count = await db.userSettings.where('userId').equals(id).delete()
    console.log(`Deleted ${count} user settings`)
    count = await db.userStats.where('userId').equals(id).delete()
    console.log(`Deleted ${count} user stats`)
    await dispatch('updateUserList')
  }
};

export default actions;
