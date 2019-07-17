import { call } from "src/apis/call";

interface IBody {
  email: string;
  password: string;
}

interface IResponse {
  token: string;
  uuid: string;
  verified: boolean;
}

export const postAuthEmailLogin = (data: IBody): Promise<IResponse> => {
  return call({
    method: "post",
    url: "/auth/email/login",
    headers: {
      Authorization: ""
    },
    data
  });
};
