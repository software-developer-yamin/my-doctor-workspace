import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import mongoose from "mongoose";

let _vectorStore: MongoDBAtlasVectorSearch | null = null;

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "text-embedding-004",
});

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "gemini-2.0-flash",
  temperature: 0.3,
});

type LangchainCollection = ConstructorParameters<typeof MongoDBAtlasVectorSearch>[1]["collection"];

async function getVectorStore(): Promise<MongoDBAtlasVectorSearch> {
  if (_vectorStore) return _vectorStore;
  // Cast through unknown: mongoose uses mongodb@7, @langchain/mongodb expects mongodb@6.
  // Structurally identical at runtime — the version mismatch is types-only.
  const collection = mongoose.connection.collection("doctors") as unknown as LangchainCollection;
  _vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "doctor_vector_index",
    textKey: "embedding_text",
    embeddingKey: "embedding",
  });
  return _vectorStore;
}

export async function recommendDoctors(
  query: string,
  limit = 5,
): Promise<Array<{ doctor: Record<string, unknown>; score: number }>> {
  const store = await getVectorStore();
  const results = await store.similaritySearchWithScore(query, limit);
  return results.map(([doc, score]) => ({ doctor: doc.metadata, score }));
}

export async function explainRecommendation(
  query: string,
  doctorProfile: Record<string, unknown>,
): Promise<string> {
  const response = await llm.invoke([
    {
      role: "system",
      content:
        "You are a medical assistant helping patients find the right doctor in Bangladesh. Be concise, empathetic, and accurate. Never diagnose.",
    },
    {
      role: "user",
      content: `Patient query: "${query}"\n\nDoctor profile:\n${JSON.stringify(doctorProfile, null, 2)}\n\nExplain why this doctor is a good match in 2-3 sentences.`,
    },
  ]);
  return response.content as string;
}
