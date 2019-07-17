import { Buffer } from "buffer";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { BackButton } from "src/components/buttons/BackButton";
import { Button } from "src/components/buttons/Button";
import { KeyboardSpacer } from "src/components/KeyboardSpacer";
import { Text } from "src/components/Text";
import { TextInput } from "src/components/textinputs/TextInput";
import { Bold } from "src/components/texts/Bold";
import { replaceAuthLandingScreen } from "src/screens/AuthLandingScreen";
import { replaceAuthVerifyScreen } from "src/screens/AuthVerifyScreen";
import { navigateListenScreen } from "src/screens/ListenScreen";
import { IAuthStore } from "src/stores/AuthStore";
import { IRootStore } from "src/stores/RootStore";
import { IToastStore } from "src/stores/ToastStore";
import { IUserStore } from "src/stores/UserStore";

interface IInjectProps {
  authStore: IAuthStore;
  toastStore: IToastStore;
  userStore: IUserStore;
}

interface IParams {
  base64Code: string;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

interface IResetPasswordPayload {
  uuid: string;
  email: string;
  token: string;
}

const KeyboardDismissWrapper = styled.TouchableOpacity.attrs({
  activeOpacity: 1
})`
  width: 100%;
  flex: 1;
`;

const Header = styled.View`
  width: 100%;
  height: 40px;
  flex-direction: row;
  align-items: center;
  padding-left: 16px;
  z-index: 100;
`;

const Container = styled.View`
  width: 100%;
  flex: 1;
  padding: 0 30px;
  background-color: white;
  justify-content: center;
`;

const Label = styled(Bold)`
  color: rgb(25, 86, 212);
  font-size: 28px;
`;

const Input = styled(TextInput).attrs({
  focusStyle: {
    borderBottomColor: "rgb(25, 86, 212)",
    borderBottomWidth: 1
  }
})`
  width: 100%;
  height: 40px;
  margin-bottom: 50px;
  border-bottom-color: rgb(230, 230, 230);
  border-bottom-width: 1px;
`;

const InputLabel = styled(Bold)`
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 1px;
  color: rgb(25, 86, 212);
`;

const AuthButton = styled(Button).attrs({
  textProps: {
    type: "bold",
    style: {
      color: "white"
    }
  }
})`
  background-color: rgb(25, 86, 212);
`;

const Content = styled(Text)`
  width: 100%;
  font-size: 13px;
  line-height: 20px;
  color: #888888;
  margin-bottom: 37px;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    authStore: store.authStore,
    toastStore: store.toastStore,
    userStore: store.userStore
  })
)
@observer
export class ResetPasswordScreen extends React.Component<IProps> {
  @observable public password = "";
  @observable public repeatPassword = "";

  public render() {
    return (
      <>
        <Header>
          <BackButton onPress={this.onBackPress} />
        </Header>
        <Container>
          <Label>비밀번호 재설정</Label>
          <Content>비밀번호는 영문자 대소문자와 숫자 조합 8자리 이상</Content>
          <InputLabel>PASSWORD</InputLabel>
          <Input
            value={this.password}
            onChangeText={text => (this.password = text)}
            placeholder="비밀번호를 입력해주세요"
            secureTextEntry={true}
            style={{ marginBottom: 20 }}
          />
          <Input
            value={this.repeatPassword}
            onChangeText={text => (this.repeatPassword = text)}
            placeholder="비밀번호를 한번 더 입력해주세요"
            secureTextEntry={true}
            style={{ marginBottom: 60 }}
          />
          <AuthButton onPress={this.onResetPress}>완료</AuthButton>
        </Container>
        <KeyboardSpacer />
      </>
    );
  }

  private onResetPress = async () => {
    const { navigation, authStore, userStore, toastStore } = this.props;
    const base64Code = navigation.getParam("base64Code");
    const { uuid, email, token }: IResetPasswordPayload = JSON.parse(
      Buffer.from(base64Code, "base64").toString("ascii")
    );

    await authStore.confirmForgotPasswordEmail({
      new_password1: this.password,
      new_password2: this.repeatPassword,
      token,
      uuid
    });

    const response = await authStore.signInEmail({
      email,
      password: this.password
    });

    const { verified: emailVerified } = response;

    if (emailVerified) {
      await userStore.fetchClient();
      navigateListenScreen(navigation);
      return;
    }

    replaceAuthVerifyScreen(navigation, { email });
  };

  private onBackPress = () => {
    const { navigation } = this.props;
    replaceAuthLandingScreen(navigation);
  };
}

export function navigateResetPasswordScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.navigate("ResetPasswordScreen", params);
}
