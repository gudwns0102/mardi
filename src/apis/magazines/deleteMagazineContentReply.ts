import { call } from "src/apis/call";

export function deleteMagazineContentReply({
  magazineId,
  magazineContentId,
  replyId
}: {
  magazineId: number;
  magazineContentId: number;
  replyId: number;
}) {
  return call({
    method: "delete",
    url: `/magazines/${magazineId}/contents/${magazineContentId}/replies/${replyId}`
  });
}
