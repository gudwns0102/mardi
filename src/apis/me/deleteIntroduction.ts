import { call } from "src/apis/call";

export function deleteIntroductionAPI(): Promise<string> {
  return call({
    method: "delete",
    url: "/me/introduction",
  });
}
