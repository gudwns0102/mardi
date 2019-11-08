import { call } from "src/apis/call";

export async function getTop30Contents(): Promise<PageResponse<IContent>> {
  const contents = await call<IContent[]>({
    method: "get",
    url: "/contents/famous"
  });

  return {
    count: 30,
    next: null,
    previous: null,
    results: contents
  };
}
