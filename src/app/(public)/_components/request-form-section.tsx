"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { Textarea } from "@/src/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import {
  projectRequestSchema,
  type ProjectRequestFormData,
} from "@/shared/schema/project-request";
import { PROJECT_TYPES } from "@/shared/types";
import { useProjects } from "@/shared/context/projects-context";
import { useToast } from "@/src/shared/hooks/use-toast";
import { Send, CheckCircle } from "lucide-react";

export function RequestFormSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addRequest } = useProjects();
  const { toast } = useToast();

  const form = useForm<ProjectRequestFormData>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      projectType: "",
      description: "",
      estimatedDeadline: "",
      estimatedBudget: "",
    },
  });

  async function onSubmit(data: ProjectRequestFormData) {
    addRequest(data);
    toast({
      title: "Solicitação recebida",
      description:
        "Sua solicitação será avaliada e você receberá um retorno de um analista em breve.",
    });
    setIsSubmitted(true);
    form.reset();
  }

  if (isSubmitted) {
    return (
      <section id="solicitar" className="py-20 sm:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <Card className="mx-auto max-w-2xl bg-card border-2 border-primary/20 shadow-lg shadow-primary/5">
            <CardContent className="flex flex-col items-center justify-center py-16 sm:py-20">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">Solicitação Enviada!</h3>
              <p className="text-muted-foreground text-center max-w-md leading-relaxed">
                Recebemos sua solicitação. Nossa equipe irá analisar e entrar em
                contato em breve.
              </p>
              <Button
                className="mt-8"
                variant="outline"
                size="lg"
                onClick={() => setIsSubmitted(false)}
              >
                Enviar outra solicitação
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="solicitar" className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3">
            Solicite seu projeto
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Preencha o formulário abaixo e nossa equipe entrará em contato.
          </p>
        </div>

        <Card className="mx-auto max-w-2xl bg-card border border-border shadow-sm">
          <CardHeader>
            <CardTitle>Formulário de Solicitação</CardTitle>
            <CardDescription>
              Descreva seu projeto com o máximo de detalhes possível.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="seu@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empresa (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da empresa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Projeto</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PROJECT_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Projeto</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva detalhadamente o que você precisa..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="estimatedDeadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo Desejado (opcional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedBudget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orçamento Estimado (opcional)</FormLabel>
                        <FormControl>
                          <Input placeholder="R$ 0,00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Solicitação
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
