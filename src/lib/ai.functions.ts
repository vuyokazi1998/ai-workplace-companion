import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
  system: z.string().max(4000).optional(),
});

export const generateAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not configured." };
    }

    const messages = data.system
      ? [{ role: "system" as const, content: data.system }, ...data.messages]
      : data.messages;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages,
        }),
      });

      if (res.status === 429) {
        return { ok: false as const, error: "Rate limit reached. Please try again in a moment." };
      }
      if (res.status === 402) {
        return { ok: false as const, error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." };
      }
      if (!res.ok) {
        const t = await res.text();
        console.error("AI gateway error", res.status, t);
        return { ok: false as const, error: "The AI service returned an error." };
      }

      const json = await res.json();
      const text: string = json?.choices?.[0]?.message?.content ?? "";
      return { ok: true as const, text };
    } catch (e) {
      console.error("AI request failed", e);
      return { ok: false as const, error: "Network error contacting the AI service." };
    }
  });
