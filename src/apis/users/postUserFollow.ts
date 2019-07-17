import { call } from "src/apis/call";

export function postUserFollowAPI(uuid: IUser["uuid"]): Promise<IUser> {
  return call({
    method: "post",
    url: `/users/${uuid}/follow`
  });
}
