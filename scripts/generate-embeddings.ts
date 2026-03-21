import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import * as path from "path";

// Load .env.local since this script runs outside Next.js
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        process.env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
      }
    }
  }
}

interface KnowledgeChunk {
  id: string;
  category: string;
  title: string;
  content: string;
}

interface EmbeddedChunk {
  id: string;
  category: string;
  title: string;
  content: string;
  embedding: number[];
}

const EMBEDDING_MODEL = "gemini-embedding-001";
const BATCH_SIZE = 5;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error(
      "Error: GOOGLE_GENERATIVE_AI_API_KEY environment variable is required."
    );
    console.error("Set it in your .env.local file or export it in your shell.");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  const knowledgePath = path.join(
    __dirname,
    "..",
    "src",
    "data",
    "cricket-knowledge.json"
  );
  const outputPath = path.join(
    __dirname,
    "..",
    "src",
    "data",
    "cricket-embeddings.json"
  );

  console.log(`Reading knowledge base from: ${knowledgePath}`);
  const chunks: KnowledgeChunk[] = JSON.parse(
    fs.readFileSync(knowledgePath, "utf-8")
  );
  console.log(`Found ${chunks.length} chunks to embed.\n`);

  const embeddedChunks: EmbeddedChunk[] = [];

  // Process in batches to avoid rate limits
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    console.log(
      `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)} (chunks ${i + 1}-${Math.min(i + BATCH_SIZE, chunks.length)})...`
    );

    const results = await Promise.all(
      batch.map(async (chunk) => {
        const textToEmbed = `${chunk.title}: ${chunk.content}`;
        const response = await ai.models.embedContent({
          model: EMBEDDING_MODEL,
          contents: textToEmbed,
        });

        return {
          id: chunk.id,
          category: chunk.category,
          title: chunk.title,
          content: chunk.content,
          embedding: response.embeddings?.[0]?.values ?? [],
        };
      })
    );

    embeddedChunks.push(...results);

    // Rate limit: wait between batches
    if (i + BATCH_SIZE < chunks.length) {
      await sleep(1000);
    }
  }

  console.log(`\nGenerated embeddings for ${embeddedChunks.length} chunks.`);
  console.log(
    `Embedding dimension: ${embeddedChunks[0]?.embedding.length ?? 0}`
  );

  fs.writeFileSync(outputPath, JSON.stringify(embeddedChunks, null, 2));
  console.log(`Saved to: ${outputPath}`);
}

main().catch(console.error);
