import { call } from "src/apis/call";

import { IFollowParams } from "src/apis/users/getFollowers";

interface IBody extends IFollowParams {
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

export function getFollowingsAPI(body: IBody): Promise<IResponse> {
  const { uuid, ...params } = body;
  return call({
    method: "get",
    url: `users/${uuid}/followings`,
    params
  });
}
