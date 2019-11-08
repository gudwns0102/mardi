import { types } from "mobx-state-tree";

import { AnnounceStore } from "src/stores/AnnounceStore";
import { AppStore } from "src/stores/AppStore";
import { AudioStore } from "src/stores/AudioStore";
import { AuthStore } from "src/stores/AuthStore";
import { ContentStore } from "src/stores/ContentStore";
import { FeedStore } from "src/stores/FeedStore";
import { FollowStore } from "src/stores/FollowStore";
import { LoadingStore } from "src/stores/LoadingStore";
import { MagazineStore } from "src/stores/MagazineStore";
import { ModalStore } from "src/stores/ModalStore";
import { NetStatusStore } from "src/stores/NetStatusStore";
import { QuestionStore } from "src/stores/QuestionStore";
import { RecommendStore } from "src/stores/RecommendStore";
import { ReplyStore } from "src/stores/ReplyStore";
import { IRootStoreType } from "src/stores/RootStoreHelper";
import { ToastStore } from "src/stores/ToastStore";
import { UploadStore } from "src/stores/UploadStore";
import { UserStore } from "src/stores/UserStore";

export const RootStore = types.model({
  announceStore: types.optional(AnnounceStore, {}),
  appStore: types.optional(AppStore, {}),
  audioStore: types.optional(AudioStore, {}),
  authStore: types.optional(AuthStore, {}),
  contentStore: types.optional(ContentStore, {}),
  feedStore: types.optional(FeedStore, {}),
  followStore: types.optional(FollowStore, {}),
  loadingStore: types.optional(LoadingStore, {}),
  magazineStore: types.optional(MagazineStore, {}),
  modalStore: types.optional(ModalStore, {}),
  netStatusStore: types.optional(NetStatusStore, {}),
  questionStore: types.optional(QuestionStore, {}),
  recommendStore: types.optional(RecommendStore, {}),
  replyStore: types.optional(ReplyStore, {}),
  toastStore: types.optional(ToastStore, {}),
  uploadStore: types.optional(UploadStore, {}),
  userStore: types.optional(UserStore, {})
});

let store: IRootStore | null = null;

export type IRootStore = typeof RootStore.Type;

export const getStore = (): IRootStoreType => {
  if (!store) {
    store = RootStore.create({});
    return store;
  }

  return store;
};
