import { createStackNavigator } from "react-navigation";

import * as Screens from "src/screens";

export const AuthNavigator = createStackNavigator(
  {
    AuthLandingScreen: {
      screen: Screens.AuthLandingScreen
    },
    AuthScreen: {
      screen: Screens.AuthScreen
    },
    AuthVerifyScreen: {
      screen: Screens.AuthVerifyScreen
    },
    ResetPasswordScreen: {
      screen: Screens.ResetPasswordScreen
    }
  },
  {
    headerMode: "none"
  }
);
