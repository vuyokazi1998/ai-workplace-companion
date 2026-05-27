import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { BookOpenText, Wand2 } from "lucide-react";
import { ToolShell } from "@/components/ToolShell";
import { AIOutput } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — WorkMind AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(generateAI);
  const [topic, setTopic] = useState("");
  const [article, setArticle] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const research = async () => {
    if (!topic.trim() && !article.trim()) return toast.error("Enter a topic or paste an article.");
    setLoading(true);
    setOutput("");
    const prompt = article.trim()
      ? `Summarize this article and provide insights & recommendations.\n\nTopic context: ${topic || "(none)"}\n\nArticle:\n${article}`
      : `Research and summarize the topic: "${topic}".`;
    const res = await run({
      data: {
        system: "You are a senior research analyst. Respond in markdown with: ## Overview, ## Key Insights (bulleted), ## Implications, ## Recommendations, ## Further Reading (suggested search queries, not fabricated URLs). Be objective; flag uncertainty where relevant.",
        messages: [{ role: "user", content: prompt }],
      },
    });
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setOutput(res.text);
  };

  return (
    <ToolShell
      title="AI Research Assistant"
      description="Summarize topics or articles into insights and recommendations."
      icon={<BookOpenText className="h-6 w-6" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="grid gap-2">
            <Label>Topic</Label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. AI adoption in mid-market SaaS" />
          </div>
          <div className="grid gap-2">
            <Label>Article text (optional)</Label>
            <Textarea
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              placeholder="Paste an article to summarize, or leave empty to research the topic."
              rows={12}
              className="font-mono text-sm"
            />
          </div>
          <Button onClick={research} disabled={loading} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Researching…" : "Run research"}
          </Button>
          <p className="text-xs text-muted-foreground">
            AI may produce inaccurate facts. Verify important claims with authoritative sources.
          </p>
        </div>
        <AIOutput value={output} onChange={setOutput} loading={loading} />
      </div>
    </ToolShell>
  );
}
