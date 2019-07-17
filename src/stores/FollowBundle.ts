import { flow, types } from "mobx-state-tree";

import {
  getFollowersAPI,
  getFollowingsAPI,
  getUnfollowedAPI,
  IFollowParams
} from "src/apis";

export type FollowBundleType = "FOLLOWING" | "FOLLOWER" | "RECOMMEND";

const INIT_PAGE = 1;
const PAGE_SIZE = 30;

export const FollowBundle = types
  .model({
    type: types.optional(types.frozen<FollowBundleType>(), "FOLLOWER"),
    follows: types.optional(types.map(types.frozen<IFollow>()), {}),
    refreshing: types.optional(types.boolean, false),
    page: types.optional(types.number, INIT_PAGE),
    reachEnd: types.optional(types.boolean, false),
    isFetching: types.optional(types.boolean, false)
  })
  .volatile(_ => ({
    params: { uuid: "" } as IFollowParams
  }))
  .views(self => {
    return {
      get followArray() {
        return Array.from(self.follows.values());
      }
    };
  })
  .actions(self => {
    const getQuery = () => {
      const queryMap: {
        [key in FollowBundleType]:
          | typeof getFollowersAPI
          | typeof getFollowingsAPI
          | typeof getUnfollowedAPI
      } = {
        FOLLOWER: getFollowersAPI,
        FOLLOWING: getFollowingsAPI,
        RECOMMEND: getUnfollowedAPI
      };

      return queryMap[self.type];
    };

    const clearFollows = () => {
      self.follows.clear();
    };

    const clearPage = () => {
      self.page = INIT_PAGE;
      self.reachEnd = false;
    };

    const updateFollows = (follows: IFollow[]) => {
      follows.forEach(follower => {
        self.follows.set(follower.uuid, follower);
      });
    };

    const fetchFollows = flow(function*() {
      if (self.isFetching || self.reachEnd) {
        return [];
      }
      try {
        self.isFetching = true;
        const currentPage = self.page;
        const data = {
          ...self.params,
          page: self.page,
          page_size: PAGE_SIZE
        };

        const query = getQuery();

        const {
          next,
          results: follows
        }: RetrieveAsyncFunc<typeof query> = yield query(data);

        self.page = currentPage + 1;
        self.reachEnd = next === null;

        return follows;
      } finally {
        self.isFetching = false;
      }
    });

    const initializeFollows = flow(function*(
      type: FollowBundleType,
      params?: IFollowParams
    ) {
      self.type = type;
      if (params) {
        self.params = { ...params };
      }

      clearFollows();
      clearPage();
      const follows: RetrieveAsyncFunc<
        typeof fetchFollows
      > = yield fetchFollows();
      updateFollows(follows);
    });

    const refreshFollows = flow(function*() {
      if (self.refreshing) {
        return;
      }
      self.refreshing = true;
      clearPage();
      const follows = yield fetchFollows();
      clearFollows();
      updateFollows(follows);
      self.refreshing = false;
    });

    const appendFollows = flow(function*() {
      const follows = yield fetchFollows();
      updateFollows(follows);
    });

    const updateIfExists = (uuid: IFollow["uuid"], data: Partial<IFollow>) => {
      const following = self.follows.get(uuid);

      if (!following) {
        return;
      }

      self.follows.set(uuid, { ...following, ...data });
    };

    return {
      initializeFollows,
      refreshFollows,
      appendFollows,
      updateIfExists
    };
  });

export type IFollowBundle = typeof FollowBundle.Type;
