import { inject, observer } from "mobx-react";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { BackButton } from "src/components/buttons/BackButton";
import { Button } from "src/components/buttons/Button";
import { Text } from "src/components/Text";
import { Bold } from "src/components/texts/Bold";
import { IAuthStore } from "src/stores/AuthStore";
import { IRootStore } from "src/stores/RootStore";
import { IToastStore } from "src/stores/ToastStore";

interface IInjectProps {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IParams {
  email: string;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

const Container = styled.View`
  width: 100%;
  flex: 1;
  padding: 0 58px;
  align-items: center;
  justify-content: center;
`;

const StyledBackButton = styled(BackButton)`
  position: absolute;
  top: 18px;
  left: 12px;
`;

const Airplane = styled.Image.attrs({ source: images.airplane })`
  width: 190px;
  height: 190px;
  border-radius: 95px;
  margin-bottom: 35px;
  align-self: center;
`;

const VerifyText = styled(Text)`
  font-size: 15px;
  color: rgb(68, 68, 68);
  text-align: center;
  margin-bottom: 35px;
`;

const VerifyEmailText = styled(Bold)`
  width: 100%;
  font-size: 18px;
  text-align: center;
  border-bottom-color: black;
  border-bottom-width: 2px;
  align-items: center;
  margin-bottom: 30px;
`;

const ResendButton = styled(Button).attrs({
  textProps: {
    style: {
      color: "white"
    },
    type: "bold"
  }
})`
  width: 280px;
  height: 48px;
  border-radius: 48px;
  background-color: rgb(25, 86, 212);
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    authStore: store.authStore,
    toastStore: store.toastStore
  })
)
@observer
export class AuthVerifyScreen extends React.Component<IProps, any> {
  public static options: IScreenOptions = {
    statusBarProps: {
      translucent: false
    },
    forceInset: {
      top: "always"
    }
  };

  public render() {
    const { navigation } = this.props;
    const email = navigation.getParam("email");

    return (
      <Container>
        <Airplane />
        <VerifyText>
          아래의 이메일 주소로 인증메일을{`\n`}
          발송하였습니다.
        </VerifyText>
        <VerifyEmailText>{email}</VerifyEmailText>
        <ResendButton onPress={this.onResendPress}>
          인증메일 재발송
        </ResendButton>
        <StyledBackButton />
      </Container>
    );
  }

  private onBackPress = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };

  private onResendPress = async () => {
    const { navigation, authStore, toastStore } = this.props;
    const email = navigation.getParam("email");
    try {
      await authStore.resendVerificationEmail(email);
      toastStore.openToast({
        type: "INFO",
        content: "인증메일을 재발송 하였습니다."
      });
    } catch (error) {
      toastStore.openToast({
        type: "ERROR",
        content: "인증메일 재발송에 실패하였습니다. 다시 시도해주세요."
      });
      return;
    }
  };
}

export function navigateAuthVerifyScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.navigate("AuthVerifyScreen", params);
}

export function replaceAuthVerifyScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.replace("AuthVerifyScreen", params);
}
