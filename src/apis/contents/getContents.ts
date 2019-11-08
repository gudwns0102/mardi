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

export function getContentsAPI(data: IBody) {
  return call<PageResponse<IContent>>({
    method: "get",
    url: "/contents",
    params: data
  });
}
