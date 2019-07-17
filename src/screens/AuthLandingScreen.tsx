import { inject, observer } from "mobx-react";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { Button } from "src/components/buttons/Button";
import { Text } from "src/components/Text";
import { Bold } from "src/components/texts/Bold";
import { environment } from "src/config/environment";
import { navigateAuthScreen } from "src/screens/AuthScreen";
import { navigateListenScreen } from "src/screens/ListenScreen";
import { navigateWebViewScreen } from "src/screens/WebViewScreen";
import { IAuthStore } from "src/stores/AuthStore";
import { IRootStore } from "src/stores/RootStore";
import { IUserStore } from "src/stores/UserStore";

interface IInjectProps {
  authStore: IAuthStore;
  userStore: IUserStore;
}

interface IProps extends IScreenProps<{}>, IInjectProps {}

const Container = styled(LinearGradient).attrs({
  colors: ["rgb(23, 135, 217)", "rgb(25, 86, 212)"]
})`
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
  padding: 178px 52px 21px;
`;

const Logo = styled.Image.attrs({
  source: images.icLogoBigWhite,
  resizeMode: "contain"
})`
  width: 160px;
  height: 35px;
  margin-bottom: 16px;
`;

const Content = styled(Text)`
  flex: 1;
  font-size: 14px;
  color: white;
`;

const RoundButton = styled(Button)`
  width: 100%;
  height: 48px;
  border-radius: 50px;
`;

const RoundButtonText = styled(Bold)`
  font-size: 14px;
`;

const FacebookButton = styled(RoundButton)`
  background-color: white;
  margin-bottom: 16px;
`;

const FacebookIcon = styled.Image.attrs({ source: images.fb })`
  margin-right: 5px;
`;

const FacebookText = styled(RoundButtonText)`
  color: rgb(25, 86, 212);
`;

const EamilButton = styled(RoundButton)`
  background-color: rgb(23, 217, 202);
  margin-bottom: 54px;
`;

const EmailText = styled(RoundButtonText)`
  color: white;
`;

const AgreementText = styled(Bold)`
  font-size: 12px;
  color: rgb(201, 201, 201);
  text-align: center;
`;

const AgreementTouchableText = styled(AgreementText)`
  text-decoration-line: underline;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    authStore: store.authStore,
    userStore: store.userStore
  })
)
@observer
export class AuthLandingScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      barStyle: "light-content",
      backgroundColor: "rgb(23, 135, 217)"
    },
    forceInset: {
      top: "never"
    }
  };

  public render() {
    return (
      <Container>
        <Logo />
        <Content>한 명 한 명의 점을 잇는 플랫폼, 마디</Content>
        <FacebookButton onPress={this.onFacebookPress}>
          <FacebookIcon />
          <FacebookText>Continue with Facebook</FacebookText>
        </FacebookButton>
        <EamilButton onPress={this.onEmailPress}>
          <EmailText>Email</EmailText>
        </EamilButton>
        <AgreementText>
          회원가입 및 로그인 시{" "}
          <AgreementTouchableText onPress={this.onPrivacyPress}>
            개인정보취급방침과
          </AgreementTouchableText>
          {`\n`}
          <AgreementTouchableText onPress={this.onTermsPress}>
            이용약관
          </AgreementTouchableText>
          에 동의한 것으로 간주합니다.
        </AgreementText>
      </Container>
    );
  }

  public get navigation() {
    return this.props.navigation;
  }

  private onFacebookPress = async () => {
    const { navigation, authStore, userStore } = this.props;
    await authStore.signInFacebook();
    await userStore.fetchClient();
    navigateListenScreen(navigation);
  };

  private onEmailPress = () => {
    const { navigation } = this.props;
    navigateAuthScreen(navigation, { currentPage: "EMAIL" });
  };

  private onPrivacyPress = () => {
    navigateWebViewScreen(this.navigation, { uri: environment.privacyPolicy });
  };

  private onTermsPress = () => {
    navigateWebViewScreen(this.navigation, { uri: environment.termsOfUse });
  };
}

export const navigateAuthLandingScreen = (
  navigation: NavigationScreenProp<any, any>
) => {
  navigation.navigate("AuthLandingScreen");
};

export const replaceAuthLandingScreen = (
  navigation: NavigationScreenProp<any, any>
) => {
  navigation.replace("AuthLandingScreen");
};
