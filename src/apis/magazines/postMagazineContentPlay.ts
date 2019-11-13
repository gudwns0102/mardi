import { call } from "src/apis/call";

export const postMagazineContentPlay = ({
  magazineContentId,
  magazineId
}: {
  magazineId: number;
  magazineContentId: number;
}) => {
  return call<MagazineContent>({
    method: "post",
    url: `/magazines/${magazineId}/contents/${magazineContentId}/play`
  });
};
