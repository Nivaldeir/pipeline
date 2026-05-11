"use client";

import { useState } from "react";
import { cn } from "@/shared/utils";
import { type LucideIcon } from "lucide-react";

export type SettingsSection = {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  content: React.ReactNode;
};

type Props = {
  title: string;
  description?: string;
  sections: SettingsSection[];
  defaultSectionId?: string;
};

export function SettingsLayout({
  title,
  description,
  sections,
  defaultSectionId,
}: Props) {
  const [activeId, setActiveId] = useState<string>(
    defaultSectionId ?? sections[0]?.id ?? ""
  );
  const active = sections.find((s) => s.id === activeId) ?? sections[0];

  if (!active) return null;

  return (
    <div className="space-y-6 min-w-0">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav
          aria-label="Seções de configurações"
          className="lg:sticky lg:top-6 lg:self-start"
        >
          <div className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === active.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors lg:w-full lg:shrink",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <section
          key={active.id}
          aria-labelledby={`section-${active.id}`}
          className="min-w-0 space-y-1"
        >
          <header className="border-b border-border pb-4 mb-6">
            <h2
              id={`section-${active.id}`}
              className="text-lg font-semibold text-foreground"
            >
              {active.label}
            </h2>
            {active.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {active.description}
              </p>
            )}
          </header>
          <div>{active.content}</div>
        </section>
      </div>
    </div>
  );
}
