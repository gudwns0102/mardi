import { call } from "src/apis/call";

interface Input {
  contentId: IContent["id"];
  audioForm: FormData;
}

export function postAudioReplyAPI({
  contentId,
  audioForm
}: Input): Promise<IReply> {
  return call({
    method: "post",
    url: `/contents/${contentId}/replies`,
    data: audioForm,
    headers: { "Content-Type": "multipart/form-data" }
  });
}
