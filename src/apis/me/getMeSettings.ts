import { call } from "src/apis/call";

export function getMeSettings(): Promise<IUserSettings> {
  return call({
    method: "get",
    url: "me/settings"
  });
}
