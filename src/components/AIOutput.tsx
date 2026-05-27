import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, Pencil, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  value: string;
  onChange: (v: string) => void;
  loading?: boolean;
  placeholder?: string;
  minHeight?: number;
}

export function AIOutput({ value, onChange, loading, placeholder = "Your AI output will appear here.", minHeight = 320 }: Props) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (value && mode === "edit") return;
  }, [value, mode]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">AI Output</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setMode(mode === "preview" ? "edit" : "preview")} disabled={!value}>
            {mode === "preview" ? <Pencil className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="ml-1.5 hidden sm:inline">{mode === "preview" ? "Edit" : "Preview"}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={copy} disabled={!value}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="ml-1.5 hidden sm:inline">Copy</span>
          </Button>
        </div>
      </div>
      <div className="p-4" style={{ minHeight }}>
        {loading && !value ? (
          <div className="space-y-3">
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-full animate-pulse rounded bg-muted" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        ) : mode === "edit" ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[280px] resize-y border-0 p-0 shadow-none focus-visible:ring-0"
          />
        ) : value ? (
          <article className="prose prose-sm max-w-none prose-headings:font-display prose-headings:tracking-tight prose-p:leading-relaxed">
            <ReactMarkdown>{value}</ReactMarkdown>
          </article>
        ) : (
          <p className="text-sm text-muted-foreground">{placeholder}</p>
        )}
      </div>
    </div>
  );
}
