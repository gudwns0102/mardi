import { call } from "src/apis/call";

interface Input {
  email: string;
}

interface IResponse {}

export const postAuthEmailSendVerification = (
  data: Input
): Promise<IResponse> => {
  return call({
    method: "post",
    url: "/auth/email/send-verification",
    headers: {
      Authorization: ""
    },
    data
  });
};
