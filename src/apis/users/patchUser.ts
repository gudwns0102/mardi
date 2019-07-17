import { call } from "src/apis/call";

interface Input {
  uuid: IUser["uuid"];
  data: FormData;
}

export function patchUserAPI({ uuid, data }: Input): Promise<IUser> {
  return call({
    method: "patch",
    url: `/me`,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data
  });
}
