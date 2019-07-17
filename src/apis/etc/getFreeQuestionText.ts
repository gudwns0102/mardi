import { call } from "src/apis/call";

export function getFreeQuestionTextAPI(): Promise<{
  default_questions: string[];
}> {
  return call({
    method: "get",
    url: "etc/default-questions",
  });
}
