import { flow, types } from "mobx-state-tree";

import { getAnnounces, postAnnouncePlay } from "src/apis";

export interface IAnnounce {
  id: number;
  title: string;
  content: string;
  audio: string | null;
  num_viewed: number;
  created_at: string;
}

export const AnnounceStore = types
  .model({
    announces: types.optional(types.map(types.frozen<IAnnounce>()), {})
  })
  .views(self => {
    return {
      get announceArray() {
        return Array.from(self.announces.values());
      }
    };
  })
  .actions(self => {
    const fetchAnnounces = flow(function*() {
      try {
        const announces: RetrieveAsyncFunc<
          typeof getAnnounces
        > = yield getAnnounces();
        return announces;
      } catch (error) {
        return [];
      }
    });

    const upsertAnnounces = (announces: IAnnounce[]) => {
      announces.map(announce =>
        self.announces.set(announce.id.toString(), announce)
      );
    };

    const initializeAnnounces = flow(function*() {
      const announces: RetrieveAsyncFunc<
        typeof fetchAnnounces
      > = yield fetchAnnounces();
      upsertAnnounces(announces);
      return announces;
    });

    const countAnnouncePlay = (announceId: IAnnounce["id"]) => {
      postAnnouncePlay(announceId);
    };

    return {
      initializeAnnounces,
      countAnnouncePlay
    };
  });

export type IAnnounceStore = typeof AnnounceStore.Type;
