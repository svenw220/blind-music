#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

extern crate fs_extra;
extern crate keytar;
extern crate single_instance;
extern crate tiny_http;

use single_instance::SingleInstance;

use tauri::Manager;
use tokio::time::{sleep, Duration};
mod audio_core_plugin;
mod data_recorder;
mod session_state;
use audio_core_plugin::start_input_processor;
use audio_core_plugin::tauri_commands::{
  load_session_with_cycling_session_play_state, set_difficulty,
};
use session_state::cycling_session_state;
use tracing_appender::non_blocking::WorkerGuard;

mod json_messages;
use data_recorder::tauri_commands::last_session_results;
mod system_utilities;
use system_utilities::open_link_in_external_browser;
mod thera_client;
use thera_client::restart_thera_client;

use tauri_plugin_jymmin_audio_core::state::{DjSender, SessionPlayer};

#[cfg(not(feature = "terminal-tracing"))]
fn initialize_logger() -> WorkerGuard {
  let data_dir = tauri::api::path::local_data_dir();
  let log_dir = data_dir
    .unwrap()
    .as_path()
    .join("com.jymmin.rehab-cycling")
    .join("logs");
  std::fs::create_dir_all(&log_dir).unwrap();

  let file_appender = tracing_appender::rolling::hourly(log_dir, "rehab-cycling.log");
  let (non_blocking, guard) = tracing_appender::non_blocking(file_appender);
  tracing_subscriber::fmt().with_writer(non_blocking).init();
  guard
}

#[cfg(feature = "terminal-tracing")]
fn initialize_terminal_logger() -> WorkerGuard {
  let (non_blocking, guard) = tracing_appender::non_blocking(std::io::stdout());
  tracing_subscriber::fmt().with_writer(non_blocking).init();
  guard
}

fn main() {
  let instance = SingleInstance::new("com.jymmin.rehab-cycling").unwrap();
  if !instance.is_single() {
    return;
  }

  #[cfg(not(feature = "terminal-tracing"))]
  let _appender_guard = initialize_logger(); // keeping the guard alive until program terminates
  #[cfg(feature = "terminal-tracing")]
  let _terminal_guard = initialize_terminal_logger();

  tauri::Builder::default()
    .setup(move |app| {
      let splashscreen_window = app.get_window("splashscreen").unwrap();
      let _ = splashscreen_window.set_fullscreen(true);
      let main_window = app.get_window("main").unwrap();

      #[cfg(target_os = "windows")]
      tauri::async_runtime::spawn(async move {
        loop {
          sleep(Duration::from_secs(5)).await;
          let _ = simulate::press(simulate::Key::F15);
        }
      });

      let session_player = app.state::<SessionPlayer>();
      let dj = app.state::<DjSender>();
      let (_thera_tx, thera_rx) = thera_client::start_thera_client(app);
      start_input_processor(main_window.clone(), session_player, dj, thera_rx);
      tauri::async_runtime::spawn(async move {
        sleep(Duration::from_secs(3)).await;
        main_window.show().unwrap();
        splashscreen_window.close().unwrap();
      });
      Ok(())
    })
    .plugin(tauri_plugin_jymmin_audio_core::AudioCorePlugin::default())
    .plugin(tauri_plugin_jymmin_music_lib::MusicLib::default())
    .plugin(tauri_plugin_jymmin_auth::JymminAuth::default())
    .invoke_handler(tauri::generate_handler![
      load_session_with_cycling_session_play_state,
      set_difficulty,
      open_link_in_external_browser,
      last_session_results,
      cycling_session_state,
      restart_thera_client,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
