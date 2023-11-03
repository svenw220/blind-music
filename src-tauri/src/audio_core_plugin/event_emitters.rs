use crate::json_messages::{FrontendStateUpdateMessage, StateUpdate};

pub fn emit_transport_state_update(window: &tauri::Window, data: StateUpdate) {
  window
    .emit(
      "state-update",
      FrontendStateUpdateMessage {
        store: String::from("musicLibrary"),
        action: String::from("updateTransportState"),
        data,
      },
    )
    .unwrap();
}

pub fn emit_cycling_session_update(window: &tauri::Window, action: &str, data: StateUpdate) {
  window
    .emit(
      "state-update",
      FrontendStateUpdateMessage {
        store: String::from("cyclingSession"),
        action: String::from(action),
        data,
      },
    )
    .unwrap();
}
