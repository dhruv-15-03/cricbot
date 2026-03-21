import knowledgeData from "@/data/cricket-knowledge.json";

interface KnowledgeChunk {
  id: string;
  category: string;
  title: string;
  content: string;
}

export interface RetrievedChunk {
  id: string;
  category: string;
  title: string;
  content: string;
  score: number;
}

const chunks: KnowledgeChunk[] = knowledgeData as KnowledgeChunk[];

// Common words to ignore during matching
const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above",
  "below", "between", "out", "off", "over", "under", "again",
  "further", "then", "once", "here", "there", "when", "where",
  "why", "how", "all", "both", "each", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own",
  "same", "so", "than", "too", "very", "just", "because", "but",
  "and", "or", "if", "while", "about", "what", "which", "who",
  "whom", "this", "that", "these", "those", "am", "it", "its",
  "he", "she", "they", "them", "his", "her", "my", "your", "me",
  "i", "we", "you", "tell", "explain", "describe", "give", "show",
  "best", "ever", "many", "much", "also", "get", "got", "know",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Keyword-based retrieval using TF-IDF-like scoring.
 * No API calls needed — runs entirely in-memory.
 */
export function retrieveContext(
  query: string,
  topK: number = 5
): RetrievedChunk[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  // Count document frequency for each token
  const docFreq = new Map<string, number>();
  const chunkTokenSets = chunks.map((chunk) => {
    const tokens = new Set(tokenize(`${chunk.title} ${chunk.content}`));
    for (const t of tokens) {
      docFreq.set(t, (docFreq.get(t) || 0) + 1);
    }
    return tokens;
  });

  const totalDocs = chunks.length;

  const scored = chunks.map((chunk, idx) => {
    const chunkTokens = chunkTokenSets[idx];
    const chunkText = `${chunk.title} ${chunk.content}`.toLowerCase();

    let score = 0;
    for (const qt of queryTokens) {
      if (chunkTokens.has(qt)) {
        // IDF weighting: rarer terms score higher
        const df = docFreq.get(qt) || 1;
        const idf = Math.log(totalDocs / df);
        score += idf;

        // Boost for title matches
        if (chunk.title.toLowerCase().includes(qt)) {
          score += idf * 0.5;
        }
      }

      // Bonus for multi-word phrase matches
      if (qt.length > 3 && chunkText.includes(qt)) {
        score += 0.5;
      }
    }

    // Normalize by query length to get a 0-1 range
    const maxPossibleScore = queryTokens.length * Math.log(totalDocs);
    const normalizedScore = maxPossibleScore > 0 ? score / maxPossibleScore : 0;

    return {
      id: chunk.id,
      category: chunk.category,
      title: chunk.title,
      content: chunk.content,
      score: normalizedScore,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).filter((c) => c.score > 0.05);
}
