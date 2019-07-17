import { call } from "src/apis/call";

interface IResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IFeed[];
}

export function getUserFeedsAPI(
  uuid: IUser["uuid"],
  page: number
): Promise<IResponse> {
  return call({
    method: "get",
    url: `me/feeds?page=${page}&page_size=50`
  });
}
