import { call } from "src/apis/call";

export function postContentPlayAPI(
  contentId: IContent["id"]
): Promise<IContent> {
  return call({
    method: "post",
    url: `/contents/${contentId}/play`
  });
}
