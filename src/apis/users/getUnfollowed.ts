import { call } from "src/apis/call";

import { IFollowParams } from "src/apis/users/getFollowers";

export interface IBody extends Omit<IFollowParams, "uuid"> {
  page: number;
  page_size: number;
}

interface IResponse {
  count: number;
  page: number;
  total_pages: number;
  next: number | null;
  previous: number | null;
  results: IFollow[];
}

export function getUnfollowedAPI(body: IBody): Promise<IResponse> {
  return call({
    method: "get",
    url: `users/unfollowed`,
    params: { ...body }
  });
}
