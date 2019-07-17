import { call } from "src/apis/call";

export function patchMeSettings(
  data: Partial<IUserSettings>
): Promise<IUserSettings> {
  return call({
    method: "patch",
    url: "me/settings",
    data
  });
}
