export interface Model {
  id: string;
  name: string;
  description: string;
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    input_modalities: string[];
    output_modalities: string[];
  };
  pricing: {
    prompt: string
    completion: string;
    request: string;
  };
  top_provider: {
    max_completion_tokens: number;
    is_moderated: boolean;
  };
}
