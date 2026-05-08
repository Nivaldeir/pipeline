"use client";

import { useForm, type UseFormProps, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType, TypeOf } from "zod";

export function useZodForm<TSchema extends ZodType>(
  schema: TSchema,
  options?: Omit<UseFormProps<TypeOf<TSchema>>, "resolver">
): UseFormReturn<TypeOf<TSchema>> {
  return useForm<TypeOf<TSchema>>({
    ...options,
    resolver: zodResolver(schema),
  });
}
