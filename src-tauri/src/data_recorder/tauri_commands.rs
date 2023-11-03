use super::SessionResults;
use super::DATA_RECORDER;

#[tauri::command]
pub fn last_session_results() -> Option<SessionResults> {
  if let Some(results) = DATA_RECORDER.lock().unwrap().last_session_results() {
    Some(results.clone())
  } else {
    None
  }
}
