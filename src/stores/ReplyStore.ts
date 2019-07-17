import { flow, types } from "mobx-state-tree";
import uuid from "uuid";

import {
  deleteReplyAPI,
  postAudioReplyAPI,
  postReportsAPI,
  postTextReplyAPI
} from "src/apis";
import ReplyBundle, { IReplyBundle } from "src/stores/ReplyBundle";
import { getRootStore } from "src/stores/RootStoreHelper";
import { audioPathToFormUri } from "src/utils/Audio";

export const ReplyStore = types
  .model({
    replyBundles: types.optional(types.map(ReplyBundle), {})
  })
  .actions(self => {
    const rootStore = getRootStore(self);
    const createBundle = (contentId: IContent["id"]): string => {
      const bundleId = uuid();

      if ([...self.replyBundles.keys()].includes(bundleId)) {
        return createBundle(contentId);
      }

      const bundle = ReplyBundle.create({ contentId });

      self.replyBundles.set(bundleId, bundle);

      return bundleId;
    };

    const clearBundle = (bundleId: string) => {
      self.replyBundles.delete(bundleId);
    };

    const getBundlesByContentId = (contentId: IContent["id"]) => {
      return [...self.replyBundles.entries()].filter(
        ([bundleId, bundle]) => bundle.contentId === contentId
      );
    };

    const changeBundlesReplies = (
      contentId: IContent["id"],
      predicate: (entry: [string, IReplyBundle]) => any
    ) => {
      getBundlesByContentId(contentId).map(predicate);
    };

    const postTextReply = flow(function*(
      contentId: IContent["id"],
      data: {
        type: "text";
        text: string;
        hidden: boolean;
        tagged_user?: ITaggedUser["uuid"];
      }
    ) {
      try {
        const response: RetrieveAsyncFunc<
          typeof postTextReplyAPI
        > = yield postTextReplyAPI({ contentId, ...data });

        changeBundlesReplies(contentId, ([bundleId, bundle]) => {
          bundle.replace([...bundle.replies.values(), response]);
          bundle.increaseCount();
          rootStore.contentStore.updateAllContentBundles(contentId, {
            num_replies: bundle.count
          });
        });

        return true;
      } catch (error) {
        return false;
      }
    });

    const postAudioReply = flow(function*(
      contentId: IContent["id"],
      {
        uri,
        tagged_user,
        hidden
      }: { uri: string; tagged_user?: ITaggedUser["uuid"]; hidden: boolean }
    ) {
      const audioForm = new FormData();
      const extension = uri.split(".").pop();
      audioForm.append("type", "audio");
      audioForm.append("audio", {
        uri: audioPathToFormUri(uri),
        name: `audio.${extension}`,
        type: `audio/${extension}`
      } as any);

      if (tagged_user) {
        audioForm.append("tagged_user", tagged_user);
      }

      if (hidden) {
        audioForm.append("hidden", hidden as any);
      }

      try {
        const response: RetrieveAsyncFunc<
          typeof postAudioReplyAPI
        > = yield postAudioReplyAPI({ contentId, audioForm });

        changeBundlesReplies(contentId, ([bundleId, bundle]) => {
          bundle.replace([...bundle.replies.values(), response]);
          bundle.increaseCount();
          rootStore.contentStore.updateAllContentBundles(contentId, {
            num_replies: bundle.count
          });
        });

        return true;
      } catch (error) {
        return false;
      }
    });

    const deleteReply = flow(function*({
      contentId,
      replyId
    }: {
      contentId: IContent["id"];
      replyId: IReply["id"];
    }) {
      yield deleteReplyAPI({ contentId, replyId });

      changeBundlesReplies(contentId, ([bundleId, bundle]) => {
        bundle.replace(
          [...bundle.replies.values()].filter(reply => reply.id !== replyId)
        );

        bundle.decreaseCount();
      });
    });

    const reportReply = flow(function*(data: {
      uuid: string;
      replyId: number;
      content: string;
    }) {
      try {
        yield postReportsAPI({
          type: "reply",
          user: data.uuid,
          target_id: data.replyId,
          content: data.content
        });
        return true;
      } catch (error) {
        return false;
      }
    });

    return {
      createBundle,
      clearBundle,
      postTextReply,
      postAudioReply,
      deleteReply,
      reportReply
    };
  });

export type IReplyStore = typeof ReplyStore.Type;
