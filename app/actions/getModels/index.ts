"use server";

interface Model {
  id: string;
  name: string;
  description: string;
  context_length: number;
  architecture: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  top_provider: string;
}

export async function getAllModels() {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();

    const freeModels = data.data.filter((model: Model) => {
      const promptPrice = parseFloat(model.pricing?.prompt || "0");
      const completionPrice = parseFloat(model.pricing?.completion || "0");
      return promptPrice === 0 && completionPrice === 0;
    });

    // Return formatted response with useful model information
    const formattedModels = freeModels.map((model: Model) => ({
      id: model.id,
      name: model.name,
      description: model.description,
      context_length: model.context_length,
      architecture: model.architecture,
      pricing: model.pricing,
      top_provider: model.top_provider,
    }));

    return formattedModels;
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
}
