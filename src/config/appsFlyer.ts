import { Platform } from "react-native";
import * as appsFlyer from "react-native-appsflyer";

const options: any = Platform.select({
  android: {
    devKey: "t3Gr4ZTTGzWga8k8MCoiuX",
    isDebug: __DEV__
  },
  ios: {
    devKey: "t3Gr4ZTTGzWga8k8MCoiuX",
    isDebug: __DEV__,
    appId: "1435152474"
  }
});

export const initializeAppsFlyer = () => {
  appsFlyer.default.initSdk(
    options,
    result => {
      console.log(result);
    },
    error => {
      console.error(error);
    }
  );
};

appsFlyer.default.trackEvent(
  "test",
  { value: true },
  result => {
    console.log(result + "!!");
  },
  error => {
    console.error(error);
  }
);
