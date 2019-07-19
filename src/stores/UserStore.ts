import _ from "lodash";
import { flow, types } from "mobx-state-tree";

import {
  deleteIntroductionAPI,
  getMe,
  getMeSettings,
  getUser,
  patchMeAPI,
  patchMeSettings,
  patchUserAPI,
  postIntrocutionAPI,
  postUserPageVisitAPI
} from "src/apis";
import { getRootStore } from "src/stores/RootStoreHelper";
import { audioPathToFormUri } from "src/utils/Audio";
import OneSignal from "react-native-onesignal";

export const UserStore = types
  .model({
    clientId: types.maybeNull(types.string),
    clientSettings: types.optional(types.frozen<IUserSettings>(), {
      notification: true,
      streaming: true
    }),
    users: types.optional(types.map(types.frozen<IUser>()), {})
  })
  .actions(self => {
    const rootStore = getRootStore(self);

    const getClient = () => {
      const { clientId } = self;
      if (!clientId) {
        return null;
      }

      return self.users.get(clientId) || null;
    };

    const removeClient = () => {
      updateClient({ onesignal_user_id: "" });
      self.clientId = null;
    };

    const fetchUser = flow(function*(uuid: string) {
      const user: RetrieveAsyncFunc<typeof getUser> = yield getUser({
        uuid
      });

      self.users.set(user.uuid, user);
      countUserPageVisit(uuid);
    });

    const fetchClient = flow(function*() {
      try {
        const client: RetrieveAsyncFunc<typeof getMe> = yield getMe();
        self.clientId = client.uuid;
        self.users.set(client.uuid, { ...client });
        fetchClientSettings();
        const userId: RetrieveAsyncFunc<
          typeof getOnesignalUserId
        > = yield getOnesignalUserId();
        updateClient({ onesignal_user_id: userId });
        return client.uuid;
      } catch (error) {
        throw error;
      }
    });

    const upsertUserById = (
      uuid: IUser["uuid"],
      data: Partial<Omit<IUser, "uuid">>
    ) => {
      const user = self.users.get(uuid);
      if (!user) {
        return;
      }
      self.users.set(uuid, { ...user, ...data });
    };

    const deleteClientIntroduction = flow(function*() {
      const clientId = self.clientId!;
      const client = self.users.get(clientId.toString())!;
      if (!_.isNull(client.introduction)) {
        yield deleteIntroductionAPI();
      }
      self.users.set(clientId, { ...client, introduction: null });
    });

    const uploadClientIntroduction = flow(function*(
      title: string,
      audio: string
    ) {
      const clientId = self.clientId!;
      const client = self.users.get(clientId.toString())!;
      const audioForm = new FormData();
      const extension = audio.split(".").pop();
      yield deleteClientIntroduction();
      audioForm.append("title", title);
      audioForm.append("audio", {
        uri: audioPathToFormUri(audio),
        name: `freeContent.${extension}`,
        type: `audio/${extension}`
      } as any);
      const response: RetrieveAsyncFunc<
        typeof postIntrocutionAPI
      > = yield postIntrocutionAPI(audioForm);
      self.users.set(clientId, { ...client, introduction: response });
    });

    const updateClient = flow(function*(data: Partial<Omit<IUser, "uuid">>) {
      const updateUserForm = new FormData();
      const imageProperties: Array<keyof Partial<IUser>> = [
        "photo",
        "bg_photo"
      ];
      for (const property of Object.keys(data)) {
        if (_.includes(imageProperties, property)) {
          updateUserForm.append(property, {
            uri: (data as any)[property],
            name: `${property}.jpg`,
            type: "image/jpeg"
          } as any);
        } else {
          updateUserForm.append(property, (data as any)[property]);
        }
      }
      try {
        const response: RetrieveAsyncFunc<
          typeof patchUserAPI
        > = yield patchUserAPI({ data: updateUserForm, uuid: self.clientId! });
        self.users.set(response.uuid, response);
      } catch (error) {
        throw error;
      }
    });

    const toggleFollow = (uuid: IUser["uuid"]) => {
      return rootStore.followStore.toggleFollow(uuid);
    };

    const getOnesignalUserId = (): Promise<string> => {
      return new Promise((resolve, reject) =>
        OneSignal.getPermissionSubscriptionState(status => {
          const { userId } = status;
          resolve(userId);
        })
      );
    };

    const updateClientKeywords = flow(function*(tags: string[]) {
      const uuid = self.clientId;
      if (!uuid) {
        return;
      }
      const user: RetrieveAsyncFunc<typeof patchMeAPI> = yield patchMeAPI({
        tags
      });
      self.users.set(uuid, user);
    });

    const fetchClientSettings = flow(function*() {
      const client = getClient();
      if (!client) {
        return;
      }
      const {
        notification,
        streaming
      }: RetrieveAsyncFunc<typeof getMeSettings> = yield getMeSettings();
      self.clientSettings = {
        notification,
        streaming
      };
    });

    const patchClientSettings = flow(function*(data: Partial<IUserSettings>) {
      const client = getClient();
      if (!client) {
        return;
      }
      const {
        notification,
        streaming
      }: RetrieveAsyncFunc<typeof patchMeSettings> = yield patchMeSettings(
        data
      );
      self.clientSettings = {
        notification,
        streaming
      };
    });

    const countUserPageVisit = (uuid: string) => {
      postUserPageVisitAPI(uuid);
    };

    return {
      removeClient,
      fetchClient,
      fetchUser,
      upsertUserById,
      deleteClientIntroduction,
      uploadClientIntroduction,
      toggleFollow,
      updateClient,
      updateClientKeywords,
      fetchClientSettings,
      patchClientSettings
    };
  })
  .views(self => {
    return {
      get client() {
        const { clientId } = self;
        if (!clientId) {
          return null;
        }

        return self.users.get(clientId);
      }
    };
  });

export type IUserStore = typeof UserStore.Type;
