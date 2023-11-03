use csv::ReaderBuilder;
use regex::Regex;
use serde::Deserialize;
use serde_repr::{Deserialize_repr, Serialize_repr};

#[derive(Serialize_repr, Deserialize_repr, PartialEq, Debug)]
#[repr(u8)]
pub enum Direction {
  Backward = 0,
  Forward = 1,
}

#[derive(Serialize_repr, Deserialize_repr, PartialEq, Debug, Clone, Copy)]
#[repr(u8)]
pub enum TrainMode {
  Stop = 0,
  Pause = 1,
  Play = 2,
  Spastic = 3,
  Standby = 4,
  GetInIsActive = 5,
  StimMode = 6,
  Error = 7,
}

#[derive(Serialize_repr, Deserialize_repr, PartialEq, Debug)]
#[repr(u8)]
pub enum TrainType {
  Arm = 0,
  Leg = 1,
}

#[derive(Serialize_repr, Deserialize_repr, PartialEq, Debug)]
#[repr(u8)]
pub enum TrainProg {
  Neuro = 0,
  Ortho = 1,
  Cardio = 2,
  Isokinetic = 3,
  Keeper = 4,
  Hedgehog = 5,
  Car = 6,
  Planet = 7,
  GroupTherapy = 8,
  TheraSoft = 9,
}

#[derive(Serialize_repr, Deserialize_repr, PartialEq, Debug)]
#[repr(u8)]
pub enum PatientActivity {
  Passive = 0,
  Active = 1,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct HeaderFrame {
  pub timestamp: usize,
  pub train_mode: TrainMode,
  pub train_type: TrainType,
  pub device_name: String,
  pub train_prog: TrainProg,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct SettingsFrame {
  pub direction: Direction,
  pub max_engine_torque: f32,
  pub resistance_step: u8,
  pub resistance_nm: f32,
  pub power: f32,
  pub passive_rpm: f32,
  pub training_time: String,
  pub max_heart_rate: usize,
}

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct DataFrame {
  pub symm_left: f32,
  pub torque: f32,
  pub power: f32,
  pub heart_rate: usize,
  pub kcal: f32,
  pub spasm_count: usize,
  pub distance: f32,
  pub rpm: f32,
  pub training_time: String,
  pub uniform_rotation: f32,
  pub patient_activity: PatientActivity,
}

#[derive(Debug)]
pub struct TigoDataPacket {
  pub header: HeaderFrame,
  pub settings: SettingsFrame,
  pub data: DataFrame,
}

impl TigoDataPacket {
  fn try_from_regex(cap: regex::Captures) -> Result<Self, &'static str> {
    Ok(TigoDataPacket {
      header: read_header_frame(&cap[1]).ok_or("Could not read header")?,
      settings: read_settings_frame(&cap[2]).ok_or("Could not read settings")?,
      data: read_data_frame(&cap[3]).ok_or("Could not read data")?,
    })
  }
}

#[derive(Debug)]
pub enum ParseEvent {
  Connect(String),
  Disconnect(String),
  DataPackets(Vec<TigoDataPacket>),
}

pub fn read_header_frame(csv_data: &str) -> Option<HeaderFrame> {
  let mut rdr = ReaderBuilder::new()
    .has_headers(false)
    .from_reader(csv_data.as_bytes());
  let mut iter = rdr.deserialize();
  iter.next().map(|result| result.ok()).flatten()
}

pub fn read_settings_frame(csv_data: &str) -> Option<SettingsFrame> {
  let mut rdr = ReaderBuilder::new()
    .has_headers(false)
    .from_reader(csv_data.as_bytes());
  let mut iter = rdr.deserialize();
  iter.next().map(|result| result.ok()).flatten()
}

pub fn read_data_frame(csv_data: &str) -> Option<DataFrame> {
  let mut rdr = ReaderBuilder::new()
    .has_headers(false)
    .from_reader(csv_data.as_bytes());
  let mut iter = rdr.deserialize();
  iter.next().map(|result| result.ok()).flatten()
}

pub fn parse(input: &str) -> Option<ParseEvent> {
  let re = Regex::new(r"@(\d*,?\d,\d,nn\#[a-zA-Z0-9]*,\d)@(\d*,-?\d*(?:\.\d+)?,\d*,-?\d*(?:\.\d+)?,-?\d*(?:\.\d+)?,-?\d*(?:\.\d+)?,\d{2}:\d{2}:\d{2},\d*)@(-?\d*(?:\.\d+)?,-?\d*(?:\.\d+)?,-?\d*(?:\.\d+)?,\d*,-?\d*(?:\.\d+)?,\d*,-?\d*(?:\.\d+)?,-?\d*(?:\.\d+)?,\d{2}:\d{2}:\d{2},-?\d*(?:\.\d+)?,\d*)").unwrap();
  let connect_re = Regex::new(r"<([a-zA-Z]+)Blue>(.*)").unwrap();
  // dbg!(String::from(input));
  let mut data_packets: Vec<TigoDataPacket> = vec![];
  for cap in re.captures_iter(input) {
    let data_packet = TigoDataPacket::try_from_regex(cap).unwrap();
    data_packets.push(data_packet);
  }
  if !data_packets.is_empty() {
    return Some(ParseEvent::DataPackets(data_packets));
  } else {
    for cap in connect_re.captures_iter(input) {
      if &cap[1] == "Connect" {
        return Some(ParseEvent::Connect(cap[2].to_string()));
      } else if &cap[1] == "Disconnect" {
        return Some(ParseEvent::Disconnect(cap[2].to_string()));
      }
    }
  }
  None
}
