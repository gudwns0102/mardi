import { call } from "src/apis/call";

export function deleteReplyAPI({
  contentId,
  replyId
}: {
  contentId: IContent["id"];
  replyId: IReply["id"];
}): Promise<any> {
  return call({
    method: "delete",
    url: `contents/${contentId}/replies/${replyId}`
  });
}
