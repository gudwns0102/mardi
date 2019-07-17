import { call } from "src/apis/call";

export function postConentBlockAPI(contentId: IContent["id"]) {
  return call({
    method: "post",
    url: `contents/${contentId}/block`
  });
}
