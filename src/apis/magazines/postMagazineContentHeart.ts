import { call } from "src/apis/call";

export const postMagazineContentHeart = ({
  magazineContentId,
  magazineId
}: {
  magazineId: number;
  magazineContentId: number;
}) => {
  return call<MagazineContent>({
    method: "post",
    url: `/magazines/${magazineId}/contents/${magazineContentId}/heart`
  });
};
