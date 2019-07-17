import { call } from "src/apis/call";

export const postAnnouncePlay = (announceId: IAnnounce["id"]) => {
  return call({
    method: "post",
    url: `/announces/${announceId}/play`
  });
};
