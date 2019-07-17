import { call } from "src/apis/call";

interface IProps {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

export const postAuthPasswordChange = (data: IProps): Promise<any> => {
  return call({
    method: "post",
    url: "/auth/password/change",
    data
  });
};
