export interface Model {
  model: string;
  modified_at: string;
  digest: string;
  size: number;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface ModelResponse {
  models: Model[];
}
