const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export interface ScrapeResponse {
  success: boolean;
  message: string;
  metadata: {
    url: string;
    totalChunks: number;
    scrapedAt: string;
  };
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  sources: Array<{
    index: number;
    content: string;
    metadata: Record<string, unknown>;
  }>;
}

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

export async function chatWithContext(message: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to send message");
  }

  return response.json();
}
