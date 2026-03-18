import Link from "next/link";
import { Button } from "@/src/shared/components/ui/button";
import { ArrowRight, Workflow, Bot, GaugeCircle } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)] opacity-40" />

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs sm:text-sm font-medium text-foreground/90 shadow-sm">
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" />
            <span className="truncate">
              TATICCA · Gestão de automações e projetos
            </span>
          </div>

          <h1 className="mb-5 sm:mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-balance leading-[1.1]">
            Organize o pipeline das{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              suas automações
            </span>
          </h1>

          <p className="mb-8 sm:mb-10 text-base text-muted-foreground sm:text-lg md:text-xl text-pretty max-w-2xl mx-auto leading-relaxed">
            Centralize demandas de RPA, integrações e desenvolvimentos em um
            único quadro Kanban. Priorize, acompanhe status e mantenha
            visibilidade de ponta a ponta sobre o ciclo de vida das automações.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Button size="lg" asChild className="shadow-lg shadow-primary/20">
              <Link href="/login" className="gap-2">
                Solicitar automação
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-2">
              <Link href="/login">Acessar painel de automações</Link>
            </Button>
          </div>
        </div>

        <div className="mt-14 sm:mt-20 grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
          {[
            {
              icon: Bot,
              title: "RPA",
              desc: "Orquestre e monitore robôs, filas e execuções",
            },
            {
              icon: Workflow,
              title: "Pipeline de demandas",
              desc: "Controle backlog, em desenvolvimento e entregues em um único fluxo",
            },
            {
              icon: GaugeCircle,
              title: "Visibilidade em tempo real",
              desc: "Acompanhe KPIs das automações e priorize o que gera mais impacto",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group flex flex-col items-center gap-3 p-6 sm:p-8 rounded-xl border border-border bg-card/80 text-center shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <span className="text-lg sm:text-xl font-bold">{title}</span>
              <span className="text-sm text-muted-foreground leading-snug">
                {desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
