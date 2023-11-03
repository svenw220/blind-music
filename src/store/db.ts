import Dexie from 'dexie'

class UserDatabase extends Dexie {
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    users: Dexie.Table<IUser, string>; // string = type of the primkey
    userSettings: Dexie.Table<IUserSettings, number>; // number = type of the primkey
    userStats: Dexie.Table<IUserStats, number>; // number = type of the primkey
    //...other tables goes here...

    constructor () {
        super('UserDatabase');
        this.version(1).stores({
            users: 'id, name, username',
            userSettings: '++id, userId, lastSelected, lastMusic',
            userStats: '++id, userId, distanceTraveled, avgActivity, avgSymmetry, avgRPM, activeTime'

            //...other tables goes here...
        });
        // The following line is needed if your typescript
        // is compiled using babel instead of tsc:
        this.users = this.table('users');
        this.userSettings = this.table('userSettings');
        this.userStats = this.table('userStats');
    }
}

export interface IUser {
    id: string,
    name: string,
    username: string,
    lastModified: Date
}

export interface IAvatar {
    name: string;
}

export interface IUserSettings {
    id?: number, // gets created by the db automatically
    userId: string,
    avatar: IAvatar,
    difficultyLevel: number,
    lastSelected?: Date,
    lastMusic?: string,
}

export interface IUserStats {
    id?: number,
    userId: string,
    distanceTraveled: number,
    avgActivity: number,
    avgSymmetry: number,
    avgRPM: number,
    activeTime: number,
}

export const db: UserDatabase = new UserDatabase();
