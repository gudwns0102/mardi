import { types } from "mobx-state-tree";

export const UploadStore = types
  .model({
    title: types.optional(types.string, ""),
    image: types.maybeNull(types.string)
  })
  .actions(self => {
    const saveContent = (title: string, image: string | null) => {
      self.title = title;
      self.image = image;
    };

    const clearContent = () => {
      self.title = "";
      self.image = null;
    };

    return {
      saveContent,
      clearContent
    };
  });

export type IUploadStore = typeof UploadStore.Type;
