import { call } from "src/apis/call";

export function getRecommendKeywordsAPI(): Promise<IRecommend[]> {
  return call({
    method: "get",
    url: "/recommend-keywords"
  });
}
