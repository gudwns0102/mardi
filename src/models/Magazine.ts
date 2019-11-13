import { types } from "mobx-state-tree";

import { MagazineContent } from "src/models/MagazineContent";

export const Magazine = types.model({
  contents: types.optional(types.array(MagazineContent), []),
  id: types.identifierNumber,
  title: types.string,
  color: types.string,
  exposed_at: types.optional(types.string, ""),
  created_at: types.optional(types.string, "")
});

export type IMagazine = typeof Magazine.Type;
