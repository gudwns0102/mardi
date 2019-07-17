import { call } from "src/apis/call";

interface IParams {
  uuid: string;
}

export const getUser = async (params: IParams): Promise<IUser> => {
  return call({
    method: "get",
    url: `users/${params.uuid}`
  });
};
