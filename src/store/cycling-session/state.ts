export type ConnectionState = 'Searching' | 'Connecting' | 'Connected'
export type CyclingSessionState = 'Stopped' | 'Playing' | 'Paused'

export interface CyclingSessionStateInterface {
  currentTime: number;
  totalTime: number;
  connection: ConnectionState;
  sessionState: CyclingSessionState;
  sessionResults: SessionResults | null;
  showSessionFinished: boolean;
  maxRPM: number;
  maxPower: number;
  minRPM: number;
  minPower: number;
  brakeTorque: number;
  passiveRpm: number;
  outputRange: OutputRange;
}

export interface CyclingSession {
  CyclingSession: CyclingSessionState;
}

export interface DeviceConnection {
  DeviceConnection: ConnectionState;
}

export interface SessionTimeMessage {
  current_time: number;
  total_time: number;
}

export interface SessionTime {
  SessionTime: SessionTimeMessage;
}

export interface TigoDataPacket {
    rpm: number;
    brake_torque: number;
    power: number;
    timestamp: number;
    passive_rpm: number;
}

export interface CyclingData {
  TigoData: TigoDataPacket
}

export interface OutputRange {
  min: number;
  max: number;
}

export interface SessionResults {
  version: number; // useful for migrations, if we safe the whole package
  meanRpm: number;
  meanPower: number;
  meanActivity: number;
  meanMappedActivity: number;
  peakRpm: number;
  peakPower: number;
  peakActivity: number;
  peakMappedActivity: number;
  peakBrakeTorque: number;
  outputRange: number[];
  sessionData: TigoDataPacket[];
  outputData: number[];
  duration: number;
}


function state(): CyclingSessionStateInterface {
  const defaultSessionData: TigoDataPacket[] = [];

  // for (let i = 0; i <= (15 * 60); i++) {
  //   defaultSessionData.push({
  //     rpm: Math.sin(i / 1000) * 35 + 35,
  //     brake_torque: 0,
  //     power: Math.sin(i / 100) * 50 + 35,
  //     timestamp: i + 3676,
  //     passive_rpm: 10
  //   });
  // }
  return {
    currentTime: 0,
    totalTime: 900,
    connection: 'Searching',
    sessionState: 'Stopped',
    sessionResults: {
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
    },
    showSessionFinished: false,
    maxRPM: 70.0,
    maxPower: 35.0,
    minRPM: 7.0,
    minPower: 0.0,
    brakeTorque: 0.0,
    passiveRpm: 10.0,
    outputRange: { min: 0.0, max: 1.0 }
  }
};

export default state;
