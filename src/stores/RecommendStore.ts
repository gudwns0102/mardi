import { flow, types } from "mobx-state-tree";

import { getRecommendKeywordsAPI } from "src/apis";

export const RecommendStore = types
  .model({
    recommends: types.optional(types.map(types.frozen<IRecommend>()), {})
  })
  .actions(self => {
    const fetchRecommends = flow(function*() {
      const recommends: RetrieveAsyncFunc<
        typeof getRecommendKeywordsAPI
      > = yield getRecommendKeywordsAPI();

      recommends.map(recommend =>
        self.recommends.set(recommend.id.toString(), recommend)
      );
    });

    return {
      fetchRecommends
    };
  })
  .views(self => {
    return {
      get recommendArray() {
        return Array.from(self.recommends.values());
      }
    };
  });

export type IRecommendStore = typeof RecommendStore.Type;
