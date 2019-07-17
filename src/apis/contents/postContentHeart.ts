import { call } from "src/apis/call";

interface Input {
  contentId: IContent["id"];
}

type IResponse = IContent;

export function postContentHeartAPI(input: Input): Promise<IResponse> {
  return call({
    method: "post",
    url: `contents/${input.contentId}/heart`
  });
}
