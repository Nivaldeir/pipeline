"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/context/auth-context";
import { useProjects } from "@/shared/context/projects-context";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { Label } from "@/src/shared/components/ui/label";
import { Checkbox } from "@/src/shared/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card";
import { useToast } from "@/src/shared/hooks/use-toast";
import { ArrowLeft, Send, HelpCircle, Plus, X } from "lucide-react";
import { Badge } from "@/src/shared/components/ui/badge";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/shared/components/ui/tooltip";

const PROJECT_TYPES = [
  // Contabilidade
  { value: "contabil-fiscal", label: "Contabilidade - Gestao Fiscal" },
  { value: "contabil-folha", label: "Contabilidade - Folha de Pagamento" },
  { value: "contabil-balanco", label: "Contabilidade - Balanco e DRE" },
  { value: "contabil-obrigacoes", label: "Contabilidade - Obrigacoes Acessorias" },
  { value: "contabil-consultoria", label: "Contabilidade - Consultoria" },
  // RPA
  { value: "rpa-automacao", label: "RPA - Automacao de Processos" },
  { value: "rpa-integracao", label: "RPA - Integracao de Sistemas" },
  { value: "rpa-extracao", label: "RPA - Extracao de Dados" },
  { value: "rpa-relatorios", label: "RPA - Geracao de Relatorios" },
  { value: "rpa-validacao", label: "RPA - Validacao e Conferencia" },
  // Desenvolvimento
  { value: "dev-sistema-web", label: "Desenvolvimento - Sistema Web / SaaS" },
  { value: "dev-app-mobile", label: "Desenvolvimento - Aplicativo Mobile" },
  { value: "dev-api", label: "Desenvolvimento - API / Backend" },
  { value: "dev-website", label: "Desenvolvimento - Website / Landing Page" },
  { value: "dev-portal", label: "Desenvolvimento - Portal / Intranet" },
  { value: "dev-manutencao", label: "Desenvolvimento - Manutencao / Melhorias" },
  { value: "dev-integracao", label: "Desenvolvimento - Integracao de Sistemas" },
  // Outros
  { value: "consultoria", label: "Consultoria Tecnica" },
  { value: "outro", label: "Outro" },
];

const PLATFORMS = [
  { value: "web", label: "Web (Desktop e Mobile)" },
  { value: "ios", label: "iOS (iPhone/iPad)" },
  { value: "android", label: "Android" },
  { value: "ambos-mobile", label: "iOS e Android" },
  { value: "desktop", label: "Desktop (Windows/Mac)" },
  { value: "todas", label: "Todas as plataformas" },
];

const URGENCY_LEVELS = [
  { value: "baixa", label: "Baixa - Sem pressa definida" },
  { value: "media", label: "Média - Próximos 2-3 meses" },
  { value: "alta", label: "Alta - Próximo mês" },
  { value: "urgente", label: "Urgente - O mais rápido possível" },
];

const TARGET_AUDIENCES = [
  { value: "b2b", label: "Empresas (B2B)" },
  { value: "b2c", label: "Consumidores finais (B2C)" },
  { value: "interno", label: "Uso interno da empresa" },
  { value: "ambos", label: "Empresas e consumidores" },
];

const FEATURE_SUGGESTIONS = [
  // Contabilidade
  "Emissao de notas fiscais",
  "Calculo de impostos automatico",
  "Conciliacao bancaria",
  "Controle de contas a pagar/receber",
  "Geracao de guias (DARF, GPS, DAS)",
  "Balancete e DRE automatizado",
  // RPA
  "Leitura de XMLs/NFes",
  "Preenchimento automatico de sistemas",
  "Extracao de dados de PDFs",
  "Envio automatico de emails",
  "Validacao de cadastros",
  "Integracao com ERP",
  // Desenvolvimento
  "Login / Cadastro de usuarios",
  "Dashboard / Painel administrativo",
  "Relatorios e graficos",
  "Notificacoes (email/push)",
  "Upload de arquivos",
  "Integracao com APIs externas",
  "Exportacao de dados (PDF/Excel)",
  "Controle de permissoes/usuarios",
];

const DESIGN_PREFERENCES = [
  { value: "moderno", label: "Moderno e minimalista" },
  { value: "corporativo", label: "Corporativo e profissional" },
  { value: "criativo", label: "Criativo e ousado" },
  { value: "classico", label: "Clássico e tradicional" },
  { value: "tenho-identidade", label: "Já tenho identidade visual" },
  { value: "a-definir", label: "Preciso de ajuda para definir" },
];

export default function SolicitarProjetoPage() {
  const { user } = useAuth();
  const { addProject } = useProjects();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    platform: "",
    description: "",
    targetAudience: "",
    expectedUsers: "",
    features: [] as string[],
    hasExistingSystem: "",
    existingSystemDetails: "",
    benefits: [] as string[],
    benefitsDetails: "",
    projectNarrative: "",
    urgency: "",
    deadline: "",
    additionalInfo: "",
  });
  const [newFeature, setNewFeature] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleAddFeature(feature: string) {
    const trimmed = feature.trim();
    if (trimmed && !formData.features.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, trimmed],
      }));
    }
    setNewFeature("");
  }

  function handleRemoveFeature(feature: string) {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature(newFeature);
    }
  }

  function handleToggleBenefit(key: string, checked: boolean | "indeterminate") {
    const isChecked = checked === true;
    setFormData((prev) => ({
      ...prev,
      benefits: isChecked
        ? [...prev.benefits, key]
        : prev.benefits.filter((b) => b !== key),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Faça login para solicitar um projeto.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.title || !formData.type || !formData.description) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addProject({
        title: formData.title,
        description: formData.description,
        clientId: user.id,
        status: "backlog",
        priority:
          formData.urgency === "urgente"
            ? "urgent"
            : formData.urgency === "alta"
              ? "high"
              : formData.urgency === "baixa"
                ? "low"
                : "medium",
        projectType: formData.type || "Outro",
      });

      toast({
        title: "Solicitação enviada!",
        description:
          "Seu projeto foi criado e está no backlog. Você pode acompanhar o andamento na página Meus Projetos.",
      });
      router.push("/cliente");
    } catch {
      toast({
        title: "Erro ao salvar",
        description:
          "Não foi possível criar o projeto. Tente novamente ou entre em contato.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 max-w-3xl mx-auto pb-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/cliente">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Solicitar Novo Projeto</h1>
            <p className="text-muted-foreground">
              Quanto mais detalhes, melhor conseguimos entender suas necessidades
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informacoes Basicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informacoes Basicas</CardTitle>
              <CardDescription>
                Descreva o que voce precisa desenvolver
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Nome do Projeto <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Sistema de Gestao de Vendas, App de Delivery..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">
                    Tipo de Projeto <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Plataforma</Label>
                  <Select
                    value={formData.platform}
                    onValueChange={(value) =>
                      handleSelectChange("platform", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Onde vai funcionar?" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLATFORMS.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Descricao do Projeto <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva o objetivo principal do projeto. O que ele deve fazer? Qual problema resolve?"
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Publico e Usuarios */}
          <Card>
            <CardHeader>
              <CardTitle>Publico-Alvo</CardTitle>
              <CardDescription>
                Quem vai usar o sistema?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Tipo de Publico</Label>
                  <Select
                    value={formData.targetAudience}
                    onValueChange={(value) =>
                      handleSelectChange("targetAudience", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_AUDIENCES.map((audience) => (
                        <SelectItem key={audience.value} value={audience.value}>
                          {audience.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="expectedUsers">Usuarios Esperados</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Estimativa de quantas pessoas vao usar o sistema</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="expectedUsers"
                    name="expectedUsers"
                    value={formData.expectedUsers}
                    onChange={handleChange}
                    placeholder="Ex: 100-500 usuarios, 10 funcionarios..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funcionalidades */}
          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades</CardTitle>
              <CardDescription>
                Adicione as funcionalidades que seu projeto precisa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Campo para adicionar funcionalidade */}
              <div className="space-y-2">
                <Label htmlFor="newFeature">Adicionar funcionalidade</Label>
                <div className="flex gap-2">
                  <Input
                    id="newFeature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite uma funcionalidade e pressione Enter"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleAddFeature(newFeature)}
                    disabled={!newFeature.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Funcionalidades adicionadas */}
              {formData.features.length > 0 && (
                <div className="space-y-2">
                  <Label>Funcionalidades selecionadas</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="pl-3 pr-1 py-1.5 flex items-center gap-1"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(feature)}
                          className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Sugestoes */}
              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  Sugestoes (clique para adicionar)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {FEATURE_SUGGESTIONS.filter(
                    (s) => !formData.features.includes(s)
                  ).map((suggestion) => (
                    <Badge
                      key={suggestion}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleAddFeature(suggestion)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectNarrative">
                  Escreva um texto descritivo do seu projeto
                </Label>
                <Textarea
                  id="projectNarrative"
                  name="projectNarrative"
                  value={formData.projectNarrative}
                  onChange={handleChange}
                  placeholder="Conte, em suas palavras, como imagina o projeto, principais fluxos e cenarios de uso."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sistema Existente */}
          <Card>
            <CardHeader>
              <CardTitle>Sistema Atual</CardTitle>
              <CardDescription>
                Voce ja possui algum sistema ou e um projeto do zero?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Ja possui sistema?</Label>
                <Select
                  value={formData.hasExistingSystem}
                  onValueChange={(value) =>
                    handleSelectChange("hasExistingSystem", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao">Nao, projeto do zero</SelectItem>
                    <SelectItem value="sim-substituir">
                      Sim, quero substituir
                    </SelectItem>
                    <SelectItem value="sim-integrar">
                      Sim, quero integrar/migrar dados
                    </SelectItem>
                    <SelectItem value="sim-melhorar">
                      Sim, quero melhorar o existente
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.hasExistingSystem &&
                formData.hasExistingSystem !== "nao" && (
                  <div className="space-y-2">
                    <Label htmlFor="existingSystemDetails">
                      Detalhes do sistema atual
                    </Label>
                    <Textarea
                      id="existingSystemDetails"
                      name="existingSystemDetails"
                      value={formData.existingSystemDetails}
                      onChange={handleChange}
                      placeholder="Descreva o sistema atual, tecnologias utilizadas, o que funciona bem e o que precisa melhorar..."
                      rows={3}
                    />
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Beneficios e economia */}
          <Card>
            <CardHeader>
              <CardTitle>Beneficios esperados</CardTitle>
              <CardDescription>
                Quais resultados voce espera atingir com este projeto?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.benefits.includes("reducao-trabalho-operacional")}
                    onCheckedChange={(v) =>
                      handleToggleBenefit("reducao-trabalho-operacional", v)
                    }
                  />
                  <span className="text-sm">
                    Reducao de trabalho operacional (tarefas manuais, planilhas, retrabalho)
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.benefits.includes("melhor-relacionamento-cliente")}
                    onCheckedChange={(v) =>
                      handleToggleBenefit("melhor-relacionamento-cliente", v)
                    }
                  />
                  <span className="text-sm">
                    Melhor relacionamento com o cliente (experiencia, atendimento, rapidez)
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.benefits.includes(
                      "melhor-relacionamento-fornecedor-parceiro"
                    )}
                    onCheckedChange={(v) =>
                      handleToggleBenefit(
                        "melhor-relacionamento-fornecedor-parceiro",
                        v
                      )
                    }
                  />
                  <span className="text-sm">
                    Melhor relacionamento com fornecedores ou parceiros de negocio
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.benefits.includes("reducao-multas-infracoes")}
                    onCheckedChange={(v) =>
                      handleToggleBenefit("reducao-multas-infracoes", v)
                    }
                  />
                  <span className="text-sm">
                    Reducao de multas, riscos ou infracoes (fiscais, regulatorias, contratuais)
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.benefits.includes("melhoria-qualidade-trabalho")}
                    onCheckedChange={(v) =>
                      handleToggleBenefit("melhoria-qualidade-trabalho", v)
                    }
                  />
                  <span className="text-sm">
                    Melhoria da qualidade do trabalho (padronizacao, menos erros, mais visibilidade)
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.benefits.includes("outro")}
                    onCheckedChange={(v) => handleToggleBenefit("outro", v)}
                  />
                  <span className="text-sm">Outro</span>
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefitsDetails" className="text-sm">
                  Descreva as economias e beneficios principais do seu projeto{" "}
                  <span className="text-xs text-muted-foreground">(opcional)</span>
                </Label>
                <Textarea
                  id="benefitsDetails"
                  name="benefitsDetails"
                  value={formData.benefitsDetails}
                  onChange={handleChange}
                  placeholder="Ex: reducao de X horas por semana, queda de X% em retrabalho, melhoria na satisfacao do cliente, etc."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Prazo */}
          <Card>
            <CardHeader>
              <CardTitle>Prazo</CardTitle>
              <CardDescription>
                Quando voce precisa do projeto pronto?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="urgency">Nivel de Urgencia</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) =>
                      handleSelectChange("urgency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {URGENCY_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Data Limite (opcional)</Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informacoes Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle>Informacoes Adicionais</CardTitle>
              <CardDescription>
                Algo mais que devemos saber?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Restricoes tecnicas, integracao com outros sistemas, requisitos de seguranca, informacoes sobre a empresa..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Botoes */}
          <div className="flex justify-end gap-4">
            <Link href="/cliente">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Enviando..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Solicitacao
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
}
