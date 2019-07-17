import AsyncStorage from "@react-native-community/async-storage";
import _ from "lodash";
import { mst } from "reactotron-mst";
import Reactotron from "reactotron-react-native";

import { getStore, IRootStore } from "src/stores/RootStore";

export const setupReactotron = (store: IRootStore) => {
  (Reactotron as any)
    .configure({
      name: "app"
    })
    .useReactNative()
    .use(mst())
    .connect();
  (Reactotron as any).trackMstNode(store);

  Reactotron.onCustomCommand({
    command: "clearAllAsyncStorage",
    description: "clearAllAsyncStorage",
    handler: () => AsyncStorage.clear(),
    title: "clearAllAsyncStorage"
  });

  Reactotron.onCustomCommand({
    command: "showInfoTast",
    description: "showInfoTast",
    handler: async () => {
      getStore().toastStore.openToast({ content: "Test Toast", type: "INFO" });
    }
  });

  Reactotron.onCustomCommand({
    command: "showErrorToast",
    description: "showErrorToast",
    handler: async () => {
      getStore().toastStore.openToast({ content: "Test Toast", type: "ERROR" });
    }
  });

  Reactotron.onCustomCommand({
    command: "showClosableToast",
    description: "showClosableToast",
    handler: async () => {
      const { toastStore } = getStore();
      toastStore.openToast({
        content: "Test Toast",
        type: "CLOSABLE",
        onClose: toastStore.closeToast
      });
    }
  });

  Reactotron.onCustomCommand({
    command: "invalidateAccessToken",
    description: "invalidateAccessToken",
    handler: async () => {
      getStore().authStore.invalidateAccessTokenForTest();
    },
    title: "invalidateAccessToken"
  });

  (console as any).tron = Reactotron;
};
