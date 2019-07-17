import _ from "lodash";
import { computed, observable } from "mobx";
import { inject, observer } from "mobx-react";
import React from "react";
import { BackHandler } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { BackButton } from "src/components/buttons/BackButton";
import { Button } from "src/components/buttons/Button";
import { KeyboardSpacer } from "src/components/KeyboardSpacer";
import { Text } from "src/components/Text";
import { TextInput } from "src/components/textinputs/TextInput";
import { Bold } from "src/components/texts/Bold";
import { replaceAuthVerifyScreen } from "src/screens/AuthVerifyScreen";
import { navigateButtonModalScreen } from "src/screens/ButtonModalScreen";
import { navigateListenScreen } from "src/screens/ListenScreen";
import { IAuthStore } from "src/stores/AuthStore";
import { IRootStore } from "src/stores/RootStore";
import { IUserStore } from "src/stores/UserStore";

interface IInjectProps {
  authStore: IAuthStore;
  userStore: IUserStore;
}

interface IParams {
  currentPage?: AuthPageType;
  email?: string;
}

interface IProps extends IScreenProps<IParams>, IInjectProps {}

interface IState {
  currentPage: AuthPageType;
  pageStack: AuthPageType[];
  email: string;
  emailAlert: string | null;
  password: string;
  passwordAlert: string | null;
  passwordAlertType: AlertType;
  repeatPassword: string;
  registerAlert: string | null;
  name: string;
}

type AuthPageType = "EMAIL" | "PASSWORD" | "REGISTER";
type AlertType = "INFO" | "ERROR";

const Container = styled.ScrollView.attrs({
  keyboardShouldPersistTaps: "handled",
  contentContainerStyle: {
    justifyContent: "center",
    paddingVertical: 40
  }
})`
  width: 100%;
  flex: 1;
`;

const Page = styled.View`
  justify-content: center;
  width: 100%;
  flex: 1;
  padding: 0 30px;
  background-color: white;
`;

const Label = styled(Bold)`
  color: rgb(25, 86, 212);
  font-size: 28px;
`;

const Input = styled(TextInput).attrs({
  focusStyle: {
    borderBottomColor: "rgb(25, 86, 212)",
    borderBottomWidth: 3,
    paddingBottom: 0
  }
})`
  width: 100%;
  height: 40px;
  padding-bottom: 2px;
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

const ForgotPasswordText = styled(Text).attrs({ type: "regular" })`
  color: rgb(118, 118, 118);
  text-decoration-line: underline;
  align-self: center;
`;

const RegisterText = styled(Text).attrs({ type: "regular" })`
  width: 100%;
  font-size: 13px;
  line-height: 20px;
  text-align: center;
  color: rgb(136, 136, 136);
`;

const AlertText = styled(Text)<{ alertType: AlertType }>`
  width: 100%;
  min-height: 20px;
  color: ${props =>
    props.alertType === "INFO" ? "rgb(25, 86, 212)" : "rgb(255, 10, 10)"};
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  margin: 10px 0;
`;

const StyledBackButton = styled(BackButton)`
  position: absolute;
  top: 12px;
  left: 12px;
`;

const EMAIL_ERROR_MESSAGE = "이메일 형식이 올바르지 않습니다.";
const PASSWORD_ERROR_MESSAGE = "비밀번호가 일치하지 않습니다.";
const FORGOT_PASSWORD_MESSAGE = "리셋 가능한 링크가 이메일로 발송되었습니다 !";

const REGISTER_FIELD_EMPTY_MESSAGE = "모든 칸을 내용에 맞게 채워주세요.";
const REGISTER_NAME_MESSAGE = "앗 중복된 닉네임입니다.";
const REGISTER_PASSWROD_MATCH_MESSAGE = "비밀번호가 일치하지 않습니다.";
const REGISTER_PASSWORD_NOT_VALID_MESSAGE =
  "형식을 충족하지 않는 비밀번호 입니다.";

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    authStore: store.authStore,
    userStore: store.userStore
  })
)
@observer
export class AuthScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      translucent: false
    },
    forceInset: {
      top: "always"
    }
  };

  @observable public currentPage: AuthPageType =
    this.props.navigation.getParam("currentPage") || "EMAIL";

  @observable public pageStack: AuthPageType[] = [
    this.props.navigation.getParam("currentPage") || "EMAIL"
  ];

  @observable public email = "";
  @observable public emailAlert = "";
  @computed public get emailValid() {
    return this.email.length !== 0;
  }

  private get EmailPage() {
    return (
      <Page>
        <Label style={{ marginBottom: 20 }}>EMAIL</Label>
        <Input
          value={this.email}
          onChangeText={text => {
            this.email = text;
            this.emailAlert = "";
          }}
          placeholder="이메일을 입력해주세요"
          keyboardType="email-address"
          autoFocus={true}
          onSubmitEditing={this.onNextPress}
        />
        <AlertText alertType="ERROR">{this.emailAlert}</AlertText>
        <AuthButton onPress={this.onNextPress} disabled={!this.emailValid}>
          <AuthButtonText>NEXT</AuthButtonText>
        </AuthButton>
      </Page>
    );
  }

  @observable public password = "";
  @observable public passwordAlert = "";
  @observable public passwordAlertType: AlertType = "ERROR";
  @computed public get passwordValid() {
    return this.password.length !== 0;
  }

  private get PasswordPage() {
    return (
      <Page>
        <Label style={{ marginBottom: 20 }}>PASSWORD</Label>
        <Input
          value={this.password}
          onChangeText={text => {
            this.password = text;
            this.passwordAlert = "";
          }}
          placeholder="비밀번호를 입력해주세요"
          secureTextEntry={true}
          autoFocus={true}
          onSubmitEditing={this.onLoginPress}
        />
        <AlertText alertType={this.passwordAlertType}>
          {this.passwordAlert}
        </AlertText>
        <AuthButton
          onPress={this.onLoginPress}
          style={{ marginBottom: 42 }}
          disabled={!this.passwordValid}
        >
          <AuthButtonText>LOG IN</AuthButtonText>
        </AuthButton>
        <ForgotPasswordText onPress={this.onForgotPasswordPress}>
          비밀번호를 잊으셨나요?
        </ForgotPasswordText>
      </Page>
    );
  }

  @observable public name = "";
  @observable public repeatPassword = "";
  @observable public registerAlert = "";

  private get RegisterPage() {
    const disabled = _.some([
      _.isEmpty(this.name),
      _.isEmpty(this.password),
      _.isEmpty(this.repeatPassword)
    ]);

    return (
      <Container>
        <Page>
          <Label style={{ marginBottom: 77 }}>SIGN UP</Label>
          <InputLabel>USERNAME</InputLabel>
          <Input
            style={{ marginBottom: 35 }}
            value={this.name}
            onChangeText={$name => {
              this.name = $name;
              this.registerAlert = "";
            }}
            placeholder="유저네임을 입력해주세요"
            keyboardType="default"
            autoFocus={true}
          />
          <InputLabel>PASSWORD</InputLabel>
          <Input
            style={{ marginBottom: 20 }}
            value={this.password}
            onChangeText={($password: string) => {
              this.registerAlert = "";
              this.password = $password;
            }}
            placeholder="비밀번호를 입력해주세요"
            secureTextEntry={true}
          />
          <Input
            style={{ marginBottom: 20 }}
            value={this.repeatPassword}
            onChangeText={$repeatPassword => {
              this.registerAlert = "";
              this.repeatPassword = $repeatPassword;
            }}
            placeholder="비밀번호를 한번 더 입력해주세요"
            secureTextEntry={true}
          />
          <RegisterText>
            비밀번호는 대문자, 소문자, 숫자, 특수문자 중{`\n`}
            3가지 조합을 활용하여 설정해주세요 (8자리 이상)
          </RegisterText>
          <AlertText alertType="ERROR">{this.registerAlert}</AlertText>
          <AuthButton onPress={this.onRegisterPress} disabled={disabled}>
            <AuthButtonText>회원가입</AuthButtonText>
          </AuthButton>
        </Page>
      </Container>
    );
  }

  public componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener("willFocus", () => {
      BackHandler.addEventListener("hardwareBackPress", this.popPage);
    });
  }

  public componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.popPage);
  }

  public render() {
    return (
      <>
        <Container>
          <StyledBackButton onPress={this.popPage} />
          {this.currentPage === "EMAIL" && this.EmailPage}
          {this.currentPage === "PASSWORD" && this.PasswordPage}
          {this.currentPage === "REGISTER" && this.RegisterPage}
        </Container>
        <KeyboardSpacer />
      </>
    );
  }

  private pushPage = (page: AuthPageType) => {
    this.currentPage = page;
    this.pageStack = [...this.pageStack, page];
  };

  private popPage = () => {
    const { navigation } = this.props;

    if (this.pageStack.length <= 1) {
      navigation.goBack(null);
      return true;
    }

    this.pageStack.pop();
    this.currentPage = _.last(this.pageStack)!;

    this.email = "";
    this.emailAlert = "";
    this.password = "";
    this.passwordAlert = "";
    this.repeatPassword = "";
    this.registerAlert = "";
    this.name = "";

    return true;
  };

  private onNextPress = async () => {
    const { authStore } = this.props;
    try {
      const alreadyExistingEmail = await authStore.checkEmailExisting(
        this.email
      );
      const nextPage: AuthPageType = alreadyExistingEmail
        ? "PASSWORD"
        : "REGISTER";
      this.pushPage(nextPage);
    } catch (error) {
      this.emailAlert = error.message;
    }
  };

  private onLoginPress = async () => {
    const { navigation, authStore, userStore } = this.props;

    try {
      const { verified: emailVerified } = await authStore.signInEmail({
        email: this.email,
        password: this.password
      });

      if (emailVerified) {
        await userStore.fetchClient();
        navigateListenScreen(navigation);
        return;
      }

      replaceAuthVerifyScreen(navigation, { email: this.email });
    } catch (error) {
      this.passwordAlert = error.message;
      this.passwordAlertType = "ERROR";
    }
  };

  private onForgotPasswordPress = () => {
    const { navigation, authStore } = this.props;

    navigateButtonModalScreen(navigation, {
      type: "INFO",
      content: `비밀번호를 잊으신 경우, 입력하신 이메일 주소를 통해 비밀번호 재설정이 가능합니다.${`\n`}비밀번호를 재설정하시겠습니까?`,
      rightText: "재설정하기",
      onRightPress: async () => {
        try {
          await authStore.sendForgotPasswordEmail(this.email);
          navigation.goBack(null);
          this.passwordAlert = FORGOT_PASSWORD_MESSAGE;
          this.passwordAlertType = "INFO";
        } catch (error) {
          this.passwordAlert = error.message;
          this.passwordAlertType = "ERROR";
        }
      }
    });
  };

  private onRegisterPress = async () => {
    const { navigation, authStore } = this.props;

    if (
      _.some([
        _.isEmpty(this.name),
        _.isEmpty(this.password),
        _.isEmpty(this.repeatPassword)
      ])
    ) {
      this.registerAlert = REGISTER_FIELD_EMPTY_MESSAGE;
      return;
    }

    if (this.password !== this.repeatPassword) {
      this.registerAlert = REGISTER_PASSWROD_MATCH_MESSAGE;
      return;
    }

    try {
      await authStore.signUpEmail({
        email: this.email,
        password1: this.password,
        password2: this.repeatPassword,
        username: this.name
      });

      replaceAuthVerifyScreen(navigation, { email: this.email });
    } catch (error) {
      this.registerAlert = error.message;
    }
  };
}

export function navigateAuthScreen(
  navigation: NavigationScreenProp<any>,
  params: IParams
) {
  navigation.navigate("AuthScreen", params);
}
