
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const model = 'gemini-2.5-flash';

export const suggestStepsForModuleType = async (moduleTypeName: string): Promise<{ name: string }[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY is not configured.");
    }
    
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `You are a senior engineering project manager. For a design module called '${moduleTypeName}', generate a concise list of 6-8 typical design, manufacturing, and verification steps.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        steps: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: {
                                        type: Type.STRING,
                                        description: "The name of a single design step."
                                    }
                                }
                            }
                        }
                    }
                },
            },
        });

        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);
        
        if (parsedJson && Array.isArray(parsedJson.steps)) {
            return parsedJson.steps.filter((step: any): step is { name: string } => typeof step.name === 'string');
        } else {
            throw new Error("Invalid JSON structure in AI response.");
        }
        
    } catch (error) {
        console.error("Error fetching suggestions from Gemini API:", error);
        throw new Error("Failed to get suggestions from AI. Please try again or enter steps manually.");
    }
};
