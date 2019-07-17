import { Provider } from "mobx-react";
import React from "react";
import { YellowBox } from "react-native";

import { isProduction } from "src/config/environment";
import { withAudio } from "src/hocs/withAudio";
import { withLoading } from "src/hocs/withLoading";
import { withModal } from "src/hocs/withModal";
import { withToast } from "src/hocs/withToast";
import { AppContainer } from "src/navigators";
import { getStore } from "src/stores/RootStore";
import { setupReactotron } from "src/utils/Reactotron";

YellowBox.ignoreWarnings(["Warning: Async Storage"]);

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
        <AppContainer />
      </Provider>
    );
  }

  public get store() {
    return getStore();
  }
}
