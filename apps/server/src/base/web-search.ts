import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "gemini-2.0-flash",
  temperature: 0.2,
});

interface BraveWebResult {
  title: string;
  description: string;
  url: string;
}

interface BraveResponse {
  web?: { results?: BraveWebResult[] };
}

export async function searchHealthInfo(query: string, count = 5): Promise<string> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) throw new Error("BRAVE_SEARCH_API_KEY not configured");

  const params = new URLSearchParams({ q: query, count: String(count) });
  const resp = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": apiKey,
    },
  });

  if (!resp.ok) throw new Error(`Brave Search error: ${resp.status}`);

  const data = (await resp.json()) as BraveResponse;
  const results = data.web?.results?.slice(0, count) ?? [];

  if (!results.length) return "No relevant search results found for this query.";

  const context = results
    .map((r) => `**${r.title}**\n${r.description}\nSource: ${r.url}`)
    .join("\n\n---\n\n");

  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You summarize medical and health search results into a clear, accurate, concise response. Cite sources. Never diagnose or replace professional medical advice.",
    },
    {
      role: "user",
      content: `Query: "${query}"\n\nSearch results:\n${context}\n\nSummarize in 3-5 sentences, noting the most relevant points.`,
    },
  ]);

  return response.content as string;
}
