import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set. AI features may not work.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const analyzeHerbImage = async (base64Image: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: "Analyze this herb image. Provide identification, scientific name, confidence level (0-100), Ayurvedic history, benefits, and precautions. If confidence is low, state it clearly. Return the response in JSON format." },
            { inlineData: { data: base64Image, mimeType } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error analyzing herb image:", error);
    throw error;
  }
};

export const generateHerbImage = async (herbName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `A high-quality, realistic, and detailed botanical illustration of the Ayurvedic herb ${herbName}. The image should be clear, showing the leaves and characteristics of the plant on a clean, soft background. Professional photography style.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating herb image:", error);
    return null;
  }
};
