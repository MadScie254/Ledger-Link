import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

async function test() {
  try {
    const ai = new GoogleGenAI({});
    console.log("Initialized AI client");
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: "Hello",
      config: {
        systemInstruction: "You are a test bot.",
      }
    });
    console.log("Response:", response.text);
  } catch (error: any) {
    console.error("Error:", error.message || String(error));
  }
}

test();
