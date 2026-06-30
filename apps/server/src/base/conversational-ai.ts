import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const SYSTEM_PROMPT = `You are a helpful health assistant for My Doctor, a Bangladeshi healthcare platform.
Help patients:
- Understand medical information in plain language
- Navigate the platform (book appointments, find doctors, check prescriptions)
- Answer general health and wellness questions
- Learn about available services

You do NOT diagnose, prescribe, or replace professional medical advice.
Always recommend consulting a qualified doctor for specific medical concerns.
Be concise, warm, and culturally sensitive to Bangladeshi patients.`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_PROMPT],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "gemini-2.0-flash",
  temperature: 0.7,
});

const chain = prompt.pipe(llm);

const sessions = new Map<string, InMemoryChatMessageHistory>();
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour

function getHistory(sessionId: string): InMemoryChatMessageHistory {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, new InMemoryChatMessageHistory());
    setTimeout(() => sessions.delete(sessionId), SESSION_TTL_MS);
  }
  return sessions.get(sessionId)!;
}

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: getHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

export async function chat(sessionId: string, message: string): Promise<string> {
  const response = await chainWithHistory.invoke(
    { input: message },
    { configurable: { sessionId } },
  );
  return response.content as string;
}

export function clearSession(sessionId: string): void {
  sessions.delete(sessionId);
}

export function getActiveSessions(): number {
  return sessions.size;
}
