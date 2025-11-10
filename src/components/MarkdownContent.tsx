import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const languageMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    rb: "ruby",
    sh: "bash",
    yml: "yaml",
  };

  const displayLanguage = languageMap[language] || language || "text";

  return (
    <div className="relative group">
      {displayLanguage !== "text" && (
        <div className="absolute top-2 left-3 text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
          {displayLanguage}
        </div>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-muted hover:bg-muted/80"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>

      <SyntaxHighlighter
        style={oneDark}
        language={displayLanguage}
        PreTag="div"
        className="rounded-md my-2 text-xs sm:text-sm !bg-[#282c34] overflow-x-auto"
        customStyle={{
          margin: "0.5rem 0",
          padding: "1rem",
          paddingTop: displayLanguage !== "text" ? "2.5rem" : "1rem",
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
        }}
        wrapLines={false}
        wrapLongLines={false}
        showLineNumbers={code.split("\n").length > 3}
        lineNumberStyle={{
          minWidth: "2.5em",
          paddingRight: "1em",
          color: "#6c6f85",
          userSelect: "none",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-lg sm:text-xl font-bold mt-4 mb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base sm:text-lg font-bold mt-3 mb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-semibold mt-2 mb-1">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-semibold mt-2 mb-1">{children}</h4>
          ),

          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
          ),

          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              {children}
            </a>
          ),

          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const codeString = String(children).replace(/\n$/, "");

            if (!className) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono break-words">
                  {children}
                </code>
              );
            }

            return <CodeBlock language={language} code={codeString} />;
          },

          pre: ({ children }: { children?: ReactNode }) => <>{children}</>,

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 my-2 italic text-muted-foreground">
              {children}
            </blockquote>
          ),

          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),

          em: ({ children }) => <em className="italic">{children}</em>,

          hr: () => <hr className="my-4 border-border" />,

          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full border-collapse border border-border text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-border">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="border border-border px-3 py-2 text-left font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
