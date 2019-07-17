import { call } from "src/apis/call";
import { IContentParams } from "./getContents";

interface IResponse {
  count: number;
  next: number | null;
  previous: number | null;
  results: IContent[];
}

interface IBody extends IContentParams {
  page: number;
  page_size: number;
}

export function getHomeContentsAPI(params: IBody): Promise<IResponse> {
  return call({
    method: "get",
    url: "/contents/home",
    params
  });
}
