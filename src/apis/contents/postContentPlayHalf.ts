import { call } from "src/apis/call";

export function postContentPlayHalfAPI(contentId: number) {
  return call({
    method: "post",
    url: `contents/${contentId}/halfover_play`,
  });
}
