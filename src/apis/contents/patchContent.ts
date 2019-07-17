import { call } from "src/apis/call";

export function patchContentAPI(contentId: IContent["id"], data: FormData) {
  return call({
    method: "patch",
    url: `contents/${contentId}`,
    headers: { "Content-Type": "multipart/form-data" },
    data
  });
}
