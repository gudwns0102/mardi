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

  // Reactotron.onCustomCommand({
  //   command: "clearAllAsyncStorage",
  //   description: "clearAllAsyncStorage",
  //   handler: () => AsyncStorage.clear(),
  //   title: "clearAllAsyncStorage"
  // });

  (console as any).tron = Reactotron;
};
