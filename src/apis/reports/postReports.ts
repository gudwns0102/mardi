import { call } from "src/apis/call";

type ReportType = "reply" | "content";

export function postReportsAPI(data: {
  type: ReportType;
  user: IUser["uuid"];
  target_id: IReply["id"];
  content: string;
}): Promise<any> {
  return call({
    method: "post",
    url: "reports",
    data
  });
}
