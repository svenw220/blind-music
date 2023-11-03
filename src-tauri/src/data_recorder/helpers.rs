use input_mapper::payload::Payload;
use input_mapper::signal::SignalSet;

pub fn average(numbers: &[f32]) -> f32 {
  numbers.iter().sum::<f32>() as f32 / numbers.len() as f32
}

pub fn extract_continuous_signal_values(
  signal_name: &str,
  processor_output: &Vec<SignalSet>,
) -> Vec<f32> {
  processor_output
    .iter()
    .map(|signal_set| {
      let mut signal_value = 0.0;
      for signal in signal_set {
        if signal.name() == signal_name {
          signal_value = if let Payload::Continuous(value) = signal.payload() {
            value
          } else {
            0.0
          };
          break;
        }
      }
      signal_value
    })
    .collect::<Vec<f32>>()
}

pub fn last_output_range_setting(processor_output: &Vec<SignalSet>) -> Option<(f32, f32)> {
  processor_output
    .iter()
    .filter_map(|signal_set| {
      let mut signal_value: Option<(f32, f32)> = None;
      for signal in signal_set {
        if signal.name() == "Output Range" {
          signal_value = if let Payload::Range(value) = signal.payload() {
            Some((value.min(), value.max()))
          } else {
            None
          };
          break;
        }
      }
      signal_value
    })
    .last()
}
