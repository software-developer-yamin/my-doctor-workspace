---
name: new-langchain-pipeline
description: Scaffold a new AI pipeline in apps/server/src/base/. Triggers on "add an AI feature", "create a LangChain pipeline", "add a new AI endpoint", "build a LangGraph agent". Four variants match the four existing pipelines. Never put LangChain code in modules/ or outside src/base/.
metadata:
  priority: 8
  pathPatterns:
    - "apps/server/src/base/**"
    - "apps/server/src/modules/ai/**"
---

# New LangChain Pipeline — My Doctor Backend

All AI code lives in `apps/server/src/base/`. Never import LangChain in `modules/` directly — wire AI calls through `src/base/*.ts` and expose them via the `modules/ai/` module.

## Four existing variants — pick the closest match

| File | Pattern | When to use |
|------|---------|-------------|
| `doctor-recommendation.ts` | Vector Search + Gemini | Semantic similarity search over MongoDB Atlas |
| `symptom-triage.ts` | LangGraph stateful agent | Multi-step reasoning with state machine |
| `conversational-ai.ts` | LangChain chain + chat memory | Conversational Q&A with session history |
| `web-search.ts` | Brave Search + Gemini summarization | Real-time web context + LLM synthesis |

## Shared setup (all variants)

```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "gemini-2.0-flash",
  temperature: 0.2,
});
```

## Variant 1: Vector Search (like `doctor-recommendation.ts`)

Use when: semantic search over existing MongoDB collection.

```typescript
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoClient } from "mongodb";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "text-embedding-004",
});

export async function searchByEmbedding(query: string, topK = 5) {
  const client = new MongoClient(process.env.MONGODB_URI!);
  const collection = client.db(process.env.DB_NAME).collection("your-collection");

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection: collection as unknown as LangchainCollection,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding",
  });

  const results = await vectorStore.similaritySearch(query, topK);
  await client.close();
  return results;
}
```

Important: Cast `collection` as `unknown as LangchainCollection` — the LangChain MongoDB adapter type is stricter than the raw MongoDB driver type.

## Variant 2: LangGraph Agent (like `symptom-triage.ts`)

Use when: multi-step decision trees, tool use, or conditional branching.

```typescript
import { StateGraph, END } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";

interface AgentState {
  messages: HumanMessage[];
  result?: string;
}

const graph = new StateGraph<AgentState>({
  channels: {
    messages: { value: (x, y) => x.concat(y), default: () => [] },
    result: { value: (x, y) => y ?? x, default: () => undefined },
  },
});

graph.addNode("analyze", async (state) => {
  const response = await llm.invoke(state.messages);
  return { result: response.content as string };
});

graph.setEntryPoint("analyze");
graph.addEdge("analyze", END);

const app = graph.compile();

export async function runAgent(input: string) {
  const result = await app.invoke({
    messages: [new HumanMessage(input)],
  });
  return result.result;
}
```

## Variant 3: Conversational Chain (like `conversational-ai.ts`)

Use when: stateful chat sessions keyed by user/session ID.

```typescript
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

const sessions = new Map<string, InMemoryChatMessageHistory>();

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful medical assistant for My Doctor platform."],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

const chain = prompt.pipe(llm);

const withHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: (sessionId: string) => {
    if (!sessions.has(sessionId)) sessions.set(sessionId, new InMemoryChatMessageHistory());
    return sessions.get(sessionId)!;
  },
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

export async function chat(sessionId: string, message: string) {
  const response = await withHistory.invoke(
    { input: message },
    { configurable: { sessionId } }
  );
  return response.content as string;
}
```

## Variant 4: Web Search + Synthesis (like `web-search.ts`)

Use when: real-time information retrieval before LLM response.

```typescript
export async function searchAndSummarize(query: string): Promise<string> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) throw new Error("BRAVE_SEARCH_API_KEY not configured");

  const params = new URLSearchParams({ q: query, count: "5" });
  const resp = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": apiKey,
    },
  });

  if (!resp.ok) throw new Error(`Brave Search error: ${resp.status}`);

  const data = await resp.json();
  const results = data.web?.results?.slice(0, 5) ?? [];
  const context = results
    .map((r: { title: string; description: string; url: string }) =>
      `**${r.title}**\n${r.description}\nSource: ${r.url}`
    )
    .join("\n\n---\n\n");

  const response = await llm.invoke([
    { role: "system", content: "Summarize these results accurately. Cite sources." },
    { role: "user", content: `Query: ${query}\n\nResults:\n${context}` },
  ]);

  return response.content as string;
}
```

## Wiring into `modules/ai/`

After creating `src/base/your-feature.ts`, expose it via the AI module:

```typescript
// modules/ai/AI.controller.ts — add new handler
export const YourFeature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await yourFeatureFunction(req.body.query);
    return sendResponse(res, { result: data });
  } catch (e) {
    next(e);
  }
};

// modules/ai/AI.routes.ts — add new route
router.post('/your-feature', verifyAccessToken, YourFeatureController);
```

## Rules

- All AI code in `src/base/` — never in `modules/`
- Env vars accessed via `process.env.*` directly (validated in `src/config/env.ts`)
- Google Gemini model: `gemini-2.0-flash` (default), `gemini-2.0-flash-thinking-exp` for reasoning
- Embeddings model: `text-embedding-004`
- Use `as unknown as LangchainCollection` cast for MongoDB Atlas vector store collection type
- Never `console.log` in production paths — use `logger` from `utils/logger.js`
