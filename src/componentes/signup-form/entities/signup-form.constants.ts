import { z } from "zod";

export const SIGNUP_FORM_SCHEMA = z.object({
  name: z.string("Nome é Obrigatório"),
  email: z.email("Email é Obrigatório"),
  password: z.string("Senha é obrigatória").min(6),
});
