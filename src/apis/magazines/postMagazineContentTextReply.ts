/*tslint:disable*/
import { call } from "src/apis/call";

export function postMagazineContentTextReply({
  magazineId,
  magazineContentId,
  ...data
}: {
  magazineId: number;
  magazineContentId: number;
  type: "text";
  text: string;
  hidden: boolean;
  tagged_user?: string;
}): Promise<IReply> {
  return call({
    method: "post",
    url: `/magazines/${magazineId}/contents/${magazineContentId}/replies`,
    data
  });
}
