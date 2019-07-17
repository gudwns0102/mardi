import { call } from "src/apis/call";

export function getKeywordCategoriesAPI(): Promise<ICategory[]> {
  return call({
    method: "get",
    url: "/kwCategories"
  });
}
