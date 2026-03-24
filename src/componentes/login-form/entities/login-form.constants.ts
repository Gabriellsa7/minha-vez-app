import { z } from "zod";
export const LOGIN_FORM_SCHEMA = z.object({
  email: z.email("Campo Obrigatório"),
  password: z.string("Campo Obrigatório").min(6, "Mínimo 6 caracteres"),
});
