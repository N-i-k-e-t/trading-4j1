import type { Trade, Rule, BaselineState } from '@/types/trading';

// This is a client-side simulation of what would be a GPT-4o backend call.
// It uses regex and keyword matching to simulate Whisper/GPT-4 extraction of
// structured trade data and rule violations from a raw text note.

export async function parseRoughNote(note: string, activeRules: Rule[]): Promise<{
    parsedTrade: Partial<Trade>;
    detectedFollowed: string[];
    detectedBroken: string[];
    confidence: number;
}> {
    return new Promise((resolve) => {
        // Simulate network delay for the "magic" feel
        setTimeout(() => {
            const noteLower = note.toLowerCase();
            
            // 1. Extract Asset/Pair
            let pair = "UNKNOWN";
            const commonPairs = ['NIFTY', 'BANKNIFTY', 'EURUSD', 'BTC', 'ETH', 'SPY', 'QQQ', 'AAPL', 'TSLA'];
            for (const p of commonPairs) {
                if (noteLower.includes(p.toLowerCase())) {
                    pair = p;
                    break;
                }
            }

            // 2. Extract Direction
            let type: 'Long' | 'Short' = 'Long';
            if (noteLower.includes('short') || noteLower.includes('put') || noteLower.includes('sell')) {
                type = 'Short';
            }

            // 3. Extract Entry/Exit
            // Look for numbers following "at " or "entry " or "exit "
            const entryMatch = noteLower.match(/(?:at|entry|entered|bought|sold)[\s:]*([0-9.,]+)/);
            const exitMatch = noteLower.match(/(?:exit|exited|stopped|closed|target)[\s:]*([0-9.,]+)/);
            
            const entry = entryMatch ? entryMatch[1] : '';
            const exit = exitMatch ? exitMatch[1] : '';

            // 4. Extract Mood
            let emotion: BaselineState = 'neutral';
            if (noteLower.match(/(anxious|fear|scared|panic|bad)/)) emotion = 'bad';
            if (noteLower.match(/(angry|revenge|frustrated|furious|mad)/)) emotion = 'very_bad';
            if (noteLower.match(/(happy|great|perfect|calm|disciplined)/)) emotion = 'good';

            // 5. Match Rules
            const detectedFollowed: string[] = [];
            const detectedBroken: string[] = [];

            activeRules.forEach(rule => {
                const ruleTextLower = rule.text.toLowerCase();
                
                // Extremely basic fuzzy matching logic for demo purposes
                // Example: If rule is "Never move stop loss" and note says "moved stop" -> broken
                
                let ruleBroken = false;
                let ruleFollowed = false;

                if (ruleTextLower.includes('stop loss') || ruleTextLower.includes('sl')) {
                    if (noteLower.includes('moved stop') || noteLower.includes('moved sl') || noteLower.includes('ignored sl')) {
                        ruleBroken = true;
                    }
                }
                
                if (ruleTextLower.includes('confirmation')) {
                    if (noteLower.includes('before confirmation') || noteLower.includes('early') || noteLower.includes('fomo')) {
                        ruleBroken = true;
                    } else if (noteLower.includes('waited for') || noteLower.includes('got confirmation')) {
                        ruleFollowed = true;
                    }
                }

                if (ruleTextLower.includes('revenge')) {
                    if (noteLower.includes('revenue trade') || noteLower.includes('chasing') || noteLower.includes('make it back')) {
                        ruleBroken = true;
                    }
                }

                if (ruleBroken) {
                    detectedBroken.push(rule.id);
                } else if (ruleFollowed) {
                    detectedFollowed.push(rule.id);
                }
            });

            resolve({
                parsedTrade: {
                    pair,
                    type,
                    entry,
                    exit,
                    emotion,
                    notes: note // Stash the raw note in the notes field
                },
                detectedFollowed,
                detectedBroken,
                confidence: entryMatch && exitMatch && pair !== 'UNKNOWN' ? 0.95 : 0.65
            });

        }, 1500);
    });
}
