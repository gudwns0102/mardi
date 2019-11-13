import { call } from "src/apis/call";

export async function getTop30Contents(): Promise<PageResponse<IContent>> {
  return call({
    method: "get",
    url: "/contents/famous",
    params: {
      page_size: 30
    }
  });
}
