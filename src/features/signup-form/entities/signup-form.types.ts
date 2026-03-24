import { z } from "zod";
import { SIGNUP_FORM_SCHEMA } from "./signup-form.constants";

export type SignupFormSchema = z.infer<typeof SIGNUP_FORM_SCHEMA>;
