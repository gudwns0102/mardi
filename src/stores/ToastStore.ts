import _ from "lodash";
import { flow, types } from "mobx-state-tree";

export type ToastType = "INFO" | "ERROR";

const DEFAULT_DURATION = 3000;

export const ToastStore = types
  .model({
    id: types.optional(types.number, 0),
    type: types.optional(types.frozen<ToastType>(), "INFO"),
    content: types.optional(types.string, ""),
    show: types.optional(types.boolean, false),
    marginTop: types.optional(types.number, 0)
  })
  .actions(self => {
    const openToast = flow(function*({
      type = "INFO",
      content = "",
      duration = DEFAULT_DURATION,
      marginTop = 0
    }: {
      type: ToastType;
      content: string;
      duration?: number;
      marginTop?: number;
    }) {
      const currentId = self.id + 1;

      self.id = currentId;
      self.type = type;
      self.content = content;
      self.show = true;
      self.marginTop = marginTop;

      yield new Promise(resolve => setTimeout(resolve, duration));

      if (currentId >= self.id) {
        self.show = false;
      }
    });

    const closeToast = () => {
      self.type = "INFO";
      self.content = "";
      self.show = false;
    };

    return {
      openToast,
      closeToast
    };
  });

export type IToastStore = typeof ToastStore.Type;
