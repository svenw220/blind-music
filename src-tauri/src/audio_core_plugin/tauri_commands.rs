use std::str::FromStr;
use tracing::{debug, info};

use crate::json_messages::CyclingSessionState;
use crate::session_state::SESSION_STATE;
use crossbeam_channel as channel;

use std::sync::Mutex;
pub use tauri_plugin_jymmin_audio_core::{
  load_session, pause, play, set_master_volume,
  state::{AudioCoreState, DjSender, SessionPlayer},
  stop,
  traits::Messaging,
};

use crate::thera_client::TigoEvent;

#[tauri::command]
pub fn set_difficulty(difficulty: usize, ip_sender: tauri::State<channel::Sender<TigoEvent>>) {
  debug!(%difficulty, "Set");
  if let Err(err) = ip_sender.send(TigoEvent::SetDifficulty(difficulty)) {
    tracing::error!("IP Send Error: {:?}", err);
  }
}

#[tauri::command]
pub async fn load_session_with_cycling_session_play_state(
  id: String,
  state: tauri::State<'_, Mutex<AudioCoreState>>,
  dj: tauri::State<'_, DjSender>,
  session_player: tauri::State<'_, SessionPlayer>,
) -> Result<(), String> {
  info!("loaded session begin");

  set_master_volume(0.0, dj.clone());
  tokio::time::sleep(std::time::Duration::from_millis(200)).await;
  load_session(id.clone(), state, dj.clone(), session_player.clone())?;

  let cycling_session_state = {
    let mut state = SESSION_STATE.lock().unwrap();
    let id = uuid::Uuid::from_str(&id).unwrap();
    state.set_current_music_session(Some(id));
    state.cycling_session_state()
  };
  tokio::time::sleep(std::time::Duration::from_millis(50)).await;

  if let CyclingSessionState::Playing = cycling_session_state {
    play(session_player);
  }
  tokio::time::sleep(std::time::Duration::from_millis(50)).await;
  set_master_volume(1.0, dj);

  info!("loaded session");
  Ok(())
}
