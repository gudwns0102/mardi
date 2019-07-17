import { flow, types } from "mobx-state-tree";

import { getUserFeedsAPI } from "src/apis";
import { getRootStore } from "src/stores/RootStoreHelper";

const INITIAL_PAGE = 1;

export const FeedStore = types
  .model({
    feeds: types.optional(types.map(types.frozen<IFeed>()), {}),
    page: types.optional(types.number, INITIAL_PAGE),
    reachEnd: types.optional(types.boolean, false),
    refreshing: types.optional(types.boolean, false)
  })
  .views(self => {
    return {
      get feedArray() {
        return Array.from(self.feeds.values());
      }
    };
  })
  .actions(self => {
    const rootStore = getRootStore(self);

    const clearFeeds = () => {
      self.feeds.clear();
    };

    const clearPage = () => {
      self.page = INITIAL_PAGE;
      self.reachEnd = false;
    };

    const fetchFeeds = flow(function*() {
      const currentPage = self.page;
      const uuid = rootStore.userStore.clientId;

      if (!uuid || self.reachEnd) {
        return [];
      }

      try {
        const {
          next,
          results: feeds
        }: RetrieveAsyncFunc<typeof getUserFeedsAPI> = yield getUserFeedsAPI(
          uuid,
          self.page
        );
        self.page = currentPage + 1;
        self.reachEnd = next === null;

        return feeds;
      } catch (error) {
        return [];
      }
    });

    const updateFeeds = (feeds: IFeed[]) => {
      feeds.forEach(feed => self.feeds.set(feed.id.toString(), feed));
    };

    const initializeFeeds = flow(function*() {
      clearFeeds();
      clearPage();
      const feeds = yield fetchFeeds();
      updateFeeds(feeds);
    });

    const refreshFeeds = flow(function*() {
      if (self.refreshing) {
        return;
      }

      self.refreshing = true;
      clearPage();

      try {
        const feeds = yield fetchFeeds();
        clearFeeds();
        updateFeeds(feeds);
        self.refreshing = false;
      } catch (error) {
        self.refreshing = false;
      }
    });
    const appendFeeds = flow(function*() {
      const feeds = yield fetchFeeds();
      updateFeeds(feeds);
    });

    return {
      initializeFeeds,
      refreshFeeds,
      appendFeeds
    };
  });

export type IFeedStore = typeof FeedStore.Type;
