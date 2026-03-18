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

        // --- TRUE GPT-4o IMPLEMENTATION SCAFFOLD ---
        
        /*
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert trading assistant. Your job is to extract structured trading data from the user's raw notes.
                    You must return a raw JSON object matching this schema exactly:
                    {
                        "asset": "string (e.g., NIFTY, TSLA, BTC)",
                        "direction": "Long" or "Short",
                        "entry": "number or string",
                        "exit": "number or string",
                        "pnl": "number (negative for loss, positive for win)",
                        "emotion_tags": "very_bad" | "bad" | "neutral" | "good" | "great",
                        "rules_followed": ["array of Rule IDs that evidence shows they specifically followed"],
                        "rules_broken": ["array of Rule IDs that evidence shows they specifically broke"]
                    }
                    
                    Here are the user's active rules to check against:
                    ${JSON.stringify(activeRules, null, 2)}
                    
                    If the user note implies they broke a rule (e.g., they moved their stop loss, and Rule X is "Never move stop loss"), add Rule X to rules_broken.
                    Output ONLY valid JSON. No markdown blocking.`
                },
                {
                    role: "user",
                    content: note
                }
            ],
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const extracted = JSON.parse(response.choices[0].message.content || '{}');
        return NextResponse.json(extracted);
        */

        // --- FALLBACK MOCK RETURN FOR DEMO ---
        // For right now, since the API key isn't provided, we will return a 501 
        // to tell the client to revert to the local rule parser simulation.
        return NextResponse.json(
            { error: 'OpenAI API key not configured. Using client-side simulation fallback.' }, 
            { status: 501 }
        );

    } catch (e: any) {
        console.error("Parse Trade Error:", e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
