import { call } from "src/apis/call";

interface Input {
  email: string;
  password1: string;
  password2: string;
  username: string;
  platform: string;
}

interface IResponse {}

export const postAuthEmailSignup = (data: Input): Promise<IResponse> => {
  return call({
    method: "post",
    url: "auth/email/signup",
    headers: {
      Authorization: ""
    },
    data
  });
};
