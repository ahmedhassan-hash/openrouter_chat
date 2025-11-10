export interface TokenUsage {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
}

export interface Source {
  index: number;
  content: string;
  metadata: {
    source?: string;
    [key: string]: unknown;
  };
}

export interface ToolCall {
  tool: string;
  query?: string;
  results?: {
    results: unknown[];
    answer?: string;
  };
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  sources?: Source[];
  mode: "simple" | "rag";
  toolCalls?: ToolCall[];
}

export interface StreamEvent {
  type:
    | "status"
    | "searching_rag"
    | "found_documents"
    | "tool_call"
    | "token"
    | "usage"
    | "complete"
    | "error";
  content?: string;
  data?: {
    answer?: string;
    sources?: Source[];
    mode?: "simple" | "rag";
    count?: number;
    tool?: string;
    query?: string;
    results?: unknown;
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
    usage?: TokenUsage;
  };
}

export interface ChatRequest {
  message: string;
  mode?: "simple" | "rag";
  enableWebSearch?: boolean;
}

export interface ScrapeResponse {
  success: boolean;
  message: string;
  metadata: {
    url: string;
    totalChunks: number;
    scrapedAt: string;
  };
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  isStreaming?: boolean;
  usage?: TokenUsage;
}

export type ChatMode = "simple" | "rag";
