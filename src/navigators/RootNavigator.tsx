import { createStackNavigator, createSwitchNavigator } from "react-navigation";
import { fromBottom } from "react-navigation-transitions";

import { AuthNavigator } from "src/navigators/AuthNavigator";
import { MainNavigator } from "src/navigators/MainNavigator";
import * as Screens from "src/screens";

const SwitchNavigator = createSwitchNavigator({
  SplashScreen: {
    screen: Screens.SplashScreen
  },
  MainNavigator: {
    screen: MainNavigator
  },
  AuthNavigator: {
    screen: AuthNavigator
  }
});

export const RootNavigator = createStackNavigator(
  {
    SwitchNavigator: {
      screen: SwitchNavigator
    },
    WebViewScreen: {
      screen: Screens.WebViewScreen
    },
    ButtonModalScreen: {
      screen: Screens.ButtonModalScreen
    },
    ActionSheetModalScreen: {
      screen: Screens.ActionSheetModalScreen
    }
  },
  {
    mode: "modal",
    headerMode: "none",
    transparentCard: true,
    cardStyle: {
      backgroundColor: "transparent",
      opacity: 1,
      shadowOpacity: 0
    },
    transitionConfig: () => ({
      ...fromBottom(0)
    })
  }
);
