import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";
import { retrieveContext } from "@/lib/rag";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are CricBot — an enthusiastic, knowledgeable AI cricket expert with the passion of a seasoned commentator and the depth of a cricket historian. You have extensive knowledge about cricket rules, formats (Test, ODI, T20), player statistics, tournament history, cricket terminology, and iconic moments.

INSTRUCTIONS:
- Answer ONLY cricket-related questions. If someone asks about something unrelated to cricket, politely redirect them: "That's a great question, but I'm all about cricket! 🏏 Ask me about players, rules, tournaments, or any cricketing topic!"
- Be enthusiastic and engaging — use cricket metaphors and commentary-style language when appropriate
- When you have specific facts from the knowledge base, cite them accurately
- Format responses with markdown when helpful: use **bold** for player names and key terms, bullet points for lists, and tables for statistics when comparing players
- Keep responses concise but informative — aim for 2-4 paragraphs unless the question requires a detailed breakdown
- If you're not sure about a specific stat or fact, say so rather than making one up
- Use cricket emoji sparingly: 🏏 🏆 🎯`;

function getLastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      return messages[i].parts
        .filter((p): p is { type: "text"; text: string } => p.type === "text")
        .map((p) => p.text)
        .join(" ");
    }
  }
  return "";
}

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: UIMessage[] };

  const lastUserText = getLastUserText(messages);

  let contextPrompt = "";

  if (lastUserText) {
    const relevantChunks = retrieveContext(lastUserText, 5);

    if (relevantChunks.length > 0) {
      const contextParts = relevantChunks.map(
        (chunk) =>
          `[${chunk.category.toUpperCase()}: ${chunk.title}]\n${chunk.content}`
      );

      contextPrompt = `\n\nRELEVANT KNOWLEDGE BASE CONTEXT:\n${contextParts.join("\n\n")}\n\nUse the above context to inform your response. Cite specific facts when relevant.`;
    }
  }

  const modelMessages = await convertToModelMessages(messages);

  // maxRetries: 0 — don't waste quota on retries, let the user retry manually
  const result = streamText({
    model: google("gemini-2.5-flash-lite"),
    system: SYSTEM_PROMPT + contextPrompt,
    messages: modelMessages,
    maxRetries: 0,
  });

  return result.toUIMessageStreamResponse();
}
