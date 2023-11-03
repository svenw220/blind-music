/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Image =
  | {
      Url: string;
    }
  | {
      Path: string;
    }
  | {
      Png: number[];
    }
  | {
      Jpeg: number[];
    };
export type Gain = number;
export type OutputCurve = 'Linear' | 'Quadratic' | 'Exponential' | 'Logarithmic';
export type FilterTypes = 'LowPass';
export type When =
  | ('Now' | 'NextBar')
  | {
      Frame: number;
    };
/**
 * Describes if the offset of the song clock should be included in the calculation of the current playhead position.
 */
export type SyncMode = 'NoSync' | 'GlobalSync';

export interface Song {
  id: string;
  song_group_id?: string;
  instruments: OrderedMapFor_UuidAnd_Instrument;
  meta_info: MetaInfo;
  scenes: OrderedMapFor_UuidAnd_Scene;
  fx_chain?: FxChain;
  adsr?: Adsr;
  parent_id?: string | null;
  model_version?: string;
  [k: string]: unknown;
}
export interface OrderedMapFor_UuidAnd_Instrument {
  map: {
    [k: string]: Instrument;
  };
  order: string[];
  [k: string]: unknown;
}
export interface Instrument {
  id: string;
  modules: OrderedMapFor_UuidAnd_Module;
  meta_info: MetaInfo;
  gain: Gain;
  adsr?: Adsr;
  fx_chain?: FxChain;
  [k: string]: unknown;
}
export interface OrderedMapFor_UuidAnd_Module {
  map: {
    [k: string]: Module;
  };
  order: string[];
  [k: string]: unknown;
}
export interface Module {
  id: string;
  generators: Generator[];
  meta_info: MetaInfo;
  gain: Gain;
  adsr?: Adsr;
  fx_chain?: FxChain;
  filter: BiQuad;
  quantization: When;
  sync_mode: SyncMode;
  [k: string]: unknown;
}
export interface Generator {
  generator_type: 'Looper';
  [k: string]: unknown;
}
export interface MetaInfo {
  id: string;
  title: string;
  genre: string;
  description: string;
  arranger: string;
  composer?: string;
  jymminizer?: string;
  owner: string;
  image?: Image | null;
  tempo: Tempo;
  i18n: unknown | null;
  [k: string]: unknown;
}
export interface Tempo {
  bpm: number;
  beats_per_bar: number;
  divisor: number;
  quantization?: Quantization | null;
  [k: string]: unknown;
}
export interface Quantization {
  quant: number;
  phase: number;
  offset: number;
  outset: number;
  [k: string]: unknown;
}
export interface Adsr {
  id: string;
  attack_time: number;
  decay_time: number;
  sustain_level: number;
  release_time: number;
  [k: string]: unknown;
}
/**
 * The FxChain is a [crate::Song] [crate::Component]. It consists of a list of [link::FxChainLink]s.
 */
export interface FxChain {
  id: string;
  audio_effects: OrderedMapFor_UuidAnd_AudioEffect;
  [k: string]: unknown;
}
export interface OrderedMapFor_UuidAnd_AudioEffect {
  map: {
    [k: string]: AudioEffect;
  };
  order: string[];
  [k: string]: unknown;
}
export interface AudioEffect {
  fx_type: 'GainCurve' | 'BiQuad';
  [k: string]: unknown;
}
export interface BiQuad {
  id: string;
  is_on: boolean;
  gain: number;
  frequency: Parameter;
  q: Parameter;
  filter_type: FilterTypes;
  [k: string]: unknown;
}
export interface Parameter {
  id: string;
  owner: string;
  value: number;
  min: number;
  max: number;
  output_curve: OutputCurve;
  curve?: AnimationCurve | null;
  is_mapped_to_track_input: boolean;
  [k: string]: unknown;
}
export interface AnimationCurve {
  keys: Key[];
  curve: number[];
  [k: string]: unknown;
}
export interface Key {
  p: Point;
  p_in: Point;
  p_out: Point;
  [k: string]: unknown;
}
export interface Point {
  time: number;
  value: number;
  [k: string]: unknown;
}
export interface OrderedMapFor_UuidAnd_Scene {
  map: {
    [k: string]: Scene;
  };
  order: string[];
  [k: string]: unknown;
}
export interface Scene {
  id: string;
  scene_components: {
    [k: string]: string;
  };
  meta_info: MetaInfo;
  [k: string]: unknown;
}
