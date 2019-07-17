import { call } from "src/apis/call";

interface IResponse {
  token: string;
  uuid: string;
  email: string;
  verified: boolean;
}

export const postAuthTokenRefresh = (data: {
  token: string;
}): Promise<IResponse> => {
  return call({
    method: "post",
    url: "/auth/token/refresh",
    data
  });
};
