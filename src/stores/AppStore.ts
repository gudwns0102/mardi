import { flow, types } from "mobx-state-tree";
import semver from "semver";

import { getAppVersionAPI } from "src/apis";

export const AppStore = types.model({}).actions(self => {
  const validateAppVersion = flow(function*() {
    const {
      app_version: latestAppVersion
    }: RetrieveAsyncFunc<typeof getAppVersionAPI> = yield getAppVersionAPI();

    return !semver.gt(latestAppVersion, "2.1.0");
  });

  return {
    validateAppVersion
  };
});

export type IAppStore = typeof AppStore.Type;
