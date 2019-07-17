import _ from "lodash";
import { AsyncStorage, Platform } from "react-native";
import Rate from "react-native-rate";

import { isProduction } from "src/config/environment";
import { getStore } from "src/stores/RootStore";
import {
  AsyncStorageKeys,
  getStorageItem,
  setStorageItem
} from "src/utils/AsyncStorage";

const PLAY_COUNT_FOR_RATING = isProduction() ? 300 : 10;

const UPLOAD_COUNT_FOR_RATING = isProduction() ? 3 : 2;

const options: Rate.IConfig = {
  AppleAppID: "1435152474",
  preferInApp: true,
  GooglePackageName: "com.mardi"
};

export const showRatingPopup = (callback?: (success: boolean) => any) => {
  Rate.rate(options, callback || _.identity);
};

export const increasePlayCount = async () => {
  const playCounter =
    Number((await AsyncStorage.getItem(AsyncStorageKeys.RATING_MODAL)) || 0) +
    1;
  AsyncStorage.setItem(AsyncStorageKeys.RATING_MODAL, playCounter.toString());
  return playCounter;
};

export const increaseUploadCount = async () => {
  const uploadCounter =
    Number((await getStorageItem(AsyncStorageKeys.RATING_MODAL)) || 0) + 1;
  setStorageItem(AsyncStorageKeys.RATING_MODAL, uploadCounter.toString());
  return uploadCounter;
};

export const checkPlayCountForRating = async () => {
  const count = await increasePlayCount();
  if (count === PLAY_COUNT_FOR_RATING) {
    if (Platform.OS === "ios") {
      showRatingPopup();
    } else {
      const { modalStore } = getStore();
      modalStore.showModal("RATING");
    }
  }
};

export const checkUploadCountForRating = async () => {
  const count = await increaseUploadCount();
  if (count === UPLOAD_COUNT_FOR_RATING) {
    if (Platform.OS === "ios") {
      showRatingPopup();
    } else {
      const { modalStore } = getStore();
      modalStore.showModal("RATING");
    }
  }
};
