import { call } from "src/apis/call";

export interface IContentParams {
  user?: IUser["uuid"];
  search?: string;
  question?: IQuestion["id"];
  famous?: boolean;
}

interface IBody extends IContentParams {
  page: number;
  page_size: number;
}

interface IResponse {
  count: number;
  next: number | null;
  previous: number | null;
  results: IContent[];
}

export function getContentsAPI(data: IBody): Promise<IResponse> {
  return call({
    method: "get",
    url: "/contents",
    params: data
  });
}
