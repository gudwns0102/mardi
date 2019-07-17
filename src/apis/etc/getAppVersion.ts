import { call } from "src/apis/call";

export function getAppVersionAPI(): Promise<{ app_version: string }> {
  return call({
    method: "get",
    url: "/etc/app-version",
    headers: {
      Authorization: "",
    },
  });
}
