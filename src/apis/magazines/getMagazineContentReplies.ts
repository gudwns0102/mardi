import { call } from "src/apis/call";

export const getMagazineContentReplies = ({
  magazineContentId,
  magazineId
}: {
  magazineId: number;
  magazineContentId: number;
}) => {
  return call<PageResponse<IReply>>({
    method: "get",
    url: `/magazines/${magazineId}/contents/${magazineContentId}/replies`
  });
};
