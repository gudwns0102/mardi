import { call } from "src/apis/call";

interface Input {
  email: string;
}

interface IResponse {}

export const postAuthPasswordReset = (data: Input): Promise<IResponse> => {
  return call({
    method: "post",
    url: "auth/password/reset",
    headers: {
      Authorization: ""
    },
    data
  });
};
