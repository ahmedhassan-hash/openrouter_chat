import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": window.location.origin,
    "X-Title": "OpenRouter Chat App",
  },
  dangerouslyAllowBrowser: true,
});

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  messages: Message[];
}

export async function sendChatMessage(
  options: ChatCompletionOptions
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: options.model || "minimax/minimax-m2:free",
      messages: options.messages,
    });

    return completion.choices[0]?.message?.content || "No response received";
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to send message"
    );
  }
}

export default openai;
