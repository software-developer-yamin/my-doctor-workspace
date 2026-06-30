import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY!,
  model: "gemini-2.0-flash",
  temperature: 0.2,
});

const TRIAGE_SYSTEM = `You are a medical triage assistant for My Doctor, a Bangladeshi healthcare platform.
Gather patient symptoms, assess urgency, and recommend the right specialty.
NEVER diagnose — only triage and route.

Respond ONLY with valid JSON (no markdown):
{
  "message": "Your response to the patient",
  "symptoms": ["identified", "symptoms"],
  "urgency": "emergency|urgent|routine|unknown",
  "specialty": "Recommended specialty or null",
  "complete": true|false
}

For urgency=emergency: tell patient to call 999 or go to nearest ER immediately.`;

type Urgency = "emergency" | "urgent" | "routine" | "unknown";

const TriageState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  symptoms: Annotation<string[]>({
    reducer: (x, y) => [...new Set([...x, ...y])],
    default: () => [],
  }),
  urgency: Annotation<Urgency>({
    reducer: (_, y) => y,
    default: () => "unknown" as Urgency,
  }),
  specialty: Annotation<string | null>({
    reducer: (_, y) => y,
    default: () => null,
  }),
  complete: Annotation<boolean>({
    reducer: (_, y) => y,
    default: () => false,
  }),
});

async function collectSymptoms(
  state: typeof TriageState.State,
): Promise<Partial<typeof TriageState.State>> {
  const response = await llm.invoke([
    { role: "system", content: TRIAGE_SYSTEM },
    ...state.messages,
  ]);

  type ParsedResponse = {
    message: string;
    symptoms: string[];
    urgency: Urgency;
    specialty: string | null;
    complete: boolean;
  };

  let parsed: ParsedResponse;
  try {
    const text = response.content as string;
    const match = text.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(match![0]) as ParsedResponse;
  } catch {
    parsed = {
      message: response.content as string,
      symptoms: [],
      urgency: "unknown",
      specialty: null,
      complete: false,
    };
  }

  return {
    messages: [new AIMessage(parsed.message)],
    symptoms: parsed.symptoms,
    urgency: parsed.urgency,
    specialty: parsed.specialty,
    complete: parsed.complete,
  };
}

const workflow = new StateGraph(TriageState)
  .addNode("collect", collectSymptoms)
  .addEdge(START, "collect")
  .addConditionalEdges("collect", (s) => (s.complete ? END : "collect"));

export const triageGraph = workflow.compile();

export async function runSymptomTriage(
  userMessage: string,
  history: BaseMessage[] = [],
): Promise<{
  response: string;
  urgency: string;
  specialty: string | null;
  complete: boolean;
  symptoms: string[];
}> {
  const result = await triageGraph.invoke({
    messages: [...history, new HumanMessage(userMessage)],
  });

  const last = result.messages[result.messages.length - 1];
  return {
    response: last.content as string,
    urgency: result.urgency,
    specialty: result.specialty,
    complete: result.complete,
    symptoms: result.symptoms,
  };
}
