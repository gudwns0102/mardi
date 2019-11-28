import { flow, types } from "mobx-state-tree";

import {
  deleteContentAPI,
  getContentAPI,
  patchContentAPI,
  postConentBlockAPI,
  postContentAPI,
  postContentHeartAPI,
  postContentPlayAPI,
  postContentPlayHalfAPI,
  postReportsAPI
} from "src/apis";
import ContentBundle from "src/stores/ContentBundle";
import { getRootStore } from "src/stores/RootStoreHelper";
import { audioPathToFormUri } from "src/utils/Audio";

export const ContentStore = types
  .model({
    bundles: types.optional(types.map(ContentBundle), {})
  })
  .actions(self => {
    const rootStore = getRootStore(self);

    const createContentBundle = (storeId: string) => {
      const contentBundle = self.bundles.get(storeId);

      if (contentBundle) {
        return contentBundle;
      }

      const newContentBundle = ContentBundle.create();
      self.bundles.set(storeId, newContentBundle);
      return newContentBundle;
    };

    const clearContentBundle = (storeId: string) => {
      self.bundles.delete(storeId);
    };

    const refreshAllContentBundles = () => {
      self.bundles.forEach(bundle => bundle.refreshContents());
    };

    const updateAllContentBundles = (
      contentId: IContent["id"],
      contentData: Partial<Omit<IContent, "id">>
    ) => {
      self.bundles.forEach(bundle =>
        bundle.updateContentIfExist(contentId, contentData)
      );
    };

    const clickHeart = flow(function*(contentId: IContent["id"]) {
      try {
        const newContent: RetrieveAsyncFunc<
          typeof postContentHeartAPI
        > = yield postContentHeartAPI({ contentId });

        updateAllContentBundles(contentId, newContent);
        rootStore.audioStore.updateAudioIfExist({
          type: "CONTENT",
          id: contentId,
          heart_by_me: newContent.heart_by_me,
          num_hearts: newContent.num_hearts
        });
      } catch (error) {
        return;
      }
    });

    const increasePlayCount = flow(function*(contentId: IContent["id"]) {
      const newContent: RetrieveAsyncFunc<
        typeof postContentPlayAPI
      > = yield postContentPlayAPI(contentId);

      updateAllContentBundles(contentId, newContent);
    });

    const increaseHalfPlayCount = (contentId: IContent["id"]) => {
      postContentPlayHalfAPI(contentId);
    };

    const getContent = (contentId: IContent["id"]) => {
      return getContentAPI(contentId);
    };

    const postContent = flow(function*(data: {
      title: string;
      audio: string;
      questionId?: number;
      image?: string;
      default_image_color_idx: number;
      default_image_pattern_idx: number;
    }) {
      const audioForm = new FormData();
      const extension = data.audio.split(".").pop();
      audioForm.append("title", data.title);
      audioForm.append(
        "default_image_color_idx",
        data.default_image_color_idx.toString()
      );
      audioForm.append(
        "default_image_pattern_idx",
        data.default_image_pattern_idx.toString()
      );
      audioForm.append("audio", {
        uri: audioPathToFormUri(data.audio),
        name: `freeContent.${extension}`,
        type: `audio/${extension}`
      } as any);

      if (data.image) {
        audioForm.append("image", {
          uri: data.image,
          name: "background.jpeg",
          type: "image/jpeg"
        } as any);
      }

      if (data.questionId) {
        audioForm.append("question", data.questionId!.toString());
      }

      try {
        const response: RetrieveAsyncFunc<
          typeof postContentAPI
        > = yield postContentAPI(audioForm);

        refreshAllContentBundles();

        rootStore.userStore.fetchClient();
        return !!response;
      } catch (error) {
        return false;
      }
    });

    const patchContent = flow(function*(
      contentId: IContent["id"],
      data: { title: string; image?: string }
    ) {
      const form = new FormData();
      form.append("title", data.title);
      if (data.image) {
        form.append("image", {
          uri: data.image,
          name: "background.jpeg",
          type: "image/jpeg"
        } as any);
      }

      try {
        const response: RetrieveAsyncFunc<
          typeof patchContentAPI
        > = yield patchContentAPI(contentId, form);

        refreshAllContentBundles();
        rootStore.userStore.fetchClient();
        return !!response;
      } catch (error) {
        return false;
      }
    });

    const deleteContent = flow(function*(contentId: IContent["id"]) {
      yield deleteContentAPI(contentId);
      refreshAllContentBundles();
      rootStore.userStore.fetchClient();
      rootStore.audioStore.popAudio(contentId);
    });

    const blockContent = flow(function*(contentId: IContent["id"]) {
      yield postConentBlockAPI(contentId);
      refreshAllContentBundles();

      rootStore.userStore.fetchClient();
      rootStore.audioStore.popAudio(contentId);
    });

    const reportContent = flow(function*(contentId: IContent["id"]) {
      const { clientId } = rootStore.userStore;
      yield postReportsAPI({
        type: "content",
        target_id: contentId,
        user: clientId!,
        content: "REPORTS"
      });
    });

    return {
      createContentBundle,
      clearContentBundle,
      refreshAllContentBundles,
      clickHeart,
      increasePlayCount,
      increaseHalfPlayCount,
      getContent,
      postContent,
      patchContent,
      deleteContent,
      blockContent,
      reportContent,
      updateAllContentBundles
    };
  });

export type IContentStore = typeof ContentStore.Type;
