import { types } from "mobx-state-tree";

export const LoadingStore = types
  .model({
    show: types.optional(types.boolean, false)
  })
  .actions(self => {
    const showLoading = () => {
      self.show = true;
    };

    const hideLoading = () => {
      self.show = false;
    };

    return {
      showLoading,
      hideLoading
    };
  });

export type ILoadingStore = typeof LoadingStore.Type;
