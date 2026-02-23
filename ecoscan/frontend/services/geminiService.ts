
import { GoogleGenAI, Type } from '@google/genai';
import { WasteAnalysis, BinColor } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string, vertexai: true });

export const analyzeWaste = async (base64Image: string): Promise<WasteAnalysis> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Analyze the item in this image and determine which waste bin it belongs to based on these STRICT rules:

    1. BLUE BIN (Paper and Cardboard):
       - YES: Non-confidential documents, Envelopes, Newspapers, Magazines, Small cardboard boxes.
       - NO: Food, Liquid, Paper hand towels, Soiled cardboard (e.g. pizza boxes with grease), Waxed boxes, Packaging.

    2. YELLOW BIN (Mixed Recycling):
       - YES: Empty plastic bottles (no lids), Empty glass bottles (no lids), Empty aluminum/steel cans, Rinsed plastic takeaway containers.
       - NO: Liquid, Paper towels/serviettes, Drink cartons (Tetra Paks), Compostable packaging/cutlery, Food.

    3. BROWN BIN (Dry Waste):
       - YES: Plastic bags & soft plastics (clean), Empty coffee cups, Stationery, Paper towels (damp is fine), Textiles/kitchen cloths, Empty drink cartons (Tetra Paks), Clean food packaging & cutlery.
       - NO: Liquid, Food.

    4. GREEN BIN (Food):
       - YES: Food waste, Coffee grounds, Tea bags.
       - NO: Plastic bags, Paper hand towels, Packaging/cutlery (even compostable), Glass/plastic bottles, Large bones/shells, Flowers, Cardboard, Metals.

    CRITICAL NUANCES:
    - Drink cartons (Tetra Paks) go in BROWN, NOT Yellow.
    - Paper towels go in BROWN, NOT Blue, Yellow, or Green.
    - Soft plastics/Plastic bags go in BROWN, NOT Green or Yellow.
    - Soiled/Greasy cardboard goes in BROWN (Dry Waste) or General Waste, NOT Blue.
    - If an item is a mix or doesn't fit, default to BROWN (Dry Waste) if it's dry, or UNKNOWN for general landfill.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          itemName: { type: Type.STRING, description: 'The name of the identified item.' },
          binColor: { 
            type: Type.STRING, 
            enum: Object.values(BinColor),
            description: 'The color of the bin the item belongs to.' 
          },
          reason: { type: Type.STRING, description: 'Explanation of why it belongs in this bin based on the specific rules provided.' },
          confidence: { type: Type.NUMBER, description: 'Confidence score between 0 and 1.' },
          disposalTips: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: 'Helpful tips for disposing of this specific item (e.g., "Rinse first", "Remove lid").'
          },
        },
        required: ['itemName', 'binColor', 'reason', 'confidence', 'disposalTips'],
      },
    },
  });

  try {
    return JSON.parse(response.text) as WasteAnalysis;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Could not analyze the image. Please try again.");
  }
};
