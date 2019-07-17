import { call } from "src/apis/call";

interface Input {
  new_password1: string;
  new_password2: string;
  token: string;
  uuid: string;
}

interface IResponse {}

export const postAuthPasswordResetConfirm = (
  data: Input
): Promise<IResponse> => {
  return call({
    method: "post",
    url: "/auth/password/reset/confirm",
    headers: {
      Authorization: ""
    },
    data
  });
};
