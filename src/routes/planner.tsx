import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { CalendarCheck2, Wand2 } from "lucide-react";
import { ToolShell } from "@/components/ToolShell";
import { AIOutput } from "@/components/AIOutput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateAI } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Task Planner — WorkMind AI" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(generateAI);
  const [tasks, setTasks] = useState("");
  const [range, setRange] = useState("day");
  const [hours, setHours] = useState("8");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const plan = async () => {
    if (!tasks.trim()) return toast.error("List your tasks first.");
    setLoading(true);
    setOutput("");
    const res = await run({
      data: {
        system: "You are a productivity coach. Build realistic, prioritized schedules using the Eisenhower matrix and time-boxing. Return markdown with a brief intro, a time-blocked schedule table (Time, Task, Priority, Notes), and a short ## Tips section. Prioritize impact over urgency when reasonable.",
        messages: [{
          role: "user",
          content: `Plan my ${range === "day" ? "day" : "week"}.
Available working hours per day: ${hours}
Tasks and context:
${tasks}`,
        }],
      },
    });
    setLoading(false);
    if (!res.ok) return toast.error(res.error);
    setOutput(res.text);
  };

  return (
    <ToolShell
      title="AI Task Planner"
      description="Generate a prioritized, time-blocked schedule from your task list."
      icon={<CalendarCheck2 className="h-6 w-6" />}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Plan range</Label>
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Hours / day</Label>
              <Select value={hours} onValueChange={setHours}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["4","6","8","10"].map(h => <SelectItem key={h} value={h}>{h} hours</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Your tasks</Label>
            <Textarea
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"e.g.\n- Finish Q3 report (due Friday)\n- 1:1 with manager\n- Review 3 PRs\n- Prep client demo"}
              rows={12}
              className="font-mono text-sm"
            />
          </div>
          <Button onClick={plan} disabled={loading} className="w-full">
            <Wand2 className="mr-2 h-4 w-4" />
            {loading ? "Planning…" : "Generate plan"}
          </Button>
        </div>
        <AIOutput value={output} onChange={setOutput} loading={loading} />
      </div>
    </ToolShell>
  );
}
