import fs from 'fs';
import path from 'path';

export interface KnowledgeEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
  source: string;
  verified: boolean;
}

let cached: KnowledgeEntry[] | null = null;

export function loadKnowledge(): KnowledgeEntry[] {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), 'data', 'knowledge.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  cached = JSON.parse(raw) as KnowledgeEntry[];
  return cached;
}

export function retrieveRelevant(query: string, topK = 3): KnowledgeEntry[] {
  const entries = loadKnowledge();
  const q = query.toLowerCase();
  const terms = q.split(/\s+/).filter(t => t.length > 2);

  const scored = entries.map(entry => {
    const text = `${entry.question} ${entry.answer} ${entry.category}`.toLowerCase();
    const score = terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0);
    return { entry, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.entry);
}
