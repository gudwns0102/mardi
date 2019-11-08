import { call } from "src/apis/call";

export const getLatestMagazine = () => {
  return call<Magazine>({
    method: "get",
    url: "/magazines/latest"
  });
};
