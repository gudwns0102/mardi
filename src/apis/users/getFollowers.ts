import { call } from "src/apis/call";

export interface IFollowParams {
  uuid: IUser["uuid"];
  order?: "-num_followers";
}

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

export function getFollowersAPI(params: IBody): Promise<IResponse> {
  const { uuid, ...rest } = params;
  return call({
    method: "get",
    url: `users/${uuid}/followers`,
    params: rest
  });
}
