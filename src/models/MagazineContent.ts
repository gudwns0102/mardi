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
    num_replies: types.optional(types.number, 0),
    num_played: types.optional(types.number, 0),
    audio_duration: types.optional(types.number, 0),
    picture: types.maybeNull(types.string),
    user_name: types.maybeNull(types.string),
    link_user: types.maybeNull(types.frozen<LinkUser>())
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
