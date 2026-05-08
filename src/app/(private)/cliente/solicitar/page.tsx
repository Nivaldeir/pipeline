"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
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
import { useZodForm } from "@/shared/hooks/use-zod-form";
import {
  solicitarProjetoSchema,
  type SolicitarProjetoFormData,
} from "@/shared/schema/solicitar-projeto";
import { ArrowLeft, Send, HelpCircle, Plus, X } from "lucide-react";
import { Badge } from "@/src/shared/components/ui/badge";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/shared/components/ui/tooltip";

import {
  PLATFORMS,
  TARGET_AUDIENCES,
  URGENCY_LEVELS,
  DEFAULT_PLATFORM_VALUE,
} from "./utils/solicitar.utils";
import { useTaxonomy } from "./utils/use-taxonomy";
import { useFiles } from "@/shared/context/files-context";

const QUALITATIVE_RATINGS = [
  { name: "ratingErrorReduction" as const, label: "Redução de Erros" },
  {
    name: "ratingProcessCriticality" as const,
    label: "Criticidade do processo para a empresa como um todo",
  },
  { name: "ratingInternalImpact" as const, label: "Impacto Interno da própria área" },
  {
    name: "ratingExternalImpact" as const,
    label: "Impacto Externo a clientes e fornecedores",
  },
  { name: "ratingCompliance" as const, label: "Atendimento à políticas e leis" },
];

function RatingRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex gap-1.5" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => {
          const selected = value === n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(n)}
              className={`h-8 w-8 rounded-full border text-sm font-medium transition-colors ${
                selected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const BENEFIT_OPTIONS = [
  {
    key: "reducao-trabalho-operacional",
    label: "Redução de trabalho operacional (tarefas manuais, planilhas, retrabalho)",
  },
  {
    key: "melhor-relacionamento-cliente",
    label: "Melhor relacionamento com o cliente (experiência, atendimento, rapidez)",
  },
  {
    key: "melhor-relacionamento-fornecedor-parceiro",
    label: "Melhor relacionamento com fornecedores ou parceiros de negócio",
  },
  {
    key: "reducao-multas-infracoes",
    label: "Redução de multas, riscos ou infrações (fiscais, regulatórias, contratuais)",
  },
  {
    key: "melhoria-qualidade-trabalho",
    label: "Melhoria da qualidade do trabalho (padronização, menos erros, mais visibilidade)",
  },
  { key: "outro", label: "Outro" },
];

export default function SolicitarProjetoPage() {
  const { user } = useAuth();
  const { addProject } = useProjects();
  const { addFile } = useFiles();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    areas: PROJECT_AREAS,
    themesByArea: PROJECT_THEMES_BY_AREA,
    suggestionGroups: FEATURE_SUGGESTION_GROUPS,
    buildTypeLabel: buildClienteProjectTypeLabel,
  } = useTaxonomy();

  const form = useZodForm(solicitarProjetoSchema, {
    defaultValues: {
      title: "",
      projectArea: "",
      customProjectArea: "",
      projectTheme: "",
      customProjectTheme: "",
      platform: DEFAULT_PLATFORM_VALUE,
      description: "",
      targetAudience: "",
      customTargetAudience: "",
      expectedUsers: "",
      hasExistingSystem: "",
      existingSystemDetails: "",
      benefitsDetails: "",
      monthlyHoursSaved: "",
      ratingErrorReduction: null,
      ratingProcessCriticality: null,
      ratingInternalImpact: null,
      ratingExternalImpact: null,
      ratingCompliance: null,
      projectNarrative: "",
      urgency: "",
      deadline: "",
      additionalInfo: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const projectArea = watch("projectArea");
  const projectTheme = watch("projectTheme");
  const targetAudience = watch("targetAudience");

  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [benefits, setBenefits] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<
    { id: number; author: "cliente"; text: string; createdAt: Date }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAddFeature(feature: string) {
    const trimmed = feature.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures((prev) => [...prev, trimmed]);
    }
    setNewFeature("");
  }

  function handleRemoveFeature(feature: string) {
    setFeatures((prev) => prev.filter((f) => f !== feature));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature(newFeature);
    }
  }

  function handleToggleBenefit(key: string, checked: boolean | "indeterminate") {
    const isChecked = checked === true;
    setBenefits((prev) =>
      isChecked ? [...prev, key] : prev.filter((b) => b !== key)
    );
  }

  function handleAttachFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setAttachedFiles(Array.from(files));
  }

  function handleAddChatMessage() {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        author: "cliente",
        text: trimmed,
        createdAt: new Date(),
      },
    ]);
    setChatInput("");
  }

  async function onSubmit(data: SolicitarProjetoFormData) {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Faça login para solicitar um projeto.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const areaLabel =
        data.projectArea === "outro"
          ? data.customProjectArea.trim()
          : PROJECT_AREAS.find((a) => a.value === data.projectArea)?.label ?? "";
      const themeLabel =
        data.projectTheme === "outro"
          ? data.customProjectTheme.trim()
          : (PROJECT_THEMES_BY_AREA[data.projectArea] ?? []).find(
              (t) => t.value === data.projectTheme
            )?.label ?? "";
      const typeLabel =
        data.projectArea === "outro" || data.projectTheme === "outro"
          ? [areaLabel, themeLabel].filter(Boolean).join(" - ") || "Outro"
          : buildClienteProjectTypeLabel(data.projectArea, data.projectTheme);

      const platformLabel =
        PLATFORMS.find((p) => p.value === data.platform)?.label ?? data.platform;
      const projectTypeWithPlatform = `${typeLabel} · Plataforma: ${platformLabel}`;

      const targetAudienceValue =
        data.targetAudience === "outro"
          ? data.customTargetAudience.trim()
          : data.targetAudience;

      const projectId = await addProject({
        title: data.title,
        description: data.description,
        clientId: user.id,
        status: "backlog",
        priority:
          data.urgency === "urgente"
            ? "urgent"
            : data.urgency === "alta"
              ? "high"
              : data.urgency === "baixa"
                ? "low"
                : "medium",
        projectType: projectTypeWithPlatform,
        targetAudience: targetAudienceValue,
        expectedUsers: data.expectedUsers,
        urgency: data.urgency,
        features,
        estimatedDeadline: data.deadline ? new Date(data.deadline) : undefined,
      });

      if (projectId && attachedFiles.length > 0) {
        for (const file of attachedFiles) {
          try {
            await addFile({ projectId, file });
          } catch {
            // erro por arquivo é tratado silenciosamente; feedback principal é do projeto
          }
        }
      }

      toast({
        title: "Solicitação enviada!",
        description:
          "Seu processo foi criado, anexos enviados e está no backlog. Você pode acompanhar o andamento na página Meus Projetos.",
      });
      router.push("/cliente");
    } catch {
      toast({
        title: "Erro ao salvar",
        description:
          "Não foi possível criar o processo. Tente novamente ou entre em contato.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6  mx-auto pb-10">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Descreva o que você precisa desenvolver</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Nome do Processo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Ex: Processo de Vendas, Processo de Delivery..."
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="projectArea">
                    Área <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Controller
                      control={control}
                      name="projectArea"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setValue("projectTheme", "");
                            setValue("customProjectTheme", "");
                            if (value !== "outro") setValue("customProjectArea", "");
                          }}
                        >
                          <SelectTrigger
                            className={
                              projectArea === "outro" ? "w-32 shrink-0" : "w-full"
                            }
                          >
                            <SelectValue placeholder="Selecione a área" />
                          </SelectTrigger>
                          <SelectContent>
                            {PROJECT_AREAS.map((a) => (
                              <SelectItem key={a.value} value={a.value}>
                                {a.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {projectArea === "outro" && (
                      <Input
                        id="customProjectArea"
                        {...register("customProjectArea")}
                        placeholder="Qual é a área?"
                        className="flex-1"
                      />
                    )}
                  </div>
                  {errors.projectArea && (
                    <p className="text-xs text-destructive">{errors.projectArea.message}</p>
                  )}
                  {errors.customProjectArea && (
                    <p className="text-xs text-destructive">
                      {errors.customProjectArea.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectTheme">
                    Tema <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Controller
                      control={control}
                      name="projectTheme"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value !== "outro") setValue("customProjectTheme", "");
                          }}
                          disabled={!projectArea}
                        >
                          <SelectTrigger
                            className={
                              projectTheme === "outro" ? "w-32 shrink-0" : "w-full"
                            }
                          >
                            <SelectValue
                              placeholder={
                                projectArea ? "Selecione o tema" : "Primeiro escolha a área"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {(PROJECT_THEMES_BY_AREA[projectArea] ?? []).map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {projectTheme === "outro" && (
                      <Input
                        id="customProjectTheme"
                        {...register("customProjectTheme")}
                        placeholder="Qual é o tema?"
                        className="flex-1"
                      />
                    )}
                  </div>
                  {errors.projectTheme && (
                    <p className="text-xs text-destructive">{errors.projectTheme.message}</p>
                  )}
                  {errors.customProjectTheme && (
                    <p className="text-xs text-destructive">
                      {errors.customProjectTheme.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Plataforma</Label>
                <Controller
                  control={control}
                  name="platform"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Descrição do Processo <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Descreva o objetivo principal do processo. O que ele deve fazer? Qual problema resolve?"
                  rows={5}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Anexos Iniciais (opcional)</Label>
                <Input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleAttachFilesChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.zip,.rar"
                />
                {attachedFiles.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {attachedFiles.length} arquivo(s) selecionado(s)
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Público e usuários */}
          <Card>
            <CardHeader>
              <CardTitle>Envolvidos no processo</CardTitle>
              <CardDescription>Quem está envolvido no processo?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Setor Envolvido</Label>
                  <div className="flex gap-2">
                    <Controller
                      control={control}
                      name="targetAudience"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value !== "outro") setValue("customTargetAudience", "");
                          }}
                        >
                          <SelectTrigger
                            className={
                              targetAudience === "outro" ? "w-32 shrink-0" : "w-full"
                            }
                          >
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
                      )}
                    />
                    {targetAudience === "outro" && (
                      <Input
                        id="customTargetAudience"
                        {...register("customTargetAudience")}
                        placeholder="Qual é o setor envolvido?"
                        className="flex-1"
                      />
                    )}
                  </div>
                  {errors.customTargetAudience && (
                    <p className="text-xs text-destructive">
                      {errors.customTargetAudience.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="expectedUsers">Número de Usuários</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Estimativa de quantas pessoas vão usar o sistema</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="expectedUsers"
                    {...register("expectedUsers")}
                    placeholder="Ex.: 100–500 pessoas, 10 funcionários..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funcionalidades */}
          <Card>
            <CardHeader>
              <CardTitle>
                Adicione as funcionalidades que a automação deverá contemplar
              </CardTitle>
              <CardDescription>
                Adicione as funcionalidades que a automação deverá contemplar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newFeature">Adicionar funcionalidade</Label>
                <div className="flex gap-2">
                  <Input
                    id="newFeature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite uma funcionalidade e pressione Enter para adicionar"
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

              {features.length > 0 && (
                <div className="space-y-2">
                  <Label>Funcionalidades Selecionadas</Label>
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature) => (
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

              <div className="space-y-4">
                <Label className="text-muted-foreground text-sm">
                  Sugestões por categoria (clique para adicionar)
                </Label>
                {FEATURE_SUGGESTION_GROUPS.map((group) => {
                  const available = group.items.filter((s) => !features.includes(s));
                  if (available.length === 0) return null;
                  return (
                    <div key={group.category} className="space-y-2">
                      <p className="text-xs font-semibold text-foreground/80">
                        {group.category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {available.map((suggestion) => (
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
                  );
                })}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectNarrative">
                  Escreva um texto descritivo do seu processo
                </Label>
                <Textarea
                  id="projectNarrative"
                  {...register("projectNarrative")}
                  placeholder="Conte, em suas palavras, como imagina o processo, principais fluxos e cenários de uso."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Sistema Existente */}
          <Card>
            <CardHeader>
              <CardTitle>Processo Atual</CardTitle>
              <CardDescription>
                Você já possui algum sistema ou é um projeto do zero?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Controller
                  control={control}
                  name="hasExistingSystem"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nao">Não, projeto do zero</SelectItem>
                        <SelectItem value="sim-substituir">Sim, quero substituir</SelectItem>
                        <SelectItem value="sim-integrar">
                          Sim, quero integrar/migrar dados
                        </SelectItem>
                        <SelectItem value="sim-melhorar">
                          Sim, quero melhorar o existente
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="existingSystemDetails">
                  Contar mais sobre o processo atual
                </Label>
                <Textarea
                  id="existingSystemDetails"
                  {...register("existingSystemDetails")}
                  placeholder="Contar mais sobre o processo atual"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Beneficios e economia */}
          <Card>
            <CardHeader>
              <CardTitle>Benefícios Esperados</CardTitle>
              <CardDescription>
                Quais resultados você espera atingir com este processo?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {BENEFIT_OPTIONS.map((option) => (
                  <label key={option.key} className="flex items-start gap-3 cursor-pointer">
                    <Checkbox
                      checked={benefits.includes(option.key)}
                      onCheckedChange={(v) => handleToggleBenefit(option.key, v)}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefitsDetails" className="text-sm">
                  Descreva as economias e benefícios principais do seu processo de uso.{" "}
                  <span className="text-xs text-muted-foreground">(opcional)</span>
                </Label>
                <Textarea
                  id="benefitsDetails"
                  {...register("benefitsDetails")}
                  placeholder="Ex.: redução de X horas por semana, queda de X% em retrabalho, melhoria na satisfação do cliente, etc."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Redução de horas operacionais */}
          <Card>
            <CardHeader>
              <CardTitle>Redução de horas operacionais de trabalho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="monthlyHoursSaved">
                  Número de horas totais economizadas por mês
                </Label>
                <Input
                  id="monthlyHoursSaved"
                  type="number"
                  min={0}
                  step="any"
                  {...register("monthlyHoursSaved")}
                  placeholder="Ex.: 40"
                />
              </div>
            </CardContent>
          </Card>

          {/* Benefícios qualitativos */}
          <Card>
            <CardHeader>
              <CardTitle>Benefícios qualitativos da automação</CardTitle>
              <CardDescription>
                Preencher com nota de 1 até 5, onde 5 é o mais importante para cada quesito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {QUALITATIVE_RATINGS.map((item) => (
                <Controller
                  key={item.name}
                  control={control}
                  name={item.name}
                  render={({ field }) => (
                    <RatingRow
                      label={item.label}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              ))}
            </CardContent>
          </Card>

          {/* Prazo */}
          <Card>
            <CardHeader>
              <CardTitle>Prazo</CardTitle>
              <CardDescription>Quando você precisa do processo pronto?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="urgency">Nível de urgência</Label>
                  <Controller
                    control={control}
                    name="urgency"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
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
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Data Limite (Opcional)</Label>
                  <Input id="deadline" type="date" {...register("deadline")} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações adicionais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
              <CardDescription>Algo mais que devemos saber?</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="additionalInfo"
                {...register("additionalInfo")}
                placeholder="Restrições técnicas, integração com outros sistemas, requisitos de segurança, informações sobre a empresa..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Chat inicial do processo (apenas para apoio na solicitação) */}
          <Card>
            <CardHeader>
              <CardTitle>Chat inicial do processo</CardTitle>
              <CardDescription>
                Use este espaço para anotar ideias, perguntas ou combinações antes de enviar a
                solicitação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-40 max-h-60 overflow-y-auto rounded-md border border-border/60 bg-muted/40 p-3 space-y-2 text-sm">
                {chatMessages.length === 0 ? (
                  <p className="text-muted-foreground text-xs">
                    Nenhuma mensagem ainda. Escreva a primeira mensagem abaixo para começar o chat.
                  </p>
                ) : (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="flex flex-col items-start gap-0.5 rounded-md bg-background/80 px-3 py-2 shadow-sm"
                    >
                      <span className="text-[11px] font-medium text-muted-foreground">
                        Cliente •{" "}
                        {msg.createdAt.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <p>{msg.text}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Escreva uma mensagem..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddChatMessage();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddChatMessage}
                  disabled={!chatInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Este chat é apenas um rascunho local para apoiar o preenchimento da solicitação.
              </p>
            </CardContent>
          </Card>

          {/* Botões */}
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
                  Enviar solicitação
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
}
