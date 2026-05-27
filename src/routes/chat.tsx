import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessagesSquare, Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — WorkMind AI" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const run = useServerFn(generateAI);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your workplace AI assistant. Ask me to draft an email, plan your day, summarize a doc, or anything else." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    const res = await run({
      data: {
        system: "You are WorkMind, a helpful, concise, professional workplace AI assistant. Respond in markdown when formatting helps.",
        messages: next,
      },
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    setMessages([...next, { role: "assistant", content: res.text }]);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-full max-w-4xl flex-col px-4 py-6 md:px-8">
      <header className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}>
          <MessagesSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">AI Chatbot</h1>
          <p className="text-sm text-muted-foreground">Your always-on workplace copilot.</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto rounded-xl border bg-card p-4 shadow-sm">
        <div className="space-y-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-secondary" : "text-white"}`}
                style={m.role === "assistant" ? { background: "var(--gradient-primary)" } : undefined}
              >
                {m.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {m.role === "assistant" ? (
                  <article className="prose prose-sm max-w-none prose-p:my-2 prose-headings:font-display">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </article>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full text-white" style={{ background: "var(--gradient-primary)" }}>
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      <div className="mt-3 rounded-xl border bg-card p-3 shadow-sm">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask anything… (Enter to send, Shift+Enter for newline)"
          rows={2}
          className="resize-none border-0 p-2 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">AI may produce inaccurate information. Verify before relying on it.</p>
          <Button onClick={send} disabled={loading || !input.trim()} size="sm">
            <Send className="mr-1.5 h-4 w-4" /> Send
          </Button>
        </div>
      </div>
    </div>
  );
}
