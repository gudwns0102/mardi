import { call } from "src/apis/call";

export function postUserPageVisitAPI(uuid: string) {
  return call({
    method: "post",
    url: `/users/${uuid}/mypage`
  });
}
