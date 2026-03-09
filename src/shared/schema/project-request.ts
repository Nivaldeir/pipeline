import { z } from "zod";

export const projectRequestSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  company: z.string().optional(),
  projectType: z.string().min(1, "Selecione um tipo de projeto"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  estimatedDeadline: z.string().optional(),
  estimatedBudget: z.string().optional(),
});

export type ProjectRequestFormData = z.infer<typeof projectRequestSchema>;
