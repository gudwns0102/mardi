import { flow, types } from "mobx-state-tree";
import { getLatestMagazine } from "src/apis/magazines/getLatestMagazine";
import { getMagazine } from "src/apis/magazines/getMagazine";

export const MagazineStore = types
  .model({
    magazines: types.optional(types.map(types.frozen<Magazine>()), {}),
    currentMagazineId: types.maybeNull(types.number)
  })
  .views(self => {
    return {
      get currentMagazine() {
        return self.currentMagazineId !== null
          ? self.magazines.get(self.currentMagazineId.toString())
          : undefined;
      }
    };
  })
  .actions(self => {
    const fetchLatestMagazine = flow(function*() {
      const magazine: RetrieveAsyncFunc<
        typeof getLatestMagazine
      > = yield getLatestMagazine();
      self.magazines.set(magazine.id.toString(), magazine);
      self.currentMagazineId = magazine.id;
    });

    const fetchMagazine = flow(function*(id: number) {
      const magazine: RetrieveAsyncFunc<typeof getMagazine> = yield getMagazine(
        id
      );
      self.magazines.set(magazine.id.toString(), magazine);
      self.currentMagazineId = magazine.id;
    });

    return {
      fetchLatestMagazine,
      fetchMagazine
    };
  });

export type IMagazineStore = typeof MagazineStore.Type;
