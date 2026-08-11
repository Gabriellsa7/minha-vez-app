import { z } from "zod";
import {
  NEW_PASSWORD_SCHEMA,
  REQUEST_CODE_SCHEMA,
  VERIFY_CODE_SCHEMA,
} from "./forgot-password.constants";

export type RequestCodeSchema = z.infer<typeof REQUEST_CODE_SCHEMA>;
export type VerifyCodeSchema = z.infer<typeof VERIFY_CODE_SCHEMA>;
export type NewPasswordSchema = z.infer<typeof NEW_PASSWORD_SCHEMA>;

export type ForgotPasswordStep = "REQUEST_CODE" | "VERIFY_CODE" | "NEW_PASSWORD";
