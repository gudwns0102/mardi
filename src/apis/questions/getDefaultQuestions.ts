import { call } from "src/apis/call";

export function getDefaultQuestionsAPI(): Promise<IDefaultQuestion[]> {
  return call({
    method: "get",
    url: "/questions/defaults"
  });
}
