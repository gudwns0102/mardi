import { inject, observer } from "mobx-react";
import React from "react";
import { Linking } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";

import { images } from "assets/images";
import { ILinkingScreenProps, withLinking } from "src/hocs/withLinking";
import { navigateAuthLandingScreen } from "src/screens/AuthLandingScreen";
import { navigateButtonModalScreen } from "src/screens/ButtonModalScreen";
import { navigateListenScreen } from "src/screens/ListenScreen";
import { IAppStore } from "src/stores/AppStore";
import { IAuthStore } from "src/stores/AuthStore";
import { IRootStore } from "src/stores/RootStore";
import { IUserStore } from "src/stores/UserStore";
import { isAndroid } from "src/utils/Platform";

interface IInjectProps {
  appStore: IAppStore;
  authStore: IAuthStore;
  userStore: IUserStore;
}

interface IProps extends IScreenProps<{}>, IInjectProps, ILinkingScreenProps {}

const Container = styled(LinearGradient).attrs({
  colors: ["rgb(23, 135, 217)", "rgb(25, 86, 212)"]
})`
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
`;

const Logo = styled.Image.attrs({
  source: images.icLogoBigWhite,
  resizeMode: "contain"
})`
  width: 100%;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    appStore: store.appStore,
    authStore: store.authStore,
    userStore: store.userStore
  })
)
@withLinking
@observer
export class SplashScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      animated: false,
      barStyle: "light-content",
      backgroundColor: "rgb(23, 135, 217)"
    },
    forceInset: {
      top: "never"
    }
  };

  public async componentDidMount() {
    const { appStore, authStore, userStore } = this.props;
    await authStore.initialize(this.navigation);

    const isValidAppVersion = await appStore.validateAppVersion();
    if (!isValidAppVersion) {
      navigateButtonModalScreen(this.navigation, {
        type: "INFO",
        content: "최신 버전의 앱을 다운로드 해주세요!",
        leftText: "아니요",
        rightText: "업데이트",
        onRightPress: () => {
          Linking.openURL(
            isAndroid()
              ? "http://play.google.com/store/apps/details?id=com.mardi"
              : "https://itunes.apple.com/kr/app/com.mardi.life/id1435152474"
          );
        }
      });
      return;
    }

    try {
      await userStore.fetchClient();
      navigateListenScreen(this.navigation);
    } catch (error) {
      navigateAuthLandingScreen(this.navigation);
    }
  }

  public get navigation() {
    return this.props.navigation;
  }

  public render() {
    return (
      <Container>
        <Logo />
      </Container>
    );
  }
}
