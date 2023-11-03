use input_mapper::signal::SignalSet;
use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize)]
pub struct ProcessedSignalsEvent {
  pub signals: SignalSet,
}

#[derive(Clone, Serialize, Deserialize)]
pub enum MessageType {
  TigoData,
  CyclingSessionState,
  DeviceConnectionState,
  SessionTime,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct GenericJsonMessage {
  pub msg_type: MessageType,
}

#[derive(Debug, Copy, Clone, Serialize, Deserialize)]
pub enum CyclingSessionState {
  Playing,
  Stopped,
  Paused,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct CyclingSession {
  pub msg_type: MessageType,
  pub session_state: CyclingSessionState,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub enum ConnectionState {
  Searching,
  Connecting,
  Connected,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct DeviceConnection {
  pub msg_type: MessageType,
  pub connection_state: ConnectionState,
}

#[derive(Clone, Serialize, Deserialize)]
pub struct SessionTimeMessage {
  pub msg_type: MessageType,
  pub current_time: f32,
  pub total_time: f32,
}

#[derive(Clone, Serialize, Deserialize)]
pub enum TransportState {
  Stopped,
  Playing,
  Paused,
}

#[derive(Clone, Serialize, Deserialize)]
pub enum StateUpdate {
  DeviceConnection(ConnectionState),
  CyclingSession(CyclingSessionState),
  TigoData(input_processor::tigo::TigoDataPacket),
  SessionTime(SessionTimeMessage),
  TransportStateMessage(TransportState),
}

#[derive(Clone, Serialize, Deserialize)]
pub struct FrontendStateUpdateMessage {
  pub store: String,
  pub action: String,
  pub data: StateUpdate,
}
