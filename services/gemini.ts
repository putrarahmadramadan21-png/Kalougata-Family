
import { GoogleGenAI, Type } from "@google/genai";
import { Member } from "../types";

export const getCoachTips = async (member: Member) => {
  // Use named parameter for apiKey initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Berikan 3 tips singkat dan motivasi untuk pemain sepak bola dengan posisi ${member.position}. 
  Pemain ini bernama ${member.name} dan saat ini memiliki ${member.points} poin di komunitas.
  Gunakan gaya bahasa pelatih sepak bola yang bersemangat namun profesional dalam Bahasa Indonesia.`;

  try {
    // Call generateContent with model name, prompt, and responseSchema
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 tips singkat dan motivasi",
            },
            motivation: {
              type: Type.STRING,
              description: "Kalimat motivasi pelatih",
            },
          },
          required: ["tips", "motivation"],
          propertyOrdering: ["tips", "motivation"],
        },
      }
    });

    // Access .text property directly (not a method)
    const text = response.text;
    if (!text) {
      throw new Error("No response text received from model");
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      tips: ["Tetap berlatih keras setiap hari.", "Jaga pola makan dan istirahat.", "Kerja sama tim adalah kunci."],
      motivation: "Kamu punya potensi besar untuk menjadi bintang di komunitas ini!"
    };
  }
};
