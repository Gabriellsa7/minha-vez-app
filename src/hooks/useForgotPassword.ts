import { generateReactQueryMutation } from "../helpers/react-query";
import {
  IForgotPasswordRequest,
  IResetPasswordRequest,
  IVerifyResetCodeRequest,
  IVerifyResetCodeResponse,
  requestPasswordReset,
  resetPassword,
  verifyResetCode,
} from "../services/auth/auth.api";

export const REQUEST_PASSWORD_RESET_KEY = "REQUEST_PASSWORD_RESET_KEY";
export const VERIFY_RESET_CODE_KEY = "VERIFY_RESET_CODE_KEY";
export const RESET_PASSWORD_KEY = "RESET_PASSWORD_KEY";

export const useRequestPasswordReset = generateReactQueryMutation<
  void,
  IForgotPasswordRequest
>(REQUEST_PASSWORD_RESET_KEY, requestPasswordReset);

export const useVerifyResetCode = generateReactQueryMutation<
  IVerifyResetCodeResponse,
  IVerifyResetCodeRequest
>(VERIFY_RESET_CODE_KEY, verifyResetCode);

export const useResetPassword = generateReactQueryMutation<
  void,
  IResetPasswordRequest
>(RESET_PASSWORD_KEY, resetPassword);
