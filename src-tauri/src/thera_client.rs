use crossbeam_channel as channel;
use input_processor::tigo::TigoDataPacket;
use tauri::Manager;

#[cfg(target_os = "windows")]
use chronometer::Chronometer;
#[cfg(target_os = "windows")]
use std::convert::TryInto;
#[cfg(target_os = "windows")]
use std::time::{Duration, Instant};
#[cfg(target_os = "windows")]
use tauri::api::process::{Command, CommandEvent};
#[cfg(target_os = "windows")]
use tokio::sync::mpsc::error::TryRecvError;
#[cfg(target_os = "windows")]
use tracing::info;
#[cfg(target_os = "windows")]
use sysinfo::{ProcessExt, SystemExt, System};

pub mod blueparser;

use blueparser::{ParseEvent, TrainMode};

pub enum TigoEvent {
  Connect,
  Disconnect,
  Data(TigoDataPacket),
  SessionTime(usize),
  TrainModeChanged(TrainMode),
  SetDifficulty(usize),
}

#[cfg(not(target_os = "windows"))]
fn spawn_thera_client(_: channel::Sender<TigoEvent>) {
  // Placeholder for macos and linux mock of theraclient
}

#[cfg(target_os = "windows")]
fn spawn_thera_client(event_tx: channel::Sender<TigoEvent>) {
  // kill dangling blueproxy processes
  let mut s = System::new();
  s.refresh_processes();
  for process in s.processes_by_exact_name("blueproxy.exe") {
    process.kill();
  }

  let (mut rx, child) = Command::new("binaries/blueproxy.exe")
    .spawn()
    .expect("Failed to spawn blueproxy sidecar");

  tauri::async_runtime::spawn(async move {
    let mut last_train_mode: Option<TrainMode> = None;
    let mut is_connected = false;
    let mut last_msg: Option<Instant> = None;
    let mut chrono: Chronometer = Chronometer::new();
    // read events such as stdout
    loop {
      match rx.try_recv() {
        Ok(event) => {
          if let CommandEvent::Stdout(line) = event {
            if let Some(parse_event) = blueparser::parse(&line) {
              match parse_event {
                ParseEvent::Connect(_) => {
                  info!("Connected");
                  is_connected = true;
                  last_msg = Some(Instant::now());
                  last_train_mode = None;
                  let _ = event_tx.send(TigoEvent::TrainModeChanged(TrainMode::Stop));
                  let _ = event_tx.send(TigoEvent::Connect);
                }
                ParseEvent::Disconnect(_) => {
                  is_connected = false;
                  last_msg = Some(Instant::now());
                  info!("Disconnected");
                  let _ = event_tx.send(TigoEvent::Disconnect);
                  let _ = event_tx.send(TigoEvent::TrainModeChanged(TrainMode::Stop));
                }
                ParseEvent::DataPackets(data) => {
                  last_msg = Some(Instant::now());
                  if !is_connected {
                    is_connected = true;
                    last_train_mode = None;
                    let _ = event_tx.send(TigoEvent::TrainModeChanged(TrainMode::Stop));
                    let _ = event_tx.send(TigoEvent::Connect);
                  }
                  // check if train mode changed
                  if let Some(dp) = data.last() {
                    if let Some(last) = last_train_mode {
                      if last != dp.header.train_mode {
                        info!("{:?}", &last);
                        last_train_mode = Some(dp.header.train_mode);
                        let _ = event_tx.send(TigoEvent::TrainModeChanged(dp.header.train_mode));
                        match dp.header.train_mode {
                          TrainMode::Stop => chrono.reset(),
                          TrainMode::Pause => chrono.pause(),
                          TrainMode::Play => chrono.start(),
                          TrainMode::Spastic => chrono.pause(),
                          _ => (),
                        }
                      }
                    } else {
                      last_train_mode = Some(dp.header.train_mode);
                      let _ = event_tx.send(TigoEvent::TrainModeChanged(dp.header.train_mode));
                      match dp.header.train_mode {
                        TrainMode::Stop => chrono.reset(),
                        TrainMode::Pause => chrono.pause(),
                        TrainMode::Play => chrono.start(),
                        TrainMode::Spastic => chrono.pause(),
                        _ => (),
                      }
                    }
                    // update session Time
                    if let Some(last_train_mode) = last_train_mode {
                      if let TrainMode::Play = last_train_mode {
                        if let Some(duration) = chrono.duration() {
                          let _ = event_tx.send(TigoEvent::SessionTime(
                            duration.as_secs().try_into().unwrap(),
                          ));
                        }
                      }
                    }
                  }
                  // send packets to IP
                  // analyze multi packets
                  if let Some(last) = last_train_mode {
                    if let TrainMode::Play = last {
                      for p in &data {
                        let now = chrono
                          .duration()
                          .unwrap_or(Duration::from_millis(0))
                          .as_millis()
                          .try_into()
                          .unwrap();
                        let dp = TigoDataPacket::new(
                          p.data.rpm,
                          p.settings.resistance_step as f32 * 33.0,
                          p.data.power,
                          now,
                          p.settings.passive_rpm,
                        );
                        let _ = event_tx.send(TigoEvent::Data(dp));
                      }
                    }
                  }
                }
              }
            }
          }
        }
        Err(error) => match error {
          TryRecvError::Empty => {
            // check connection state, if connected
            if is_connected {
              // when was the last data package received?
              if let Some(last_msg) = last_msg {
                // if timeout threshold reached
                if last_msg.elapsed().as_secs() > 3 {
                  // kill child and spawn a new blueproxy.
                  chrono.reset();
                  let _ = event_tx.send(TigoEvent::TrainModeChanged(TrainMode::Stop));
                  let _ = event_tx.send(TigoEvent::Disconnect);
                  child.kill().expect("Failed to kill Blueproxy");
                  spawn_thera_client(event_tx.clone());
                  break;
                };
              }
            }
          }
          TryRecvError::Disconnected => break,
        },
      }
      tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    }
  });
}

/// creates the Tigo Event channel and starts the thera client (blueproxy) in a separate thread,
/// listening and emitting events on the runtime main thread.
/// The channel sender is added to the managed application state so it can be
/// retrieved in a tauri command. Sender and Receiver are also returned by the function.
pub fn start_thera_client(
  app: &tauri::App,
) -> (channel::Sender<TigoEvent>, channel::Receiver<TigoEvent>) {
  let (event_tx, event_rx) = channel::unbounded::<TigoEvent>();
  spawn_thera_client(event_tx.clone());
  app.manage(event_tx.clone());
  (event_tx, event_rx)
}

#[tauri::command]
pub fn restart_thera_client(event_tx: tauri::State<channel::Sender<TigoEvent>>) {
  spawn_thera_client(event_tx.inner().clone());
}
