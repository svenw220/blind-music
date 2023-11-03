use crossbeam_channel as channel;

use tracing::info;

mod event_emitters;
pub mod tauri_commands;

use crate::json_messages::{
  ConnectionState, CyclingSessionState, MessageType, ProcessedSignalsEvent, SessionTimeMessage,
  StateUpdate, TransportState,
};

use crate::thera_client::{blueparser::TrainMode, TigoEvent};

use crate::data_recorder::DATA_RECORDER;
use crate::session_state::SESSION_STATE;

use input_mapper::signal::SignalSet;
use input_processor::{tigo, InputProcessor};
use tauri_plugin_jymmin_audio_core::{
  state::{DjSender, SessionPlayer},
  traits::{Messaging, PlayerAPI},
};
use session_player::SessionPlayerAPI;

pub fn start_input_processor(
  window: tauri::Window,
  session_player: tauri::State<SessionPlayer>,
  dj: tauri::State<DjSender>,
  thera_rx: channel::Receiver<TigoEvent>,
) {
  let dj: DjSender = dj.inner().clone();
  let session_player: SessionPlayer = session_player.inner().clone();

  info!("Start input processor");
  tauri::async_runtime::spawn(async move {
    let mut processor = tigo::TigoProcessor::new(dj.input_tx());
    subscribe_for_signal_updates(window.clone(), &mut processor);

    let use_cases = vec![processor.use_case().unwrap()];
    info!(?use_cases, "Load use case");
    dj.set_use_cases(use_cases).unwrap();

    while let Ok(msg) = thera_rx.recv() {
      match msg {
        TigoEvent::SetDifficulty(difficulty) => {
          if let Err(err) = processor.set_difficulty(difficulty) {
            tracing::error!("Set Difficulty Error: {:?}", err);
          }
        }
        TigoEvent::Data(data) => {
          processor.add_tigo_data(data.clone()).unwrap();

          DATA_RECORDER.lock().unwrap().add_data(data.clone());
          event_emitters::emit_cycling_session_update(
            &window,
            "updateCyclingData",
            StateUpdate::TigoData(data),
          );
        }
        TigoEvent::SessionTime(time) => {
          DATA_RECORDER
            .lock()
            .unwrap()
            .set_session_duration(time as f32);
          let data = StateUpdate::SessionTime(SessionTimeMessage {
            msg_type: MessageType::SessionTime,
            current_time: time as f32,
            total_time: 900.0,
          });
          event_emitters::emit_cycling_session_update(&window, "updateTime", data);
        }
        TigoEvent::Connect => {
          let mut session_state = SESSION_STATE.lock().unwrap();
          session_state.set_connection_state(ConnectionState::Connected);
          let data = StateUpdate::DeviceConnection(ConnectionState::Connected);
          event_emitters::emit_cycling_session_update(&window, "updateConnectionState", data);
        }
        TigoEvent::Disconnect => {
          let mut session_state = SESSION_STATE.lock().unwrap();
          session_state.set_connection_state(ConnectionState::Searching);
          let data = StateUpdate::DeviceConnection(ConnectionState::Searching);
          event_emitters::emit_cycling_session_update(&window, "updateConnectionState", data);
        }
        TigoEvent::TrainModeChanged(train_mode) => match train_mode {
          TrainMode::Stop => {
            let mut data_recorder = DATA_RECORDER.lock().unwrap();
            data_recorder.stop();
            data_recorder.save_session_results();
            data_recorder.reset();

            let mut session_state = SESSION_STATE.lock().unwrap();
            session_state.set_cycling_session_state(CyclingSessionState::Stopped);
            let data = StateUpdate::CyclingSession(CyclingSessionState::Stopped);
            event_emitters::emit_cycling_session_update(&window, "updateSessionState", data);
            if session_state.current_music_session().is_some() {
              let _ = session_player.stop();
              event_emitters::emit_transport_state_update(
                &window,
                StateUpdate::TransportStateMessage(TransportState::Stopped),
              );
            }
          }
          TrainMode::Pause => {
            DATA_RECORDER.lock().unwrap().stop();
            let mut session_state = SESSION_STATE.lock().unwrap();
            session_state.set_cycling_session_state(CyclingSessionState::Paused);
            let data = StateUpdate::CyclingSession(CyclingSessionState::Paused);
            event_emitters::emit_cycling_session_update(&window, "updateSessionState", data);
            if session_state.current_music_session().is_some() {
              let _ = session_player.pause();
              event_emitters::emit_transport_state_update(
                &window,
                StateUpdate::TransportStateMessage(TransportState::Paused),
              );
            }
          }
          TrainMode::Spastic => {
            DATA_RECORDER.lock().unwrap().stop();
            let mut session_state = SESSION_STATE.lock().unwrap();
            session_state.set_cycling_session_state(CyclingSessionState::Paused);
            let data = StateUpdate::CyclingSession(CyclingSessionState::Paused);
            event_emitters::emit_cycling_session_update(&window, "updateSessionState", data);
            if session_state.current_music_session().is_some() {
              let _ = session_player.pause();
              event_emitters::emit_transport_state_update(
                &window,
                StateUpdate::TransportStateMessage(TransportState::Paused),
              );
            }
          }
          TrainMode::Play => {
            DATA_RECORDER.lock().unwrap().start();
            let mut session_state = SESSION_STATE.lock().unwrap();
            session_state.set_cycling_session_state(CyclingSessionState::Playing);
            let data = StateUpdate::CyclingSession(CyclingSessionState::Playing);
            event_emitters::emit_cycling_session_update(&window, "updateSessionState", data);
            if session_state.current_music_session().is_some() {
              let _ = session_player.play();
              event_emitters::emit_transport_state_update(
                &window,
                StateUpdate::TransportStateMessage(TransportState::Playing),
              );
            }
          }
          _ => (),
        },
      }
    }
  });
}

fn subscribe_for_signal_updates(window: tauri::window::Window, ip: &mut tigo::TigoProcessor) {
  let (tx, rx) = channel::bounded::<SignalSet>(1);
  ip.subscribe(tx).unwrap();
  std::thread::spawn(move || {
    while let Ok(signals) = rx.recv() {
      DATA_RECORDER
        .lock()
        .unwrap()
        .add_processor_signals(signals.clone());
      window
        .emit("processed-signals", ProcessedSignalsEvent { signals })
        .unwrap();
    }
  });
}
