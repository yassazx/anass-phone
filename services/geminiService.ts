import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductBlurb = async (productName: string, category: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a short, luxurious, and persuasive 2-sentence description for a high-end product named "${productName}" in the category "${category}". Focus on exclusivity and quality.`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Experience the pinnacle of luxury with this exclusive item.";
  } catch (error) {
    console.error("Gemini generation error:", error);
    return "Experience the pinnacle of luxury with this exclusive item.";
  }
};
