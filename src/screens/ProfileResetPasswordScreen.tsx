import { Buffer } from "buffer";
import _ from "lodash";
import { inject, observer } from "mobx-react";
import React from "react";
import { Keyboard } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { BackButton } from "src/components/buttons/BackButton";
import { Button } from "src/components/buttons/Button";
import { IconButton } from "src/components/buttons/IconButton";
import { KeyboardSpacer } from "src/components/KeyboardSpacer";
import { Text } from "src/components/Text";
import { TextInput } from "src/components/textinputs/TextInput";
import { Bold } from "src/components/texts/Bold";
import { replaceAuthLandingScreen } from "src/screens/AuthLandingScreen";
import { IAuthStore } from "src/stores/AuthStore";
import { IRootStore } from "src/stores/RootStore";
import { IToastStore } from "src/stores/ToastStore";
import { IUserStore } from "src/stores/UserStore";
import { colors } from "src/styles/colors";

interface IInjectProps {
  authStore: IAuthStore;
  toastStore: IToastStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, any>;
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

const Container = styled.ScrollView.attrs({
  contentContainerStyle: {
    justifyContent: "center"
  }
})`
  width: 100%;
  flex: 1;
  padding: 0 30px;
  background-color: ${colors.white};
`;

const Label = styled(Text).attrs({ type: "bold" })`
  color: ${colors.blue300};
  font-size: 28px;
`;

const Input = styled(TextInput).attrs({
  focusStyle: {
    borderBottomColor: colors.blue300,
    borderBottomWidth: 1
  }
})`
  width: 100%;
  height: 40px;
  margin-bottom: 50px;
  border-bottom-color: ${colors.gray250};
  border-bottom-width: 1px;
`;

const InputLabel = styled(Text).attrs({ type: "bold" })`
  font-size: 13px;
  line-height: 20px;
  letter-spacing: 1px;
  color: ${colors.blue300};
`;

const AuthButton = styled(Button).attrs({
  shadow: true
})`
  width: 280px;
  height: 48px;
  border-radius: 48px;
  background-color: ${props =>
    props.disabled ? "rgb(200,200,200)" : "rgb(25, 86, 212)"};
  margin: 0 18px;
`;

const AuthButtonText = styled(Bold)`
  font-size: 16px;
  color: white;
`;

const Content = styled(Text).attrs({ type: "regular" })`
  width: 100%;
  font-size: 13px;
  line-height: 20px;
  color: ${colors.gray450};
  margin-bottom: 37px;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    authStore: store.authStore,
    toastStore: store.toastStore
  })
)
@observer
export class ProfileResetPasswordScreen extends React.Component<IProps> {
  public state = {
    currentPassword: "",
    password: "",
    repeatPassword: ""
  };

  public render() {
    const { currentPassword, password, repeatPassword } = this.state;
    return (
      <React.Fragment>
        <KeyboardDismissWrapper onPress={Keyboard.dismiss}>
          <Header>
            <BackButton onPress={this.onBackPress} />
          </Header>
          <Container>
            <Label>비밀번호 재설정</Label>
            <Content>비밀번호는 영문자 대소문자와 숫자 조합 8자리 이상</Content>
            <InputLabel>PASSWORD</InputLabel>
            <Input
              value={currentPassword}
              onChangeText={$currentPassword =>
                this.setState({ currentPassword: $currentPassword })
              }
              placeholder="현재 비밀번호를 입력해주세요"
              secureTextEntry={true}
              style={{ marginBottom: 30 }}
            />
            <InputLabel>PASSWORD</InputLabel>
            <Input
              value={password}
              onChangeText={$password => this.setState({ password: $password })}
              placeholder="새 비밀번호를 입력해주세요"
              secureTextEntry={true}
              style={{ marginBottom: 20 }}
            />
            <Input
              value={repeatPassword}
              onChangeText={$repeatPassword =>
                this.setState({ repeatPassword: $repeatPassword })
              }
              placeholder="비밀번호를 한번 더 입력해주세요"
              secureTextEntry={true}
              style={{ marginBottom: 60 }}
            />
            <AuthButton onPress={this.onSubmit}>
              <AuthButtonText>완료</AuthButtonText>
            </AuthButton>
          </Container>
        </KeyboardDismissWrapper>
        <KeyboardSpacer />
      </React.Fragment>
    );
  }

  private onSubmit = async () => {
    const { authStore, toastStore, navigation } = this.props;
    const { currentPassword, password, repeatPassword } = this.state;
    try {
      await authStore.changePassword(currentPassword, password, repeatPassword);

      toastStore.openToast({
        type: "INFO",
        content: "비밀번호가 변경되었습니다."
      });

      navigation.goBack(null);
    } catch (error) {
      toastStore.openToast({
        type: "ERROR",
        content: error.message
      });
    }
  };

  private onBackPress = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };
}

export function navigateProfileResetPasswordScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.navigate("ProfileResetPasswordScreen");
}
