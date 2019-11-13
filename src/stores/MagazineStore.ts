import _ from "lodash";
import { flow, types } from "mobx-state-tree";
import { getLatestMagazine } from "src/apis/magazines/getLatestMagazine";
import { getMagazine } from "src/apis/magazines/getMagazine";
import { postMagazineContentPlay } from "src/apis/magazines/postMagazineContentPlay";
import { Magazine } from "src/models/Magazine";
import { MagazineContent } from "src/models/MagazineContent";

export const MagazineStore = types
  .model({
    magazines: types.optional(types.map(Magazine), {})
    // currentMagazineId: types.maybeNull(types.number)
  })
  // .views(self => {
  //   return {
  //     get currentMagazine() {
  //       return self.currentMagazineId !== null
  //         ? self.magazines.get(self.currentMagazineId.toString())
  //         : undefined;
  //     }
  //   };
  // })
  .actions(self => {
    const fetchLatestMagazine = flow(function*() {
      const magazine: RetrieveAsyncFunc<
        typeof getLatestMagazine
      > = yield getLatestMagazine();
      const magazineContentModels = magazine.contents.map(content =>
        MagazineContent.create({ ...content })
      );
      const magazineModel = Magazine.create({
        ...magazine,
        contents: magazineContentModels
      });
      self.magazines.set(magazine.id.toString(), magazineModel);
      return magazineModel;
    });

    const fetchMagazine = flow(function*(id: number) {
      const magazine: RetrieveAsyncFunc<typeof getMagazine> = yield getMagazine(
        id
      );
      const magazineContentModels = magazine.contents.map(content =>
        MagazineContent.create({ ...content })
      );
      const magazineModel = Magazine.create({
        ...magazine,
        contents: magazineContentModels
      });
      self.magazines.set(magazine.id.toString(), magazineModel);
      return magazineModel;
    });

    const increasePlayCount = flow(function*({
      magazineId,
      magazineContentId
    }: {
      magazineId: number;
      magazineContentId: number;
    }) {
      const {
        num_played
      }: RetrieveAsyncFunc<
        typeof postMagazineContentPlay
      > = yield postMagazineContentPlay({ magazineId, magazineContentId });
      const magazine = self.magazines.get(magazineId.toString());
      if (magazine) {
        const magazineContent = magazine.contents.find(
          content => content.id === magazineContentId
        );

        if (magazineContent) {
          magazineContent.increasePlayCount(num_played || 0);
        }
      }
    });

    return {
      fetchLatestMagazine,
      fetchMagazine,
      increasePlayCount
    };
  });

export type IMagazineStore = typeof MagazineStore.Type;
