import { call } from "src/apis/call";

export function deleteContentAPI(contentId: IContent["id"]) {
  return call({
    method: "delete",
    url: `/contents/${contentId}`
  });
}
