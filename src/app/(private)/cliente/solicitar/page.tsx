"use client";

import { useState, useRef } from "react";
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

import {
  PROJECT_AREAS,
  PROJECT_THEMES_BY_AREA,
  buildClienteProjectTypeLabel,
  PLATFORMS,
  TARGET_AUDIENCES,
  URGENCY_LEVELS,
  FEATURE_SUGGESTION_GROUPS,
  DEFAULT_PLATFORM_VALUE,
} from "./utils/solicitar.utils";
import { useFiles } from "@/shared/context/files-context";

export default function SolicitarProjetoPage() {
  const { user } = useAuth();
  const { addProject } = useProjects();
  const { addFile } = useFiles();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    projectArea: "",
    projectTheme: "",
    platform: DEFAULT_PLATFORM_VALUE,
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
  const [chatMessages, setChatMessages] = useState<
    { id: number; author: "cliente"; text: string; createdAt: Date }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(name: string, value: string) {
    setFormData((prev) => {
      if (name === "projectArea") {
        return { ...prev, projectArea: value, projectTheme: "" };
      }
      return { ...prev, [name]: value };
    });
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
    if (
      !formData.title ||
      !formData.projectArea ||
      !formData.projectTheme ||
      !formData.description
    ) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const typeLabel = buildClienteProjectTypeLabel(
        formData.projectArea,
        formData.projectTheme
      );
      const platformLabel =
        PLATFORMS.find((p) => p.value === formData.platform)?.label ??
        formData.platform;
      const projectTypeWithPlatform = `${typeLabel} · Plataforma: ${platformLabel}`;

      const projectId = await addProject({
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
        projectType: projectTypeWithPlatform,
        targetAudience: formData.targetAudience,
        expectedUsers: formData.expectedUsers,
        urgency: formData.urgency,
        features: formData.features,
        estimatedDeadline: formData.deadline
          ? new Date(formData.deadline)
          : undefined,
      });

      // Upload de anexos vinculados ao novo projeto
      if (projectId && attachedFiles.length > 0) {
        for (const file of attachedFiles) {
          try {
            await addFile({ projectId, file });
          } catch {
            // erro por arquivo é tratado silenciosamente aqui; feedback principal é do projeto
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Descreva o que você precisa desenvolver
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Nome do Processo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Processo de Vendas, Processo de Delivery..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="projectArea">
                    Área <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.projectArea}
                    onValueChange={(value) =>
                      handleSelectChange("projectArea", value)
                    }
                  >
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectTheme">
                    Tema <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.projectTheme}
                    onValueChange={(value) =>
                      handleSelectChange("projectTheme", value)
                    }
                    disabled={!formData.projectArea}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          formData.projectArea
                            ? "Selecione o tema"
                            : "Primeiro escolha a área"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {(PROJECT_THEMES_BY_AREA[formData.projectArea] ?? []).map(
                        (t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
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

              <div className="space-y-2">
                <Label htmlFor="description">
                  Descrição do Processo <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descreva o objetivo principal do processo. O que ele deve fazer? Qual problema resolve?"
                  rows={5}
                />
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
              <CardDescription>
                Quem está envolvido no processo?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Setor Envolvido</Label>
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
                    name="expectedUsers"
                    value={formData.expectedUsers}
                    onChange={handleChange}
                    placeholder="Ex.: 100–500 pessoas, 10 funcionários..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funcionalidades */}
          <Card>
            <CardHeader>
              <CardTitle>Adicione as funcionalidades que a automação deverá contemplar</CardTitle>
              <CardDescription>
                Adicione as funcionalidades que a automação deverá contemplar
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

              {/* Funcionalidades adicionadas */}
              {formData.features.length > 0 && (
                <div className="space-y-2">
                  <Label>Funcionalidades Selecionadas</Label>
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

              <div className="space-y-4">
                <Label className="text-muted-foreground text-sm">
                  Sugestões por categoria (clique para adicionar)
                </Label>
                {FEATURE_SUGGESTION_GROUPS.map((group) => {
                  const available = group.items.filter(
                    (s) => !formData.features.includes(s)
                  );
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
                  name="projectNarrative"
                  value={formData.projectNarrative}
                  onChange={handleChange}
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
                    <SelectItem value="nao">Não, projeto do zero</SelectItem>
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
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={formData.benefits.includes("reducao-trabalho-operacional")}
                    onCheckedChange={(v) =>
                      handleToggleBenefit("reducao-trabalho-operacional", v)
                    }
                  />
                  <span className="text-sm">
                    Redução de trabalho operacional (tarefas manuais, planilhas, retrabalho)
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
                    Melhor relacionamento com o cliente (experiência, atendimento, rapidez)
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
                    Melhor relacionamento com fornecedores ou parceiros de negócio
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
                    Redução de multas, riscos ou infrações (fiscais, regulatórias, contratuais)
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
                    Melhoria da qualidade do trabalho (padronização, menos erros, mais visibilidade)
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
                  Descreva as economias e benefícios principais do seu processo de uso.{" "}
                  <span className="text-xs text-muted-foreground">(opcional)</span>
                </Label>
                <Textarea
                  id="benefitsDetails"
                  name="benefitsDetails"
                  value={formData.benefitsDetails}
                  onChange={handleChange}
                  placeholder="Ex.: redução de X horas por semana, queda de X% em retrabalho, melhoria na satisfação do cliente, etc."
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
                Quando você precisa do processo pronto?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="urgency">Nível de urgência</Label>
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
                  <Label htmlFor="deadline">Data Limite (Opcional)</Label>
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

          {/* Informações adicionais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
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
                Use este espaço para anotar ideias, perguntas ou combinações antes de enviar a solicitação.
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
                        Cliente • {msg.createdAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
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
