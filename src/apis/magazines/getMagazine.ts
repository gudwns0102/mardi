import { call } from "src/apis/call";

export const getMagazine = (id: number) => {
  return call<Magazine>({
    method: "get",
    url: `/magazines/${id}`
  });
};
