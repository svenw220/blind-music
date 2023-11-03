import { IAvatar } from '../db'

export interface OutputRange {
  min: number;
  max: number;
}

export interface IStoreUser {
  id: string,
  name: string,
  username?: string,
  avatar: IAvatar,
  difficulty: number,
  lastSelectedSession?: string,
}

const users: IStoreUser[] = []


export interface UserLibraryStateInterface {
  show: boolean;
  users: IStoreUser[],
  selectedUser: string,
  outputRange: OutputRange,
  globalDifficulty: number,
}

function state(): UserLibraryStateInterface {
  return {
    outputRange: { min: 0.0, max: 1.0 }, // this could be moved into a separate input processor store
    show: false,
    users,
    selectedUser: '',
    globalDifficulty: 5
  };
}

export default state;
