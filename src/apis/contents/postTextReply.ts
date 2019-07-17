/*tslint:disable*/
import { call } from "src/apis/call";

interface Input {
  contentId: IContent["id"];
  type: "text";
  text: string;
  hidden: boolean;
  tagged_user?: string;
}

export function postTextReplyAPI({
  contentId,
  type,
  text,
  hidden,
  tagged_user
}: Input): Promise<IReply> {
  return call({
    method: "post",
    url: `/contents/${contentId}/replies`,
    data: {
      type,
      text,
      hidden,
      tagged_user
    }
  });
}
