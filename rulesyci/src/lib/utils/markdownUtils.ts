import { Trade } from '@/types/trading';

/**
 * Converts a Trade object into Obsidian-compatible Markdown with YAML frontmatter.
 */
export function tradeToMarkdown(trade: Trade): string {
    const safeAsset = trade.pair || 'Unknown';
    const safeDirection = trade.type || 'LONG';
    const safePnl = trade.pnl || 0;
    
    // Format YAML Frontmatter
    let md = `---\n`;
    md += `title: Trade ${safeAsset} - ${new Date(trade.date).toISOString().split('T')[0]}\n`;
    md += `date: ${new Date(trade.date).toISOString()}\n`;
    md += `asset: ${safeAsset}\n`;
    md += `direction: ${safeDirection}\n`;
    md += `entry: ${trade.entry || ''}\n`;
    md += `exit: ${trade.exit || ''}\n`;
    md += `pnl: ${safePnl}\n`;
    md += `mood: ${trade.emotion || 'neutral'}\n`;
    
    // Arrays in YAML
    if (trade.rules_followed?.length) {
        md += `rules_followed:\n`;
        trade.rules_followed.forEach(r => md += `  - "${r}"\n`);
    } else {
        md += `rules_followed: []\n`;
    }

    if (trade.rules_broken?.length) {
        md += `rules_broken:\n`;
        trade.rules_broken.forEach(r => md += `  - "${r}"\n`);
    } else {
        md += `rules_broken: []\n`;
    }
    
    md += `---\n\n`;

    // Markdown Body
    md += `# Trade Review: ${safeAsset} (${safeDirection})\n\n`;
    
    md += `### Notes\n`;
    md += `${trade.notes || 'No notes provided.'}\n\n`;
    
    md += `### Tags\n`;
    md += `#trade #${safeAsset.replace(/[^a-zA-Z0-9]/g, '')} #${safePnl >= 0 ? 'win' : 'loss'}\n`;

    return md;
}

/**
 * Parses Obsidian-compatible Markdown with YAML frontmatter back into a Trade object.
 */
export function markdownToTrade(markdown: string): Partial<Trade> {
    const trade: Partial<Trade> = {
        id: `import_${Date.now()}_${Math.random().toString(36).substring(7)}`
    };

    // Extract YAML frontmatter
    const yamlMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
    if (!yamlMatch) return trade;

    const yaml = yamlMatch[1];
    const lines = yaml.split('\n');
    
    let currentArrayField: string | null = null;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Handle Array items
        if (trimmed.startsWith('-') && currentArrayField) {
            const arrVal = trimmed.substring(1).trim().replace(/^"|"$/g, '');
            if (currentArrayField === 'rules_followed') {
                trade.rules_followed = trade.rules_followed || [];
                trade.rules_followed.push(arrVal);
            } else if (currentArrayField === 'rules_broken') {
                trade.rules_broken = trade.rules_broken || [];
                trade.rules_broken.push(arrVal);
            }
            continue;
        }

        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) continue;

        const key = line.substring(0, colonIdx).trim();
        const rawVal = line.substring(colonIdx + 1).trim();
        
        // Check if starting an array
        if (rawVal === '') {
            if (key === 'rules_followed' || key === 'rules_broken') {
                currentArrayField = key;
            }
            continue;
        } else {
            currentArrayField = null; // reset
        }

        const val = rawVal.replace(/^"|"$/g, '');

        switch (key) {
            case 'date': trade.date = new Date(val).toISOString(); break;
            case 'asset': trade.pair = val; break;
            case 'direction': trade.type = val as 'Long' | 'Short'; break;
            case 'entry': trade.entry = val; break;
            case 'exit': trade.exit = val; break;
            case 'pnl': trade.pnl = parseFloat(val); break;
            case 'mood': trade.emotion = val as any; break;
        }
    }

    // Extract notes from body (everything after '### Notes')
    const notesMatch = markdown.match(/### Notes\n([\s\S]*?)(?:###|$)/);
    if (notesMatch && notesMatch[1]) {
        trade.notes = notesMatch[1].trim();
    }

    // Ensure arrays exist
    if (!trade.rules_followed) trade.rules_followed = [];
    if (!trade.rules_broken) trade.rules_broken = [];

    return trade;
}
