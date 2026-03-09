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
      "Gestao fiscal, folha de pagamento, balanco, DRE e todas as obrigacoes acessorias da sua empresa.",
  },
  {
    icon: FileCheck,
    title: "Obrigacoes em Dia",
    description:
      "Geracao automatica de guias, SPED, ECF, ECD e demais declaracoes com prazo e conformidade.",
  },
  {
    icon: Bot,
    title: "Automacao com RPA",
    description:
      "Robos que automatizam tarefas repetitivas: leitura de notas, preenchimento de sistemas e validacoes.",
  },
  {
    icon: RefreshCw,
    title: "Integracao de Sistemas",
    description:
      "Conectamos seu ERP, banco, e-commerce e outros sistemas para eliminar retrabalho manual.",
  },
  {
    icon: Code,
    title: "Desenvolvimento Sob Medida",
    description:
      "Sistemas web, aplicativos mobile e APIs desenvolvidos especificamente para sua necessidade.",
  },
  {
    icon: Shield,
    title: "Seguranca e Conformidade",
    description:
      "Dados protegidos com as melhores praticas de seguranca e total conformidade com LGPD.",
  },
];

export function FeaturesSection() {
  return (
    <section id="funcionalidades" className="py-16 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center mb-12 sm:mb-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3 sm:mb-4">
            Soluções integradas para sua empresa
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Da contabilidade ao desenvolvimento de sistemas, oferecemos tudo que
            você precisa para crescer.
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
