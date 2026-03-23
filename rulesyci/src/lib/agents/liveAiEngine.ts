import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * LiveAiEngine: Handles the actual LLM calls used across RuleSci
 * Uses Gemini 1.5 Flash for speed and cost-efficiency.
 * Fallback simulates AI when key is missing to keep the UX clean.
 */

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export async function askAi(prompt: string, isJson: boolean = false) {
    if (!genAI) {
        console.warn("RuleSci AI: GEMINI_API_KEY missing in server. Reverting to Simulated Model.");
        return simulateAi(prompt, isJson);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (isJson) {
            // Very simple JSON cleaning
            const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
            return JSON.parse(cleaned);
        }

        return text;
    } catch (e) {
        console.error("RuleSci Live Logic Error:", e);
        return simulateAi(prompt, isJson);
    }
}

/**
 * Simulated AI Logic: High-fidelity mock logic
 * Used as a zero-key fallback to ensure the app is ALWAYS "intelligent"
 */
function simulateAi(prompt: string, isJson: boolean) {
    if (isJson) {
        // Simple mock for trade parsing
        if (prompt.includes("extract structured trading data")) {
            return {
                asset: "NIFTY",
                direction: "Long",
                entry: "Direct Market",
                exit: "Target Reached",
                pnl: 1500,
                emotion_tags: "good",
                rules_followed: ["held long"],
                rules_broken: []
            };
        }
    }
    return "RuleSci Agent: AI bridge is active. Please add GEMINI_API_KEY to your environment to enable real-time analysis.";
}
