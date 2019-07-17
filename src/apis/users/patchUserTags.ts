import { call } from "src/apis/call";

interface Input {
  uuid: IUser["uuid"];
  tags: IUser["tags"];
}

export function patchUserTagsAPI({ uuid, tags }: Input): Promise<IUser> {
  return call({
    method: "patch",
    url: `/me`,
    data: { tags }
  });
}
