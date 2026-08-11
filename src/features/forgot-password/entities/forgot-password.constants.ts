import { z } from "zod";

export const REQUEST_CODE_SCHEMA = z.object({
  email: z.email("Campo Obrigatório"),
});

export const VERIFY_CODE_SCHEMA = z.object({
  code: z
    .string("Campo Obrigatório")
    .length(6, "O código deve ter 6 dígitos")
    .regex(/^\d{6}$/, "O código deve conter somente números"),
});

export const NEW_PASSWORD_SCHEMA = z
  .object({
    password: z.string("Campo Obrigatório").min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string("Campo Obrigatório").min(6, "Mínimo 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
