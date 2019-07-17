import { call } from "src/apis/call";

interface Input {
  key: string;
}

interface IResponse {
  email: string;
  uuid: string;
  token: string;
}

export const postAuthEmailVerify = (data: Input): Promise<IResponse> => {
  return call({
    method: "post",
    url: "auth/email/verify",
    headers: {
      Authorization: ""
    },
    data
  });
};
