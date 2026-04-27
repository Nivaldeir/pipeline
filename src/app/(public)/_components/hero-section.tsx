import Link from "next/link";
import { Button } from "@/src/shared/components/ui/button";
import { ArrowRight, Workflow, Bot, GaugeCircle, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      {/* Aurora animado */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 animate-aurora opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 30%, oklch(0.55 0.18 145 / 0.12), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, oklch(0.55 0.18 220 / 0.10), transparent 60%), radial-gradient(ellipse 70% 50% at 50% -20%, oklch(0.55 0.18 145 / 0.08), transparent 60%)",
        }}
      />

      {/* Grid sutil */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)] opacity-30" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge topo */}
          <div
            className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-2 text-xs sm:text-sm font-medium text-foreground/90 shadow-sm animate-fade-up"
            style={{ animationFillMode: "both" }}
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" />
            <span className="truncate">TATICCA · Gestão de automações e projetos</span>
          </div>

          {/* Headline */}
          <h1
            className="mb-5 sm:mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-balance leading-[1.1] animate-fade-up"
            style={{ animationDelay: "80ms", animationFillMode: "both" }}
          >
            Organize o pipeline das{" "}
            <span className="bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-aurora"
              style={{ backgroundSize: "200% 200%" }}>
              suas automações
            </span>
          </h1>

          {/* Subtítulo */}
          <p
            className="mb-8 sm:mb-10 text-base text-muted-foreground sm:text-lg md:text-xl text-pretty max-w-2xl mx-auto leading-relaxed animate-fade-up"
            style={{ animationDelay: "160ms", animationFillMode: "both" }}
          >
            Centralize demandas de RPA, integrações e desenvolvimentos em um
            único quadro Kanban. Priorize, acompanhe status e mantenha
            visibilidade de ponta a ponta sobre o ciclo de vida das automações.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 animate-fade-up"
            style={{ animationDelay: "240ms", animationFillMode: "both" }}
          >
            <Button size="lg" asChild className="shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-[1.02]">
              <Link href="/login" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Solicitar automação
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-2 hover:bg-primary/5 transition-all">
              <Link href="/login">Acessar painel</Link>
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div
          className="mt-14 sm:mt-20 grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-3 animate-fade-up"
          style={{ animationDelay: "320ms", animationFillMode: "both" }}
        >
          {[
            {
              icon: Bot,
              title: "RPA",
              desc: "Orquestre e monitore robôs, filas e execuções",
              delay: "360ms",
              glow: "group-hover:shadow-primary/15",
            },
            {
              icon: Workflow,
              title: "Pipeline de demandas",
              desc: "Controle backlog, em desenvolvimento e entregues em um único fluxo",
              delay: "420ms",
              glow: "group-hover:shadow-blue-500/15",
            },
            {
              icon: GaugeCircle,
              title: "Visibilidade em tempo real",
              desc: "Acompanhe KPIs das automações e priorize o que gera mais impacto",
              delay: "480ms",
              glow: "group-hover:shadow-emerald-500/15",
            },
          ].map(({ icon: Icon, title, desc, delay, glow }) => (
            <div
              key={title}
              className={[
                "group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-xl",
                "border border-border bg-card/80 text-center",
                "shadow-sm transition-all duration-300",
                "hover:border-primary/30 hover:-translate-y-1 hover:shadow-lg",
                glow,
                "animate-fade-up",
              ].join(" ")}
              style={{ animationDelay: delay, animationFillMode: "both" }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110 animate-float">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <span className="text-lg sm:text-xl font-bold">{title}</span>
              <span className="text-sm text-muted-foreground leading-snug">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
