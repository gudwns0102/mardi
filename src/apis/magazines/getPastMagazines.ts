import { call } from "src/apis/call";

export const getPastMagazines = (params: {
  page: number;
  page_size: number;
}) => {
  return call<PageResponse<Magazine>>({
    method: "get",
    url: "/magazines/past",
    params
  });
};
