import { call } from "src/apis/call";

type IResponse = IQuestion[];

export function getQuestionsAPI(): Promise<IResponse> {
  return call({
    method: "get",
    url: "/questions"
  });
}
