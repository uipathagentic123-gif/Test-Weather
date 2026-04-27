/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { PRODUCTS } from "../constants";
import { Advisory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getRegionalWeatherAnalysis(location: string): Promise<{ weather: any, advisory: Advisory }> {
  const prompt = `
    Analyze the current weather in ${location} and provide a supply chain advisory.
    
    Current Season Context: We are currently in late April.
    3-Month Horizon: Late July (Transition into different seasonal patterns depending on the hemisphere).
    
    Product Catalog (Use these exact misspelled names):
    ${PRODUCTS.map(p => `- ${p.name} (${p.category}): ${p.description}`).join('\n')}
    
    Tasks:
    1. Retrieve current weather for ${location} using Google Search.
    2. Recommend which products from the catalog should be PRIORITIZED for IMMEDIATE supply to this region based on the current weather (e.g., if it's rainy/flu season, prioritize Mucanex/Strapsols; if it's high infection risk, Dattol).
    3. Provide manufacturing advice for the 3-MONTH HORIZON (July). Should we increase or decrease manufacture now to hit the July supply? Consider typical July weather in this region (e.g., peak summer, monsoon, or winter transition).
    
    Output must be strictly JSON.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    tools: [{ googleSearch: {} }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          weather: {
            type: Type.OBJECT,
            properties: {
              location: { type: Type.STRING },
              condition: { type: Type.STRING },
              temp: { type: Type.NUMBER },
              humidity: { type: Type.NUMBER },
              forecastSummary: { type: Type.STRING }
            },
            required: ["location", "condition", "temp", "humidity", "forecastSummary"]
          },
          advisory: {
            type: Type.OBJECT,
            properties: {
              immediateSupply: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    productId: { type: Type.STRING, description: "ID matching 1-10" },
                    priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                    reason: { type: Type.STRING }
                  },
                  required: ["productId", "priority", "reason"]
                }
              },
              manufacturingAdvice: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    productId: { type: Type.STRING, description: "ID matching 1-10" },
                    action: { type: Type.STRING, enum: ["Increase", "Decrease", "Stable"] },
                    horizon: { type: Type.STRING },
                    rationale: { type: Type.STRING }
                  },
                  required: ["productId", "action", "horizon", "rationale"]
                }
              }
            },
            required: ["immediateSupply", "manufacturingAdvice"]
          }
        },
        required: ["weather", "advisory"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
