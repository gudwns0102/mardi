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
    num_hearts: types.number,
    heart_by_me: types.boolean,
    audio_duration: types.number,
    picture: types.maybeNull(types.string),
    user_name: types.maybe(types.string),
    link_user: types.maybe(types.frozen<LinkUser>())
  })
  .actions(self => {
    const increasePlayCount = (count: number) => {
      self.num_played = count;
    };

    const increaseReplyCount = () => {
      self.num_replies = self.num_replies + 1;
    };

    const decreaseReplyCount = () => {
      self.num_replies = self.num_replies - 1;
    };

    const updateHeart = (data: {
      heart_by_me: boolean;
      num_hearts: number;
    }) => {
      self.heart_by_me = data.heart_by_me;
      self.num_hearts = data.num_hearts;
    };

    return {
      increasePlayCount,
      increaseReplyCount,
      decreaseReplyCount,
      updateHeart
    };
  });

export type IMagazineContent = typeof MagazineContent.Type;
