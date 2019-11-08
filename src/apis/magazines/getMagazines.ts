import { call } from "src/apis/call";

export const getMagazines = (params: { page: number; page_size: number }) => {
  return call<PageResponse<Magazine>>({
    method: "get",
    url: "/magazines",
    params
  });
};
