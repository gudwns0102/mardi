import { call } from "src/apis/call";

interface Input {
  page: number;
  page_size: number;
  contentId: number;
}

interface IResponse {
  count: number;
  next: number | null;
  previous: number | null;
  results: IReply[];
}

export function getContentRepliesAPI({
  contentId,
  ...params
}: Input): Promise<IResponse> {
  return call({
    method: "get",
    url: `contents/${contentId}/replies`,
    params
  });
}
