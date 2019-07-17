import { call } from "src/apis/call";

export function postDefaultQuestionClickAPI(id: IDefaultQuestion["id"]) {
  return call({
    method: "post",
    url: `/questions/defaults/${id}/click`
  });
}
