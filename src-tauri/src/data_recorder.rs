mod helpers;
mod session_results;
pub mod tauri_commands;

use input_mapper::signal::SignalSet;
use input_processor::tigo::TigoDataPacket;
use once_cell::sync::Lazy;
use session_results::SessionResults;

use std::sync::{Arc, Mutex};

pub static DATA_RECORDER: Lazy<Arc<Mutex<DataRecorder>>> =
  Lazy::new(|| Arc::new(Mutex::new(DataRecorder::new())));

pub struct DataRecorder {
  input_data: Vec<TigoDataPacket>,
  processor_output: Vec<SignalSet>,
  is_recording: bool,
  last_session_results: Option<SessionResults>,
  session_duration: f32,
}

impl DataRecorder {
  pub fn new() -> Self {
    Self {
      input_data: vec![],
      processor_output: vec![],
      is_recording: false,
      last_session_results: None,
      session_duration: 0.0,
    }
  }

  pub fn start(&mut self) {
    self.is_recording = true;
    self.session_duration = 0.0;
  }

  pub fn stop(&mut self) {
    self.is_recording = false;
  }

  pub fn is_recording(&self) -> bool {
    self.is_recording
  }

  pub fn set_session_duration(&mut self, duration: f32) {
    self.session_duration = duration;
  }

  pub fn save_session_results(&mut self) {
    self.last_session_results = Some(self.session_results());
  }

  pub fn add_data(&mut self, paket: TigoDataPacket) {
    if self.is_recording() {
      self.input_data.push(paket);
    }
  }

  pub fn add_processor_signals(&mut self, signals: SignalSet) {
    if self.is_recording() {
      self.processor_output.push(signals);
    }
  }

  pub fn reset(&mut self) {
    self.input_data.clear();
    self.processor_output.clear();
  }

  fn session_results(&self) -> SessionResults {
    SessionResults::from(
      &self.input_data,
      &self.processor_output,
      self.session_duration,
    )
  }

  pub fn last_session_results(&self) -> Option<&SessionResults> {
    self.last_session_results.as_ref()
  }
}
