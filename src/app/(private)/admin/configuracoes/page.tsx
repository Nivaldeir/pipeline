"use client";

import { useState } from "react";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import { Switch } from "@/src/shared/components/ui/switch";
import { Separator } from "@/src/shared/components/ui/separator";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { useToast } from "@/src/shared/hooks/use-toast";
import { Building, Bell, Shield, Database, Globe } from "lucide-react";

export default function AdminConfiguracoesPage() {
  const { toast } = useToast();
  
  const [companySettings, setCompanySettings] = useState({
    name: "Tech Projects",
    email: "contato@techprojects.com",
    phone: "(11) 99999-9999",
    address: "Av. Paulista, 1000 - São Paulo, SP",
    website: "https://techprojects.com",
    description: "Empresa especializada em desenvolvimento de software sob demanda.",
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    registrationEnabled: true,
    maxProjectsPerClient: 10,
    maxFileSize: 10, // MB
    allowedFileTypes: ".pdf,.doc,.docx,.png,.jpg,.zip",
    defaultProjectStatus: "backlog",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    slackIntegration: false,
    webhookUrl: "",
    notifyOnNewProject: true,
    notifyOnStatusChange: true,
    notifyOnDeadline: true,
    dailyDigest: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30, // minutos
    passwordMinLength: 8,
    requireSpecialChars: true,
    maxLoginAttempts: 5,
    ipWhitelist: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  async function handleSaveCompany() {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Configurações salvas",
      description: "As informações da empresa foram atualizadas.",
    });
  }

  async function handleSaveSystem() {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Sistema atualizado",
      description: "As configurações do sistema foram salvas.",
    });
  }

  async function handleSaveNotifications() {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Notificações atualizadas",
      description: "As preferências de notificação foram salvas.",
    });
  }

  async function handleSaveSecurity() {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Segurança atualizada",
      description: "As configurações de segurança foram salvas.",
    });
  }

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      <div>
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Configurações do Sistema</h1>
        <p className="text-sm text-muted-foreground">Gerencie as configurações gerais da plataforma</p>
      </div>

      <div className="grid gap-4 sm:gap-6">
        <Card className="min-w-0 overflow-hidden">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span className="truncate">Informações da Empresa</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Configure os dados da sua empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Empresa</label>
                <Input
                  value={companySettings.name}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email de Contato</label>
                <Input
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@empresa.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone</label>
                <Input
                  value={companySettings.phone}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={companySettings.website}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, website: e.target.value }))}
                    className="pl-10"
                    placeholder="https://seusite.com"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Endereço</label>
              <Input
                value={companySettings.address}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Endereço completo"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={companySettings.description}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da empresa..."
                rows={3}
              />
            </div>
            <Button onClick={handleSaveCompany} disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Salvando..." : "Salvar Informações"}
            </Button>
          </CardContent>
        </Card>

        <Card className="min-w-0 overflow-hidden">
          <CardHeader className="p-4 sm:p-6 pb-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Database className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              <span className="truncate">Configurações do Sistema</span>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Defina os parâmetros gerais do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium">Modo de Manutenção</p>
                <p className="text-xs text-muted-foreground">Desativa o acesso ao sistema temporariamente</p>
              </div>
              <Switch
                checked={systemSettings.maintenanceMode}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                className="shrink-0"
              />
            </div>
            <Separator />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium">Registro de Novos Usuários</p>
                <p className="text-xs text-muted-foreground">Permite cadastro de novos clientes</p>
              </div>
              <Switch
                checked={systemSettings.registrationEnabled}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, registrationEnabled: checked }))}
                className="shrink-0"
              />
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Projetos por Cliente (máx)</label>
                <Input
                  type="number"
                  value={systemSettings.maxProjectsPerClient}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, maxProjectsPerClient: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tamanho Máximo de Arquivo (MB)</label>
                <Input
                  type="number"
                  value={systemSettings.maxFileSize}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipos de Arquivo Permitidos</label>
              <Input
                value={systemSettings.allowedFileTypes}
                onChange={(e) => setSystemSettings(prev => ({ ...prev, allowedFileTypes: e.target.value }))}
                placeholder=".pdf,.doc,.docx,.png,.jpg"
              />
              <p className="text-xs text-muted-foreground">Separados por vírgula</p>
            </div>
            <Button onClick={handleSaveSystem} disabled={isLoading} variant="outline" className="w-full sm:w-auto">
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 min-w-0">
          <Card className="min-w-0 overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span className="truncate">Notificações</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Configure alertas e integrações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              {[
                { key: "emailNotifications", label: "Notificações por Email", desc: "Enviar emails automáticos" },
                { key: "notifyOnNewProject", label: "Novos Projetos", desc: "Alertar sobre novas solicitações" },
                { key: "notifyOnStatusChange", label: "Mudança de Status", desc: "Alertar sobre mudanças em projetos" },
                { key: "notifyOnDeadline", label: "Deadlines", desc: "Alertar sobre prazos próximos" },
                { key: "dailyDigest", label: "Resumo Diário", desc: "Email com resumo do dia" },
              ].map((item, i) => (
                <div key={item.key}>
                  {i > 0 && <Separator className="my-4" />}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notificationSettings[item.key as keyof typeof notificationSettings] as boolean}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, [item.key]: checked }))
                      }
                      className="shrink-0"
                    />
                  </div>
                </div>
              ))}
              <Button onClick={handleSaveNotifications} className="w-full" variant="outline">
                Salvar Notificações
              </Button>
            </CardContent>
          </Card>

          <Card className="min-w-0 overflow-hidden">
            <CardHeader className="p-4 sm:p-6 pb-2">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                <span className="truncate">Segurança</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Configure políticas de segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Autenticação 2 Fatores</p>
                  <p className="text-xs text-muted-foreground">Exigir 2FA para todos usuários</p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                  className="shrink-0"
                />
              </div>
              <Separator />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium">Caracteres Especiais</p>
                  <p className="text-xs text-muted-foreground">Exigir na senha</p>
                </div>
                <Switch
                  checked={securitySettings.requireSpecialChars}
                  onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, requireSpecialChars: checked }))}
                  className="shrink-0"
                />
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timeout da Sessão (min)</label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tentativas de Login (máx)</label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, maxLoginAttempts: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tamanho Mínimo da Senha</label>
                <Input
                  type="number"
                  value={securitySettings.passwordMinLength}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordMinLength: parseInt(e.target.value) || 0 }))}
                  className="w-full min-w-0"
                />
              </div>
              <Button onClick={handleSaveSecurity} className="w-full" variant="outline">
                Salvar Segurança
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
