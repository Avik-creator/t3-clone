import { NextRequest, NextResponse } from 'next/server';

interface Model {
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
    prompt: string;
    completion: string;
    request: string;
  };
  top_provider: {
    max_completion_tokens: number;
    is_moderated: boolean;
  };
}

export async function GET(req: NextRequest) {
  try {

    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();

    const freeModels = data.data.filter((model: Model) => {
      const promptPrice = parseFloat(model.pricing?.prompt || '0');
      const completionPrice = parseFloat(model.pricing?.completion || '0');
      return promptPrice === 0 && completionPrice === 0;
    });

    // Sort models to prioritize more reliable ones
    const prioritizedModels = freeModels.sort((a: Model, b: Model) => {
      const priorityOrder = [
        'anthropic/claude-3-haiku:beta',
        'anthropic/claude-3-haiku',
        'meta-llama/llama-3.2-3b-instruct:free',
        'meta-llama/llama-3.1-8b-instruct:free',
        'microsoft/wizardlm-2-8x22b:free',
        'mistralai/mistral-7b-instruct:free',
      ];

      const aPriority = priorityOrder.indexOf(a.id);
      const bPriority = priorityOrder.indexOf(b.id);

      // If both are in priority list, sort by priority
      if (aPriority !== -1 && bPriority !== -1) {
        return aPriority - bPriority;
      }
      // If only one is in priority list, prioritize it
      if (aPriority !== -1) return -1;
      if (bPriority !== -1) return 1;
      // Otherwise, sort alphabetically
      return a.name.localeCompare(b.name);
    });

    // Return formatted response with useful model information
    const formattedModels = prioritizedModels.map((model: Model) => ({
      id: model.id,
      name: model.name,
      description: model.description,
      context_length: model.context_length,
      architecture: {
        modality: model.architecture?.modality || "text->text",
        tokenizer: model.architecture?.tokenizer || "Unknown",
        input_modalities: model.architecture?.input_modalities || ["text"],
        output_modalities: model.architecture?.output_modalities || ["text"],
      },
      pricing: {
        prompt: model.pricing?.prompt || "0",
        completion: model.pricing?.completion || "0",
        request: model.pricing?.request || "0",
      },
      top_provider: {
        max_completion_tokens: model.top_provider?.max_completion_tokens || model.context_length,
        is_moderated: model.top_provider?.is_moderated || false,
      },
    }));

    return NextResponse.json({
      models: formattedModels,
    });

  } catch (error) {
    console.error('Error fetching free models:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch free models',
      },
      { status: 500 }
    );
  }
}