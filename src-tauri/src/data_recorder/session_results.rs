use super::helpers::{average, extract_continuous_signal_values, last_output_range_setting};
use super::TigoDataPacket;
use super::SignalSet;
use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SessionResults {
  version: usize, // useful for migrations, if we safe the whole package
  mean_rpm: f32,
  mean_power: f32,
  mean_activity: f32,
  mean_mapped_activity: f32,
  peak_rpm: f32,
  peak_power: f32,
  peak_activity: f32,
  peak_mapped_activity: f32,
  peak_brake_torque: f32,
  output_range: (f32, f32),
  session_data: Vec<TigoDataPacket>,
  output_data: Vec<f32>,
  duration: f32,
}

impl SessionResults {
  pub fn from(
    input_data: &Vec<TigoDataPacket>,
    processor_output: &Vec<SignalSet>,
    duration: f32,
  ) -> Self {
    let rpm_values = input_data.iter().map(|d| *d.rpm()).collect::<Vec<f32>>();
    let power_values = input_data.iter().map(|d| *d.power()).collect::<Vec<f32>>();
    let brake_torque_values = input_data
      .iter()
      .map(|d| *d.brake_torque())
      .collect::<Vec<f32>>();
    let activity_values = extract_continuous_signal_values("Activity", processor_output);
    let mapped_activity_values =
      extract_continuous_signal_values("Mapped Activity", processor_output);
    let output_range = last_output_range_setting(processor_output).unwrap_or((0.0, 1.0));
    Self {
      version: 1, // useful for migrations, if we safe the whole package
      mean_rpm: average(&rpm_values),
      mean_power: average(&power_values),
      mean_activity: average(&activity_values),
      mean_mapped_activity: average(&mapped_activity_values),
      peak_rpm: rpm_values.iter().copied().fold(f32::NAN, f32::max),
      peak_power: power_values.iter().copied().fold(f32::NAN, f32::max),
      peak_activity: activity_values.iter().copied().fold(f32::NAN, f32::max),
      peak_mapped_activity: mapped_activity_values
        .iter()
        .copied()
        .fold(f32::NAN, f32::max),
      peak_brake_torque: brake_torque_values.iter().copied().fold(f32::NAN, f32::max),
      output_range,
      session_data: input_data.to_vec(),
      output_data: mapped_activity_values,
      duration,
    }
  }
}
