import { flow, types } from "mobx-state-tree";

import { getContentRepliesAPI } from "src/apis";

const INITIAL_PAGE = 1;
const DEFAULT_PAGE_SIZE = 15000;

const ReplyBundle = types
  .model({
    contentId: types.maybeNull(types.number),
    replies: types.optional(types.map(types.frozen<IReply>()), {}),
    count: types.optional(types.number, 0),
    page: types.optional(types.number, INITIAL_PAGE),
    reachEnd: types.optional(types.boolean, false),
    isFetching: types.optional(types.boolean, false),
    isRefreshing: types.optional(types.boolean, false)
  })
  .actions(self => {
    const clearPage = () => {
      self.count = 0;
      self.page = INITIAL_PAGE;
      self.reachEnd = false;
      self.isFetching = false;
      self.isRefreshing = false;
    };

    const fetch = flow(function*() {
      if (self.reachEnd || self.isFetching || self.contentId === null) {
        return [];
      }

      self.isFetching = true;

      try {
        const {
          count,
          next,
          results
        }: RetrieveAsyncFunc<
          typeof getContentRepliesAPI
        > = yield getContentRepliesAPI({
          page: self.page,
          page_size: DEFAULT_PAGE_SIZE,
          contentId: self.contentId
        });

        self.count = count;
        self.page += 1;
        self.reachEnd = next === null;

        results.map(reply => self.replies.set(reply.id.toString(), reply));
      } finally {
        self.isFetching = false;
      }
    });

    const initialize = flow(function*() {
      self.replies.clear();
      clearPage();
      yield fetch();
    });

    const refresh = flow(function*() {
      if (self.isRefreshing) {
        return;
      }

      self.isRefreshing = true;
      clearPage();

      try {
        yield fetch();
      } finally {
        self.isRefreshing = false;
      }
    });

    const append = flow(function*() {
      yield fetch();
    });

    const replace = (replies: IReply[]) => {
      self.replies.clear();
      replies.map(reply => self.replies.set(reply.id.toString(), reply));
    };

    const increaseCount = () => {
      self.count = self.count + 1;
    };

    const decreaseCount = () => {
      self.count = Math.max(0, self.count - 1);
    };

    return {
      initialize,
      refresh,
      append,
      replace,
      increaseCount,
      decreaseCount
    };
  })
  .views(self => {
    return {
      get replyArray() {
        return Array.from(self.replies.values());
      }
    };
  });

export type IReplyBundle = typeof ReplyBundle.Type;

export default ReplyBundle;
