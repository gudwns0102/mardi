import { inject, observer } from "mobx-react";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { BottomNotch } from "src/components/BottomNotch";
import { IntroRecordButton } from "src/components/buttons/IntroRecordButton";
import { PlainHeader } from "src/components/PlainHeader";
import { Recorder } from "src/components/Recorder";
import { Text } from "src/components/Text";
import { IAudioStore } from "src/stores/AudioStore";
import { IRootStore } from "src/stores/RootStore";
import { IToastStore } from "src/stores/ToastStore";
import { IUserStore } from "src/stores/UserStore";
import { colors } from "src/styles/colors";
import { audioPath, INTRO_RECORD_TIME } from "src/utils/Audio";

interface IInjectProps {
  audioStore: IAudioStore;
  userStore: IUserStore;
  toastStore: IToastStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any>;
}

interface IState {
  recorded: boolean;
}

const HeaderText = styled(Text)`
  font-size: 16px;
  color: rgb(155, 155, 155);
`;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

@inject(({ store }: { store: IRootStore }) => ({
  audioStore: store.audioStore,
  userStore: store.userStore,
  toastStore: store.toastStore
}))
@observer
export class IntroRecordScreen extends React.Component<IProps, IState> {
  public state = {
    recorded: false
  };
  public render() {
    const { navigation, audioStore } = this.props;
    const { recorded } = this.state;
    return (
      <>
        <PlainHeader>
          <HeaderText onPress={this.goBack}>취소</HeaderText>
          <HeaderText type="bold">녹음하기</HeaderText>
          <HeaderText
            type="bold"
            style={recorded ? { color: colors.blue300 } : null}
            onPress={this.onSavePress}
          >
            저장
          </HeaderText>
        </PlainHeader>
        <Container>
          <IntroRecordButton />
        </Container>
        <Recorder
          navigation={navigation}
          maxRecordTime={INTRO_RECORD_TIME}
          showBarButtons={false}
          onInitRecord={() => this.setState({ recorded: false })}
          onStartRecord={() => {
            audioStore.stopAudio();
          }}
          onEndRecord={() => this.setState({ recorded: true })}
          defaultShowBodyContainer={true}
          barRightComponentType="TIME"
        />
        <BottomNotch backgroundColor={colors.gray200} />
      </>
    );
  }

  private onSavePress = () => {
    const { navigation, userStore, toastStore } = this.props;
    const { recorded } = this.state;

    if (!recorded) {
      return;
    }

    try {
      userStore.uploadClientIntroduction("안녕하세요!", audioPath);
      navigation.goBack(null);
      toastStore.openToast({
        type: "INFO",
        content: "소개 한마디가 등록되었습니다."
      });
    } catch (error) {
      toastStore.openToast({
        type: "ERROR",
        content: "소개 한마디 등록에 실패하였습니다."
      });
    }
  };

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };
}

export function navigateIntroRecordScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.navigate("IntroRecordScreen");
}
