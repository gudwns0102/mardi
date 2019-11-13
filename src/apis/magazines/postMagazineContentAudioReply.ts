import { call } from "src/apis/call";

export function postMagazineContentAudioReply({
  magazineContentId,
  magazineId,
  audioForm
}: {
  magazineId: number;
  magazineContentId: number;
  audioForm: FormData;
}): Promise<IReply> {
  return call({
    method: "post",
    url: `/magazines/${magazineId}/contents/${magazineContentId}/replies`,
    data: audioForm,
    headers: { "Content-Type": "multipart/form-data" }
  });
}
