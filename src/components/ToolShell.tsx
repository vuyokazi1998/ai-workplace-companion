import { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export function ToolShell({ title, description, icon, children }: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
      <header className="mb-8 flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-primary-foreground"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
        >
          {icon}
        </div>
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">{description}</p>
        </div>
      </header>
      {children}
    </div>
  );
}
