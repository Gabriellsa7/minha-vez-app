import { IUser } from "../config/entities/user/user.types";
import { generateReactQueryMutation } from "../helpers/react-query";
import { httpClient } from "../services/api";

export interface IUploadUserImagePayload {
  userId: string;
  imageBase64: string;
  fileName?: string;
  mimeType?: string;
}

export const UPLOAD_USER_IMAGE_KEY = "UPLOAD_USER_IMAGE_KEY";

const uploadUserImage = async (
  payload: IUploadUserImagePayload,
): Promise<IUser> => {
  const { userId, ...data } = payload;

  const response = await httpClient.post(`/users/${userId}/image`, data);
  return response.data;
};

export const useUploadUserImage = generateReactQueryMutation<
  IUser,
  IUploadUserImagePayload
>(UPLOAD_USER_IMAGE_KEY, uploadUserImage);
