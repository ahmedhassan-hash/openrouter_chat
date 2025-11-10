import type {
  ScrapeResponse,
  ChatResponse,
  ChatRequest,
  StreamEvent,
} from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export async function scrapeUrl(url: string): Promise<ScrapeResponse> {
  const response = await fetch(`${API_BASE_URL}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to scrape URL");
  }

  return response.json();
}

export async function chatWithContext(
  message: string,
  mode: "simple" | "rag" = "simple",
  enableWebSearch: boolean = false
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, mode, enableWebSearch }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send message");
  }

  return response.json();
}

export async function* streamChat(
  request: ChatRequest
): AsyncGenerator<StreamEvent> {
  const response = await fetch(`${API_BASE_URL}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            return;
          }

          try {
            const event: StreamEvent = JSON.parse(data);
            yield event;
          } catch (e) {
            console.debug("Parse error (ignored):", e);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
