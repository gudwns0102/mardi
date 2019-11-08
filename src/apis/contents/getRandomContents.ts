import { call } from "src/apis/call";

export async function getRandomContents() {
  return call<IContent[]>({
    method: "get",
    url: "/contents/random"
  });
}
