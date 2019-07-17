import { flow, types } from "mobx-state-tree";

import { postUserFollowAPI } from "src/apis";
import { FollowBundle } from "src/stores/FollowBundle";
import { getRootStore } from "src/stores/RootStoreHelper";

export const FollowStore = types
  .model({
    bundles: types.optional(types.map(FollowBundle), {})
  })
  .actions(self => {
    const rootStore = getRootStore(self);

    const createBundle = (bundleId: string) => {
      const followBundle = self.bundles.get(bundleId);

      if (followBundle) {
        return followBundle;
      }

      const newFollowBundle = FollowBundle.create();
      self.bundles.set(bundleId, newFollowBundle);
      return newFollowBundle;
    };

    const clearBundle = (bundleId: string) => {
      self.bundles.delete(bundleId);
    };

    const updateAllFollowBundles = (follow: IFollow) => {
      self.bundles.forEach(bundle =>
        bundle.updateIfExists(follow.uuid, follow)
      );
    };

    const toggleFollow = flow(function*(followId: IUser["uuid"]) {
      try {
        const { userStore, contentStore } = rootStore;
        const response: RetrieveAsyncFunc<
          typeof postUserFollowAPI
        > = yield postUserFollowAPI(followId);

        const {
          uuid,
          email,
          name,
          username,
          photo,
          follow_by_me,
          num_followers,
          num_followings
        } = response;

        if (!response) {
          return false;
        }

        updateAllFollowBundles({
          uuid,
          email,
          name,
          username,
          follow_by_me,
          photo
        });

        userStore.fetchClient();

        userStore.upsertUserById(uuid, {
          follow_by_me,
          num_followers,
          num_followings
        });

        contentStore.refreshAllContentBundles();

        return true;
      } catch (error) {
        return false;
      }
    });

    return {
      createBundle,
      clearBundle,
      toggleFollow
    };
  });

export type IFollowStore = typeof FollowStore.Type;
