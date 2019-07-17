import { call } from "src/apis/call";

export const getMe = (): Promise<IUser> => {
  return call({
    method: "get",
    url: "/me"
  });
};
