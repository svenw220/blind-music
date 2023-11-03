import { ConnectionState, SessionResults, TigoDataPacket } from 'src/store/cycling-session/state'
import { ApiSessionSong, OnlineSession, OrderedMapForApiSessionSongs } from 'src/store/music-library/state'

function generateSong(id: string, title: string): ApiSessionSong {
    return {
        id: id,
        song_db_entry: {
            id: `${id}-version-id`,
            title: title,
            composer: 'Elvis Testley'
        },
        duration: {
            bars: 64,
            infinite: false
        }
    }
}

function generateOrderedMapForSongs () : OrderedMapForApiSessionSongs {
    const titles: string[] = ['Mock around the clock', 'Fun with flags', 'Bärenreiter', 'Ey Caramba', 'A long way down']
    const songMap: Record<string, ApiSessionSong> = {}
    const order = [1,2,3,4,5].map((v) => `song-${v}`);
    order.forEach((v, i) => {
        songMap[v] = generateSong(v, titles[i])
    })
    return {
        order,
        map: songMap
    }
}

const api = {
    play() { console.log('play mock called') },
    pause() { console.log('pause mock called') },
    stop() { console.log('stop mock called') },
    list_local_sessions(): OnlineSession[] {
        return [
            {
                id: '12345',
                meta_info: {
                    id: '123456', 
                    title: 'My Mock Session', 
                    genre: 'Brass Band',
                    description: 'Mock Music',
                    arranger: 'Mr. Mock', 
                    owner: 'user@1234', 
                    tempo: {
                        bpm: 120.0,
                        beats_per_bar: 4,
                        divisor: 4
                    },
                    i18n: {
                        'de': {
                            language: 'de',
                            title: 'meine online mock session',
                            genre: 'Markenbass',
                            description: 'Mock Musik aus dem Weltraum'
                        }
                    }
                },
                songs: generateOrderedMapForSongs(), 
                version_timestamp: 123456, 
                next_song_index: 0, 
                repeat: true, 
                cross_fade: false
            }
        ]
    },
    set_master_volume({volume}: {volume: number}) { console.log(`Set Master Volume to: ${volume}`)},
    load_session({id}: {id: string}) { 
        console.log(`Called load_session mock with session id: ${id}`) 
    },
    play_next_song() {
        console.log('Called play_next_song mock');
        console.log('we might need to emit backend events here to mimic the song load done message');
    },
    play_nth_song({index}: {index: number}) { 
        console.log(`Called play_nth_song mock with index: ${index}`) 
    },
    set_next_song_index({index}: {index: number}) {
        console.log(`Called set_next_song_index mock with index: ${index}`) 
    },
    set_difficulty({difficulty}: {difficulty: number}) {
        // we need to emit the new output range as a backend state update event here
        console.log(`Called set_difficulty mock with difficulty: ${difficulty}`) 
    },
    download_song({id}: {id: string}) {
        console.log(`Called download_song mock with song id: ${id}`) 
    },
    list_online_sessions(): OnlineSession[] {
        return [
            {
                id: '23456',
                meta_info: {
                    id: '234567', 
                    title: 'My Online Mock Session', 
                    genre: 'Brand Bass',
                    description: 'Mock Music From Outer Space',
                    arranger: 'Mr. Spock', 
                    owner: 'user@1234', 
                    tempo: {
                        bpm: 120.0,
                        beats_per_bar: 4,
                        divisor: 4
                    },
                    i18n: {
                        'de': {
                            language: 'de',
                            title: 'meine online mock session',
                            genre: 'Markenbass',
                            description: 'Mock Musik aus dem Weltraum'
                        }
                    }
                },
                songs: generateOrderedMapForSongs(), 
                version_timestamp: 234567, 
                next_song_index: 0, 
                repeat: true, 
                cross_fade: false
            }
        ]
    },
    fetch_and_save_session({id}: {id: string}) {
        console.log(`Called load_session mock with session id: ${id}`) 
    },
    is_online(): boolean {
        return true
    },
    set_control_value({ value }: { value: number }) {
        console.log(`Called set_control_value mock with value: ${value}`) 
    },
    open_link_in_external_browser({ link }: {link: string}) {
        console.log(`Called open_link_in_external_browser mock with link: ${link}`)
    },
    last_session_results(): SessionResults | null {
        const defaultSessionData: TigoDataPacket[] = [];

        for (let i = 0; i <= (15 * 60); i++) {
            defaultSessionData.push({
            rpm: Math.sin(i / 50) * 35 + 35,
            brake_torque: 0,
            power: Math.sin(i / 100) * 20 + 25,
            timestamp: i + 3676,
            passive_rpm: 10
            });
        }

        return {
            version: 1, // useful for migrations, if we safe the whole package
            meanRpm: 40,
            meanPower: 20,
            meanActivity: 0.5,
            meanMappedActivity: 0.4,
            peakRpm: 70,
            peakPower: 30,
            peakActivity: 0.95,
            peakMappedActivity: 1.0,
            peakBrakeTorque: 0,
            outputRange: [0.0, 1.0],
            sessionData: defaultSessionData,
            outputData: [],
            duration: 899.9,
        }
    },
    cycling_session_state(): {connection_state: ConnectionState} {
        return {
            connection_state: 'Connected'
        }
    },
    is_authenticated(): boolean {
        return true
    },
    initiate_login() {
        console.log('Called initiate_login mock') 
    }
}

export default api