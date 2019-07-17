import produce from "immer";
import { inject, observer } from "mobx-react";
import React, { ComponentClass } from "react";
import {
  Alert,
  FlatList,
  FlatListProps,
  Linking,
  ListRenderItem
} from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { BackButton } from "src/components/buttons/BackButton";
import {
  IAudioSettingProps,
  SettingCard,
  SettingCardProps
} from "src/components/cards/SettingCard";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { environment } from "src/config/environment";
import { navigateAnnounceScreen } from "src/screens/AnnounceScreen";
import { navigateAuthLandingScreen } from "src/screens/AuthLandingScreen";
import { navigateButtonModalScreen } from "src/screens/ButtonModalScreen";
import { navigateFollowAndContentRecommendScreen } from "src/screens/FollowAndContentRecommendScreen";
import { navigateProfileEditScreen } from "src/screens/ProfileEditScreen";
import { navigateProfileResetPasswordScreen } from "src/screens/ProfileResetPasswordScreen";
import { navigateWebViewScreen } from "src/screens/WebViewScreen";
import { IAudioStore } from "src/stores/AudioStore";
import { IAuthStore } from "src/stores/AuthStore";
import { IRootStore } from "src/stores/RootStore";
import { IUserStore } from "src/stores/UserStore";
import { colors } from "src/styles/colors";
import { deviceWidth } from "src/utils/Dimensions";

interface IInjectProps {
  authStore: IAuthStore;
  audioStore: IAudioStore;
  userStore: IUserStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, any>;
}

type SettingScreenCardProps = SettingCardProps & {
  id: number;
  show: boolean;
  isSectionHolder?: boolean;
};

interface IState {
  settings: SettingScreenCardProps[];
}

const Container = styled.ScrollView`
  border-top-width: 1px;
  border-color: rgb(238, 238, 238);
`;

const HeaderTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 15px;
  line-height: 24px;
`;

const SettingList = styled<
  ComponentClass<
    FlatListProps<SettingCardProps & { isSectionHolder?: boolean }>
  >
>(FlatList)`
  width: 100%;
  flex: 1;
  background-color: rgb(246, 246, 246);
`;

const SectionSeperator = styled.View`
  width: 100%;
  height: 8px;
  background-color: rgb(246, 246, 246);
`;

const Seperator = styled.View`
  width: ${deviceWidth - 40};
  height: 1px;
  align-self: center;
  background-color: rgb(236, 236, 236);
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    authStore: store.authStore,
    audioStore: store.audioStore,
    userStore: store.userStore
  })
)
@observer
export class SettingScreen extends React.Component<IProps, IState> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: colors.white
    }
  };

  constructor(props: IProps) {
    super(props);

    const { navigation, audioStore, userStore } = props;
    const isFacebookUser = userStore.client!.signup_type === "facebook";

    this.state = {
      settings: [
        {
          id: 0,
          show: true,
          type: "NAVIGATE",
          title: "프로필 정보 수정",
          onPress: () => {
            navigateProfileEditScreen(navigation);
          }
        },
        {
          id: 1,
          show: true,
          type: "SWITCH",
          title: "노티",
          value: userStore.clientSettings.notification,
          onValueChange: async (value: boolean) => {
            await userStore.patchClientSettings({ notification: value });
            this.setState(
              produce(draft => {
                (draft.settings[1] as any).value = value;
              })
            );
          }
        },
        {
          id: 2,
          show: true,
          type: "SWITCH",
          title: "3G/LTE 스트리밍 허용",
          value: userStore.clientSettings.streaming,
          onValueChange: async (value: boolean) => {
            await userStore.patchClientSettings({ streaming: value });
            this.setState(
              produce(draft => {
                (draft.settings[2] as any).value = value;
              })
            );
          }
        },
        {
          id: 3,
          show: true,
          type: "AUDIO",
          title: "마디소개",
          onPress: () => {
            audioStore.pushInstantAudio(environment.aboutMardi);
          },
          isSectionHolder: true
        },
        {
          id: 4,
          show: true,
          type: "NAVIGATE",
          title: "공지사항",
          onPress: () => {
            navigateAnnounceScreen(navigation);
          }
        },
        {
          id: 5,
          show: true,
          type: "NAVIGATE",
          title: "팔로워 추천",
          onPress: () => {
            navigateFollowAndContentRecommendScreen(navigation);
          }
        },
        {
          id: 6,
          show: true,
          type: "NAVIGATE",
          title: "개인정보 취급방침",
          onPress: () => {
            navigateWebViewScreen(navigation, {
              uri: environment.privacyPolicy
            });
          }
        },
        {
          id: 7,
          show: true,
          type: "NAVIGATE",
          title: "이용약관",
          onPress: () => {
            navigateWebViewScreen(navigation, { uri: environment.termsOfUse });
          }
        },
        {
          id: 8,
          show: true,
          type: "NAVIGATE",
          title: "문의하기",
          onPress: () => {
            Linking.canOpenURL("mailto:ask@mardi.life").then(supported => {
              if (supported) {
                Linking.openURL("mailto:ask@mardi.life");
              } else {
                Alert.alert("메일함을 열 수 없습니다.");
              }
            });
          }
        },
        {
          id: 9,
          show: !isFacebookUser,
          type: "NAVIGATE",
          title: "비밀번호 재설정",
          onPress: () => {
            navigateProfileResetPasswordScreen(navigation);
          },
          isSectionHolder: true
        },
        {
          id: 10,
          show: true,
          type: "PLAIN",
          title: "로그아웃",
          onPress: () => {
            navigateButtonModalScreen(navigation, {
              type: "INFO",
              content: "로그아웃 하시겠습니까?",
              rightText: "로그아웃",
              onRightPress: () => {
                audioStore.clearInstantAudio();
                audioStore.clearAudios();
                navigateAuthLandingScreen(navigation);
                props.authStore.logoutClient();
              }
            });
          },
          isSectionHolder: isFacebookUser,
          contentStyle: {
            color: "red"
          }
        }
      ]
    };
  }

  public render() {
    const { audioStore } = this.props;
    return (
      <>
        <PlainHeader>
          <BackButton onPress={this.goBack} />
          <HeaderTitle>설정</HeaderTitle>
        </PlainHeader>
        <Container>
          <SettingList
            data={this.state.settings.filter(setting => setting.show)}
            extraData={{
              instantPlaying: audioStore.instantPlaying,
              instantAudio: audioStore.instantAudio
            }}
            renderItem={this.renderSettingItem}
            ItemSeparatorComponent={Seperator}
          />
        </Container>
      </>
    );
  }

  private renderSettingItem: ListRenderItem<
    SettingCardProps & { isSectionHolder?: boolean }
  > = ({ item }) => {
    const { audioStore } = this.props;
    const { isSectionHolder, ...props } = item;
    const { type } = props;
    const isPlaying =
      audioStore.instantPlaying &&
      audioStore.instantAudio === environment.aboutMardi;

    if (type === "AUDIO") {
      return (
        <React.Fragment>
          {isSectionHolder ? <SectionSeperator /> : null}
          <SettingCard {...props as IAudioSettingProps} isPlaying={isPlaying} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {isSectionHolder ? <SectionSeperator /> : null}
        <SettingCard {...props} />
      </React.Fragment>
    );
  };

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };
}

export function navigateSettingScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.push("SettingScreen");
}
