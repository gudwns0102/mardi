import { call } from "src/apis/call";

export function getQuestionCuraiontsAPI(): Promise<ICuration[]> {
  return call({
    method: "get",
    url: "questions/curations"
  });
}
