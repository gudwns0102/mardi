import { getRoot } from "mobx-state-tree";

import { IAnnounceStore } from "src/stores/AnnounceStore";
import { IAppStore } from "src/stores/AppStore";
import { IAudioStore } from "src/stores/AudioStore";
import { IAuthStore } from "src/stores/AuthStore";
import { IContentStore } from "src/stores/ContentStore";
import { IFeedStore } from "src/stores/FeedStore";
import { IFollowStore } from "src/stores/FollowStore";
import { ILoadingStore } from "src/stores/LoadingStore";
import { IMagazineStore } from "src/stores/MagazineStore";
import { IModalStore } from "src/stores/ModalStore";
import { INetStatusStore } from "src/stores/NetStatusStore";
import { IQuestionStore } from "src/stores/QuestionStore";
import { IRecommendStore } from "src/stores/RecommendStore";
import { IReplyStore } from "src/stores/ReplyStore";
import { IToastStore } from "src/stores/ToastStore";
import { IUploadStore } from "src/stores/UploadStore";
import { IUserStore } from "src/stores/UserStore";

export interface IRootStoreType {
  announceStore: IAnnounceStore;
  appStore: IAppStore;
  audioStore: IAudioStore;
  authStore: IAuthStore;
  contentStore: IContentStore;
  feedStore: IFeedStore;
  followStore: IFollowStore;
  loadingStore: ILoadingStore;
  magazineStore: IMagazineStore;
  modalStore: IModalStore;
  netStatusStore: INetStatusStore;
  questionStore: IQuestionStore;
  recommendStore: IRecommendStore;
  replyStore: IReplyStore;
  toastStore: IToastStore;
  uploadStore: IUploadStore;
  userStore: IUserStore;
}

export function getRootStore(self: any): IRootStoreType {
  return getRoot(self);
}
