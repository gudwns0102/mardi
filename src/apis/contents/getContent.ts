import { call } from "src/apis/call";

export function getContentAPI(contentId: IContent["id"]): Promise<IContent> {
  return call({
    method: "get",
    url: `/contents/${contentId}`
  });
}
