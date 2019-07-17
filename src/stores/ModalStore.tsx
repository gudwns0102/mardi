import { types } from "mobx-state-tree";

type ModalType = "RATING";

export const ModalStore = types
  .model({
    show: types.optional(types.boolean, false),
    type: types.optional(types.frozen<ModalType>(), "RATING")
  })
  .actions(self => {
    const showModal = (type: ModalType) => {
      self.show = true;
      self.type = type;
    };

    const hideModal = () => {
      self.show = false;
    };

    return {
      showModal,
      hideModal
    };
  });

export type IModalStore = typeof ModalStore.Type;
