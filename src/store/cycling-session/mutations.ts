import { MutationTree } from 'vuex';
import { TigoDataPacket, ConnectionState, CyclingSessionState, CyclingSessionStateInterface, SessionTimeMessage, OutputRange, SessionResults} from './state';

export interface ShowSessionFinishedMessage {
  show: boolean;
  sessionResults: SessionResults | null;
}

const UPDATE_RPM_AND_POWER_RANGES = (state: CyclingSessionStateInterface) => {
  const brakeTorqueRel = state.brakeTorque / 330 // max brake torque in IP algorithm
  // state.maxRPM = (35.0 + ((1.0 - brakeTorqueRel) * 35.0)) * state.outputRange.max
  state.maxRPM = (35.0 + ((1.0 - brakeTorqueRel) * 35.0))
  // state.maxPower = (35.0 + (brakeTorqueRel * 35.0)) * state.outputRange.max
  state.maxPower = (35.0 + (brakeTorqueRel * 35.0))
  // state.minRPM = state.passiveRpm + ((state.maxRPM - state.passiveRpm) * state.outputRange.min)
  state.minRPM = Math.max(state.passiveRpm - 3.0, 0.0) // yes, this is also a magic constant in the IP algorithm
  // state.minPower = state.maxPower * state.outputRange.min
  // minPower is always 0
}

const mutation: MutationTree<CyclingSessionStateInterface> = {
  UPDATE_TIME (state, data: SessionTimeMessage) {
    state.currentTime = data.current_time
    state.totalTime = data.total_time
  },
  UPDATE_CYCLING_DATA (state, data: TigoDataPacket) {
    state.brakeTorque = data.brake_torque
    state.passiveRpm = data.passive_rpm
    UPDATE_RPM_AND_POWER_RANGES(state)
  },
  
  UPDATE_SESSION_STATE (state, newState: CyclingSessionState) {
    console.log(state)
    state.sessionState = newState
  },
  SET_OUTPUT_RANGE (state, outputRange: OutputRange) {
    state.outputRange = outputRange
    UPDATE_RPM_AND_POWER_RANGES(state)
  },
  SET_CURRENT_TIME (state, currentTime: number) {
    state.currentTime = currentTime
  },
  SET_TOTAL_TIME (state, totalTime: number) {
    state.totalTime = totalTime
  },
  SET_CONNECTION_STATE (state, newState: ConnectionState) {
    if (['Searching', 'Connecting', 'Connected'].find(c => c === newState)) {
      state.connection = newState
    }
  },
  SHOW_SESSION_FINISHED (state, msg: ShowSessionFinishedMessage) {
    console.log(msg);
    state.showSessionFinished = msg.show
    state.sessionResults = msg.sessionResults
  }
};

export default mutation;
