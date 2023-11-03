use crate::json_messages::{ConnectionState, CyclingSessionState};

use getset::{CopyGetters, Setters};
use once_cell::sync::Lazy;
use serde::Serialize;
use std::sync::Mutex;
use uuid::Uuid;

pub static SESSION_STATE: Lazy<Mutex<SessionState>> = Lazy::new(|| Mutex::new(SessionState::new()));

#[tauri::command]
pub fn cycling_session_state() -> SessionState {
  SESSION_STATE.lock().unwrap().clone()
}

#[derive(Clone, Debug, CopyGetters, Setters, Serialize)]
#[getset(get_copy = "pub", set = "pub")]
pub struct SessionState {
  connection_state: ConnectionState,
  cycling_session_state: CyclingSessionState,
  current_music_session: Option<Uuid>,
  // This is the index of the song, that the user has selected in the frontend at the moment.
  selected_song_index: usize,
}

impl SessionState {
  pub fn new() -> Self {
    Self {
      connection_state: ConnectionState::Searching,
      cycling_session_state: CyclingSessionState::Stopped,
      current_music_session: None,
      selected_song_index: 0,
    }
  }
}
