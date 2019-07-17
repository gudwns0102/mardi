import { call } from "src/apis/call";

interface IBody {
  email: string;
}

interface IResponse {
  result: boolean;
}

export const postAuthEmailCheck = (data: IBody): Promise<IResponse> => {
  return call({
    method: "post",
    url: "auth/email/check",
    headers: {
      Authorization: ""
    },
    data
  });
};
