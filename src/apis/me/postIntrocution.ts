import { call } from "src/apis/call";

export function postIntrocutionAPI(
  data: FormData
): Promise<IUser["introduction"]> {
  return call({
    method: "post",
    url: "/me/introduction",
    data
  });
}
