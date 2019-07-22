import { Provider } from "mobx-react";
import React from "react";
import { YellowBox } from "react-native";
import firebase from "react-native-firebase";
import {
  NavigationLeafRoute,
  NavigationParams,
  NavigationState
} from "react-navigation";

import { isProduction } from "src/config/environment";
import { withAudio } from "src/hocs/withAudio";
import { withLoading } from "src/hocs/withLoading";
import { withModal } from "src/hocs/withModal";
import { withToast } from "src/hocs/withToast";
import { AppContainer } from "src/navigators";
import { getStore } from "src/stores/RootStore";
import { setupReactotron } from "src/utils/Reactotron";

YellowBox.ignoreWarnings(["Warning: Async Storage"]);

function getActiveRouteName(
  route: NavigationLeafRoute<NavigationParams>
): string {
  if (route.index === undefined) {
    return route.routeName;
  }
  const childRoute = route.routes[route.index];
  return getActiveRouteName(childRoute);
}

@withLoading
@withToast
@withModal
@withAudio
export class App extends React.Component {
  public componentDidMount() {
    if (!isProduction()) {
      setupReactotron(this.store);
    }
  }

  public render() {
    return (
      <Provider store={this.store}>
        <AppContainer onNavigationStateChange={this.onNavigationStateChange} />
      </Provider>
    );
  }

  public get store() {
    return getStore();
  }

  public onNavigationStateChange = (
    prevState: NavigationState,
    currentState: NavigationState
  ) => {
    const currentScreen = getActiveRouteName(
      currentState.routes[currentState.index]
    );
    const prevScreen = getActiveRouteName(prevState.routes[prevState.index]);

    if (prevScreen !== currentScreen) {
      firebase.analytics().setCurrentScreen(currentScreen);
    }
  };
}
