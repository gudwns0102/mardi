import { types } from "mobx-state-tree";

interface LinkUser {
  id: number;
  uuid?: string;
  email?: string;
  username?: string;
  name?: string;
  photo?: string;
}

export const MagazineContent = types
  .model({
    id: types.identifierNumber,
    title: types.string,
    text: types.string,
    audio: types.maybe(types.string),
    num_replies: types.number,
    num_played: types.number,
    audio_duration: types.number,
    picture: types.maybeNull(types.string),
    user_name: types.maybe(types.string),
    link_user: types.maybe(types.frozen<LinkUser>())
  })
  .actions(self => {
    const increasePlayCount = (count: number) => {
      self.num_played = count;
    };

    return {
      increasePlayCount
    };
  });

export type IMagazineContent = typeof MagazineContent.Type;
