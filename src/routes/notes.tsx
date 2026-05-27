import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { NotebookPen, Wand2 } from "lucide-react";
import { ToolShell } from "@/components/ToolShell";
import { AIOutput } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/notes")({
  head: () => ({ meta: [{ title: "Notes Summarizer — WorkMind AI" }] }),
  component: NotesPage,
});

function NotesPage() {
  const run = useServerFn(generateAI);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    if (notes.trim().length < 20) return toast.error("Paste your meeting notes first.");
    setLoading(true);
    setOutput("");
    const res = await run({
      data: {
        system: "You are an executive assistant that summarizes meeting notes. Always respond in markdown with these sections in order: ## Summary, ## Key Decisions, ## Action Items (table with columns: Task, Owner, Deadline), ## Open Questions. Be concise and faithful to the source.",
        messages: [{ role: "user", content: `Summarize the following meeting notes:\n\n${notes}` }],
      },
    });
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setOutput(res.text);
  };

  return (
    <ToolShell
      title="Meeting Notes Summarizer"
      description="Turn long meeting notes into a crisp summary with action items and deadlines."
      icon={<NotebookPen className="h-6 w-6" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="grid gap-2">
            <Label>Meeting notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste raw meeting notes or a transcript here…"
              rows={16}
              className="font-mono text-sm"
            />
          </div>
          <Button onClick={summarize} disabled={loading} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Summarizing…" : "Summarize notes"}
          </Button>
        </div>
        <AIOutput value={output} onChange={setOutput} loading={loading} />
      </div>
    </ToolShell>
  );
}
