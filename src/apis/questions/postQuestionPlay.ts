import { call } from "src/apis/call";

export function postQuestionPlayAPI(questionId: IQuestion["id"]) {
  return call({
    method: "post",
    url: `/questions/${questionId}/play`
  });
}
