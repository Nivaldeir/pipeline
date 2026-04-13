import { z } from "zod";

export const projectRequestSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  company: z.string().optional(),
  projectArea: z.string().min(1, "Selecione a área"),
  projectTheme: z.string().min(1, "Selecione o tema"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  estimatedDeadline: z.string().optional(),
  estimatedBudget: z.string().optional(),
});

export type ProjectRequestFormData = z.infer<typeof projectRequestSchema>;
