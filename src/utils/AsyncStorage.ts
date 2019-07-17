import AsyncStorage from "@react-native-community/async-storage";

export enum AsyncStorageKeys {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  FOLLOW_RECOMMEND_TOAST = "FOLLOW_RECOMMEND_TOAST",
  RATING_MODAL = "RATING_MODAL"
}

export const getStorageItem = (
  key: AsyncStorageKeys,
  callback?: (error?: Error | undefined, result?: string | undefined) => void
) => {
  return AsyncStorage.getItem(key, callback);
};

export const setStorageItem = (
  key: AsyncStorageKeys,
  value: string,
  callback?: (error?: Error | undefined, result?: string | undefined) => void
) => {
  return AsyncStorage.setItem(key, value, callback);
};
