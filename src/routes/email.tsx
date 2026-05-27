import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Mail, Wand2 } from "lucide-react";
import { ToolShell } from "@/components/ToolShell";
import { AIOutput } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email Generator — WorkMind AI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateAI);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("formal");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!context.trim()) return toast.error("Please describe what the email is about.");
    setLoading(true);
    setOutput("");
    const res = await run({
      data: {
        system: "You are an expert workplace communication assistant. Write clear, well-structured professional emails. Return only the email (subject line, greeting, body, sign-off) in markdown.",
        messages: [{
          role: "user",
          content: `Write a professional email.
Tone: ${tone}
Recipient: ${recipient || "(unspecified)"}
Subject hint: ${subject || "(generate one)"}
Context / what to say:
${context}`,
        }],
      },
    });
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setOutput(res.text);
  };

  return (
    <ToolShell
      title="Smart Email Generator"
      description="Draft polished, on-tone emails in seconds."
      icon={<Mail className="h-6 w-6" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="grid gap-2">
            <Label>Recipient (optional)</Label>
            <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. Sarah, my manager" />
          </div>
          <div className="grid gap-2">
            <Label>Subject hint (optional)</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Project update, request for time off" />
          </div>
          <div className="grid gap-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="persuasive">Persuasive</SelectItem>
                <SelectItem value="apologetic">Apologetic</SelectItem>
                <SelectItem value="concise">Concise &amp; direct</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>What should the email say?</Label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Briefly describe the purpose, key points, and any details to include."
              rows={8}
            />
          </div>
          <Button onClick={generate} disabled={loading} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Generating…" : "Generate email"}
          </Button>
        </div>
        <AIOutput value={output} onChange={setOutput} loading={loading} placeholder="Your drafted email will appear here. You can switch to Edit to refine it." />
      </div>
    </ToolShell>
  );
}
