import { z } from "zod";
import { LOGIN_FORM_SCHEMA } from "./login-form.constants";

export type LoginFormSchema = z.infer<typeof LOGIN_FORM_SCHEMA>;
