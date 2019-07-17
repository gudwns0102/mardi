import { call } from "src/apis/call";

interface IBody {
  access_token: string;
  code?: string;
}

interface IResponse {
  token: string;
  uuid: string;
  email: string;
  verified: string;
  is_superuser: string;
}

export const postAuthFacebookLogin = async (
  data: IBody
): Promise<IResponse> => {
  const response: IResponse = await call({
    method: "post",
    url: "auth/facebook/login",
    headers: {
      Authorization: ""
    },
    data
  });

  return response;
};
