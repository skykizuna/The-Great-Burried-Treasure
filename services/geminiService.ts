
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateBossIntro(algorithm: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Captain Hook from Peter Pan. Peter Pan has just reached your ship after learning about ${algorithm}. Write a short, 2-sentence threatening but educational greeting to challenge him to a final duel of wits.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Blast you, Peter Pan! You think you know your algorithms? Let's see you handle the Jolly Roger's final test!";
  }
}
