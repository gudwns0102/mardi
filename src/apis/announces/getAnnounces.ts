import { call } from "src/apis/call";

export const getAnnounces = (): Promise<IAnnounce[]> => {
  return call({
    method: "get",
    url: "/announces"
  });
};
