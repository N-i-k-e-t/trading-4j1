import { NextResponse } from 'next/server';

// Note: To make this live, the user will need to install 'openai' 
// `npm install openai` and set `OPENAI_API_KEY` in .env.local
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

/**
 * API Route: /api/parse-trade
 * Method: POST
 * 
 * Purpose: Takes a raw unstructured string of trading notes (from voice or text),
 * and uses GPT-4o to extract standard JSON parameters that match the `Trade` interface,
 * as well as detecting rule violations based on an active rule set.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { note, activeRules } = body;

        if (!note) {
            return NextResponse.json({ error: 'Missing raw note to parse' }, { status: 400 });
        }

        // --- TRUE LIVE AI IMPLEMENTATION ---
        const { askAi } = await import('@/lib/agents/liveAiEngine');
        
        const prompt = `
            You are RuleSci AI. Extract structured trading data from this raw note:
            Note: "${note}"
            
            Active Rules to check against:
            ${JSON.stringify(activeRules, null, 2)}
            
            Format your response as a valid JSON object matching this schema:
            {
                "asset": "string (e.g. BTC, NIFTY)",
                "direction": "Long" | "Short",
                "entry": "string/number",
                "exit": "string/number",
                "pnl": "number (negative for loss, positive for win)",
                "emotion_tags": "very_bad" | "bad" | "neutral" | "good" | "great",
                "rules_followed": ["rule_id_1", "rule_id_2"],
                "rules_broken": ["rule_id_3"]
            }
            
            IMPORTANT: Return ONLY the raw JSON. If details are missing, make best-guess based on context.
        `;

        const extracted = await askAi(prompt, true);
        return NextResponse.json(extracted);

    } catch (e: any) {
        console.error("Parse Trade Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
