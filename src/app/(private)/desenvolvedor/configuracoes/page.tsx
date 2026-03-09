"use client";

import { useState } from "react";
import { useAuth } from "@/shared/context/auth-context";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import { Badge } from "@/src/shared/components/ui/badge";
import { Switch } from "@/src/shared/components/ui/switch";
import { Separator } from "@/src/shared/components/ui/separator";
import { Textarea } from "@/src/shared/components/ui/textarea";
import { useToast } from "@/src/shared/hooks/use-toast";
import { User, Mail, Phone, Code, Shield, Bell, Clock, Check, X } from "lucide-react";

const SKILLS = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", 
  "PHP", "Laravel", "Vue.js", "Angular", "PostgreSQL",
  "MongoDB", "AWS", "Docker", "Kubernetes", "GraphQL"
];

export default function DesenvolvedorConfiguracoesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    bio: "Desenvolvedor Full Stack com experiência em React, Node.js e TypeScript.",
    hourlyRate: "150",
    availability: "full-time",
    skills: ["React", "Next.js", "TypeScript", "Node.js"],
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    projectUpdates: true,
    deadlineReminders: true,
    newProjectAlerts: true,
    darkMode: true,
    compactView: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  function handleProfileChange(field: string, value: string) {
    setProfile(prev => ({ ...prev, [field]: value }));
  }

  function toggleSkill(skill: string) {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  }

  async function handleSaveProfile() {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  }

  async function handleChangePassword() {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    if (passwords.new.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setPasswords({ current: "", new: "", confirm: "" });
    toast({
      title: "Senha alterada",
      description: "Sua senha foi alterada com sucesso.",
    });
  }

  async function handleSavePreferences() {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    toast({
      title: "Preferências salvas",
      description: "Suas preferências foram atualizadas.",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie seu perfil e preferências</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Perfil */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Perfil
            </CardTitle>
            <CardDescription>Atualize suas informações pessoais e profissionais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={profile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                    className="pl-10"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={profile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    className="pl-10"
                    placeholder="seu@email.com"
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={profile.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                    className="pl-10"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor Hora (R$)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <Input
                    value={profile.hourlyRate}
                    onChange={(e) => handleProfileChange("hourlyRate", e.target.value)}
                    className="pl-10"
                    placeholder="150"
                    type="number"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio / Descrição</label>
              <Textarea
                value={profile.bio}
                onChange={(e) => handleProfileChange("bio", e.target.value)}
                placeholder="Fale um pouco sobre você e sua experiência..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Disponibilidade</label>
              <div className="flex gap-2">
                {[
                  { value: "full-time", label: "Tempo Integral" },
                  { value: "part-time", label: "Meio Período" },
                  { value: "freelance", label: "Freelancer" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={profile.availability === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleProfileChange("availability", option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Code className="h-4 w-4" />
                Habilidades Técnicas
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <Badge
                    key={skill}
                    variant={profile.skills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleSkill(skill)}
                  >
                    {profile.skills.includes(skill) ? (
                      <Check className="mr-1 h-3 w-3" />
                    ) : (
                      <X className="mr-1 h-3 w-3" />
                    )}
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Perfil"}
            </Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>Configure como deseja receber notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Notificações por Email</p>
                <p className="text-xs text-muted-foreground">Receber atualizações no email</p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Atualizações de Projeto</p>
                <p className="text-xs text-muted-foreground">Novos comentários e mudanças</p>
              </div>
              <Switch
                checked={preferences.projectUpdates}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, projectUpdates: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Lembretes de Prazo</p>
                <p className="text-xs text-muted-foreground">Alertas de deadlines próximos</p>
              </div>
              <Switch
                checked={preferences.deadlineReminders}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, deadlineReminders: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Novos Projetos</p>
                <p className="text-xs text-muted-foreground">Alertas de projetos atribuídos</p>
              </div>
              <Switch
                checked={preferences.newProjectAlerts}
                onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, newProjectAlerts: checked }))}
              />
            </div>
            <Button onClick={handleSavePreferences} className="w-full mt-4" variant="outline">
              Salvar Preferências
            </Button>
          </CardContent>
        </Card>

        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>Altere sua senha de acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Senha Atual</label>
              <Input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                placeholder="Digite sua senha atual"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nova Senha</label>
              <Input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                placeholder="Digite a nova senha"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirmar Nova Senha</label>
              <Input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                placeholder="Confirme a nova senha"
              />
            </div>
            <Button onClick={handleChangePassword} className="w-full" variant="outline">
              Alterar Senha
            </Button>
          </CardContent>
        </Card>

        {/* Informações da Conta */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">Membro desde</p>
                <p className="text-sm font-medium">Janeiro 2024</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">Projetos Concluídos</p>
                <p className="text-sm font-medium">12 projetos</p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="text-xs text-muted-foreground">Último Acesso</p>
                <p className="text-sm font-medium">Agora</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
