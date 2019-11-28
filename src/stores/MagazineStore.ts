import _ from "lodash";
import { flow, types } from "mobx-state-tree";
import { getLatestMagazine } from "src/apis/magazines/getLatestMagazine";
import { getMagazine } from "src/apis/magazines/getMagazine";
import { postMagazineContentHeart } from "src/apis/magazines/postMagazineContentHeart";
import { postMagazineContentPlay } from "src/apis/magazines/postMagazineContentPlay";
import { Magazine } from "src/models/Magazine";
import { MagazineContent } from "src/models/MagazineContent";
import { getRootStore } from "./RootStoreHelper";

export const MagazineStore = types
  .model({
    magazines: types.optional(types.map(Magazine), {})
  })
  .actions(self => {
    const rootStore = getRootStore(self);

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

      const magazineContent = findMagazineContent({
        magazineContentId,
        magazineId
      });

      if (magazineContent) {
        magazineContent.increasePlayCount(num_played || 0);
      }
    });

    const clickHeart = flow(function*({
      magazineId,
      magazineContentId
    }: {
      magazineId: number;
      magazineContentId: number;
    }) {
      const {
        heart_by_me,
        num_hearts
      }: RetrieveAsyncFunc<
        typeof postMagazineContentHeart
      > = yield postMagazineContentHeart({ magazineContentId, magazineId });

      const magazineContent = findMagazineContent({
        magazineContentId,
        magazineId
      });

      if (magazineContent) {
        magazineContent.updateHeart({ heart_by_me, num_hearts });
      }

      rootStore.audioStore.updateAudioIfExist({
        type: "MAGAZINE",
        id: magazineContentId,
        heart_by_me,
        num_hearts
      });
    });

    const findMagazineContent = ({
      magazineContentId,
      magazineId
    }: {
      magazineId: number;
      magazineContentId: number;
    }) => {
      const magazine = self.magazines.get(magazineId.toString());

      if (magazine) {
        return magazine.contents.find(
          content => content.id === magazineContentId
        );
      }

      return null;
    };

    return {
      fetchLatestMagazine,
      fetchMagazine,
      increasePlayCount,
      clickHeart
    };
  });

export type IMagazineStore = typeof MagazineStore.Type;
