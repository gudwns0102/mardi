import { call } from "src/apis/call";

export function postContentAPI(audioForm: FormData): Promise<IContent> {
  return call({
    method: "post",
    url: "contents",
    data: audioForm,
    headers: { "Content-Type": "multipart/form-data" }
  });
}
