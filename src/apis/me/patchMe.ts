import { call } from "src/apis/call";

export function patchMeAPI(data: Partial<Omit<IUser, "uuid">>): Promise<IUser> {
  return call({
    method: "patch",
    url: `/me`,
    data
  });
}
