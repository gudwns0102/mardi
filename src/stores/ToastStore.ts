import _ from "lodash";
import { flow, types } from "mobx-state-tree";

export type ToastType = "INFO" | "ERROR" | "CLOSABLE";

const DEFAULT_DURATION = 3000;

export const ToastStore = types
  .model({
    id: types.optional(types.number, 0),
    type: types.optional(types.frozen<ToastType>(), "INFO"),
    content: types.optional(types.string, ""),
    show: types.optional(types.boolean, false),
    marginTop: types.optional(types.number, 0)
  })
  .volatile(() => ({
    onClose: _.identity,
    onFollowPress: _.identity
  }))
  .actions(self => {
    const openToast = flow(function*({
      type = "INFO",
      content = "",
      duration = DEFAULT_DURATION,
      marginTop = 0,
      onClose = _.identity,
      onFollowPress = _.identity
    }: {
      type: ToastType;
      content: string;
      duration?: number;
      marginTop?: number;
      onClose?: () => any;
      onFollowPress?: () => any;
    }) {
      const currentId = self.id + 1;

      self.id = currentId;
      self.type = type;
      self.content = content;
      self.show = true;
      self.marginTop = marginTop;
      self.onClose = onClose;
      self.onFollowPress = onFollowPress;

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
