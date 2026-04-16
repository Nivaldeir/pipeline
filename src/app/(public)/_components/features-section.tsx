import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";  
import {
  Calculator,
  Bot,
  Code,
  FileCheck,
  RefreshCw,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Calculator,
    title: "Contabilidade Completa",
    description:
      "Gestão fiscal, folha de pagamento, balanço, DRE e todas as obrigações acessórias da sua empresa.",
  },
  {
    icon: FileCheck,
    title: "Obrigações em Dia",
    description:
      "Geração automática de guias, SPED, ECF, ECD e demais declarações com prazo e conformidade.",
  },
  {
    icon: Bot,
    title: "Automação com RPA",
    description:
      "Robôs que automatizam tarefas repetitivas: leitura de notas, preenchimento de sistemas e validações.",
  },
  {
    icon: RefreshCw,
    title: "Integração de Sistemas",
    description:
      "Conectamos seu ERP, bancos, e-commerces e outros sistemas para eliminar retrabalho manual.",
  },
  {
    icon: Code,
    title: "Desenvolvimento Sob Medida",
    description:
      "Sistemas web, aplicativos mobile e APIs desenvolvidos especificamente para sua necessidade.",
  },
  {
    icon: Shield,
    title: "Segurança e Conformidade",
    description:
      "Dados protegidos com as melhores práticas de segurança e total conformidade com a LGPD.",
  },
];

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl sm:mb-4">
            Tudo o que você precisa para gerir automações
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Da identificação da demanda até a operação em produção, o Pipeline
            ajuda sua equipe a organizar, priorizar e acompanhar automações,
            integrações e projetos relacionados.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group bg-card border-border transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
              >
                <CardHeader className="space-y-3">
                  <div className="mb-1 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
