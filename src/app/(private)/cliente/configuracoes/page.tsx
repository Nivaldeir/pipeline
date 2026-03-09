"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/shared/context/auth-context";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import { FieldGroup, Field, FieldLabel } from "@/src/shared/components/ui/field";
import { Separator } from "@/src/shared/components/ui/separator";
import { useToast } from "@/src/shared/hooks/use-toast";
import { trpc } from "@/shared/trpc/client";
import { User, Building2, Mail, Lock, Bell, Shield } from "lucide-react";

export default function ClienteConfiguracoes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: profile, isLoading: profileLoading } = trpc.user.me.useQuery(undefined, {
    enabled: !!user?.id,
  });
  const utils = trpc.useUtils();
  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate();
    },
  });

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name,
        email: profile.email,
        company: profile.company,
        phone: profile.phone,
      });
    } else if (user) {
      setProfileData({
        name: user.name ?? "",
        email: user.email ?? "",
        company: user.company ?? "",
        phone: "",
      });
    }
  }, [profile, user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    projectUpdates: true,
    weeklyReport: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfileMutation.mutateAsync({
        name: profileData.name,
        phone: profileData.phone || undefined,
        companyName: profileData.company || undefined,
      });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simula salvamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Senha alterada",
      description: "Sua senha foi atualizada com sucesso.",
    });
    
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    
    setIsLoading(false);
  }

  async function handleSaveNotifications() {
    setIsLoading(true);
    
    // Simula salvamento
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Preferências salvas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
    
    setIsLoading(false);
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <User className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            Informações do Perfil
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Atualize suas informações pessoais e de contato
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleSaveProfile}>
            {profileLoading && !profile ? (
              <p className="text-sm text-muted-foreground py-4">Carregando perfil...</p>
            ) : (
            <FieldGroup>
              <Field>
                <FieldLabel>Nome completo</FieldLabel>
                <Input
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Seu nome"
                />
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="seu@email.com"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">
                  O email não pode ser alterado
                </p>
              </Field>

              <Field>
                <FieldLabel>Empresa</FieldLabel>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    placeholder="Nome da empresa"
                    className="pl-10"
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel>Telefone</FieldLabel>
                <Input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </Field>
            </FieldGroup>
            )}
            <div className="mt-6 flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || updateProfileMutation.isPending || profileLoading}
                className="w-full sm:w-auto"
              >
                {isLoading || updateProfileMutation.isPending ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Lock className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            Alterar Senha
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Mantenha sua conta segura atualizando sua senha regularmente
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <form onSubmit={handleChangePassword}>
            <FieldGroup>
              <Field>
                <FieldLabel>Senha atual</FieldLabel>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Digite sua senha atual"
                />
              </Field>

              <Separator className="my-2" />

              <Field>
                <FieldLabel>Nova senha</FieldLabel>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Digite a nova senha"
                />
              </Field>

              <Field>
                <FieldLabel>Confirmar nova senha</FieldLabel>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirme a nova senha"
                />
              </Field>
            </FieldGroup>

            <div className="mt-6 flex justify-end">
              <Button type="submit" variant="secondary" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Alterando..." : "Alterar senha"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            Notificações
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Configure como e quando deseja receber atualizações
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-sm">Atualizações por email</p>
                <p className="text-sm text-muted-foreground">
                  Receba notificações gerais por email
                </p>
              </div>
              <Button
                variant={notifications.emailUpdates ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setNotifications({ ...notifications, emailUpdates: !notifications.emailUpdates });
                  handleSaveNotifications();
                }}
              >
                {notifications.emailUpdates ? "Ativado" : "Desativado"}
              </Button>
            </div>

            <Separator />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-sm">Atualizações de projetos</p>
                <p className="text-sm text-muted-foreground">
                  Seja notificado quando houver mudanças nos seus projetos
                </p>
              </div>
              <Button
                variant={notifications.projectUpdates ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setNotifications({ ...notifications, projectUpdates: !notifications.projectUpdates });
                  handleSaveNotifications();
                }}
              >
                {notifications.projectUpdates ? "Ativado" : "Desativado"}
              </Button>
            </div>

            <Separator />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-sm">Relatório semanal</p>
                <p className="text-sm text-muted-foreground">
                  Receba um resumo semanal do progresso dos seus projetos
                </p>
              </div>
              <Button
                variant={notifications.weeklyReport ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setNotifications({ ...notifications, weeklyReport: !notifications.weeklyReport });
                  handleSaveNotifications();
                }}
              >
                {notifications.weeklyReport ? "Ativado" : "Desativado"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="p-4 sm:p-6 pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            Segurança da Conta
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Informações sobre a segurança da sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-sm">Último acesso</p>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-sm">Conta criada em</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
