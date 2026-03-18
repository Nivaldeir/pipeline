import { FileText, Search, Code, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Envie sua solicitação",
    description:
      "Preencha o formulário com os detalhes da automação ou projeto. Quanto mais informações, melhor entenderemos sua necessidade.",
  },
  {
    icon: Search,
    step: "02",
    title: "Análise da proposta",
    description:
      "Nossa equipe analisa a solicitação e entra em contato para alinhar escopo, priorização, prazo e orçamento.",
  },
  {
    icon: Code,
    step: "03",
    title: "Construção da automação",
    description:
      "Acompanhe cada etapa pelo quadro Kanban: descoberta, desenvolvimento, testes e homologação das automações.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Entrega final",
    description:
      "Automação em produção, monitorada e documentada. Suporte contínuo para ajustes e evolução.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3 sm:mb-4">
            Como funciona
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Um processo simples e transparente do início ao fim.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10 hidden lg:block rounded-full" />

          <div className="grid gap-10 sm:gap-14 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.step}
                  className={`relative flex flex-col lg:flex-row items-center gap-5 sm:gap-6 lg:gap-12 ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`flex-1 w-full text-center lg:text-left rounded-xl border border-border bg-card/50 p-5 sm:p-6 transition-shadow hover:shadow-md ${isEven ? "lg:text-right" : "lg:text-left"}`}
                  >
                    <span className="text-3xl sm:text-4xl font-bold text-primary/25 tabular-nums">
                      {step.step}
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold mt-2 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="relative z-10 flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-background">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>

                  <div className="flex-1 hidden lg:block" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
