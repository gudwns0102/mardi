import _ from "lodash";
import { inject, observer } from "mobx-react";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { BottomNotch } from "src/components/BottomNotch";
import { QuestionCard } from "src/components/cards/QuestionCard";
import { PlainHeader } from "src/components/PlainHeader";
import { Recorder } from "src/components/Recorder";
import { Text } from "src/components/Text";
import { Bold } from "src/components/texts/Bold";
import { HedaerText } from "src/components/texts/HeaderText";
import { navigateButtonModalScreen } from "src/screens/ButtonModalScreen";
import { navigateContentEditScreen } from "src/screens/ContentEditScreen";
import { IAudioStore } from "src/stores/AudioStore";
import { IQuestionStore } from "src/stores/QuestionStore";
import { IRootStore } from "src/stores/RootStore";
import { IUploadStore } from "src/stores/UploadStore";
import { colors } from "src/styles/colors";
import { CONTENT_RECORD_TIME } from "src/utils/Audio";
import { deviceWidth } from "src/utils/Dimensions";

interface IInjectProps {
  audioStore: IAudioStore;
  questionStore: IQuestionStore;
  uploadStore: IUploadStore;
}

interface IParams {
  questionId?: IQuestion["id"];
  questionText: string;
  patternIndex?: number;
  backgroundIndex?: number;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

interface IState {
  recording: boolean;
  recorded: boolean;
}

const DEFAULT_BACKGROUND_INDEX = 0;

const DEFAULT_PATTERN_INDEX = 0;

const Cancel = styled(Text)`
  font-size: 16px;
  line-height: 27px;
  color: rgb(69, 69, 69);
`;

const Next = styled(Bold)<{ active: boolean }>`
  font-size: 16px;
  line-height: 27px;
  color: ${props => (props.active ? colors.blue300 : "rgb(177, 177, 177)")};
`;

const Container = styled.View`
  width: 100%;
  flex: 1;
`;

const BodyContainer = styled.View`
  width: 100%;
  flex: 1;
  background-color: #ebebeb;
  align-items: center;
  justify-content: center;
`;

const Question = styled(QuestionCard)`
  width: ${deviceWidth - 32};
  align-self: center;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    audioStore: store.audioStore,
    questionStore: store.questionStore,
    uploadStore: store.uploadStore
  })
)
@observer
export class RecordScreen extends React.Component<IProps, IState> {
  public state = {
    recording: false,
    recorded: false
  };

  public componentDidMount() {
    const { uploadStore } = this.props;
    uploadStore.clearContent();
  }

  public render() {
    const { navigation, audioStore } = this.props;
    const { recorded } = this.state;
    const questionText = navigation.getParam("questionText");
    const question = this.question;

    return (
      <>
        <PlainHeader>
          <Cancel onPress={this.goBack}>취소</Cancel>
          <HedaerText>녹음하기</HedaerText>
          <Next active={recorded} onPress={this.onNextPress}>
            다음
          </Next>
        </PlainHeader>
        <Container>
          <BodyContainer>
            <Question
              question={question}
              onPlayPress={
                question && question.audio
                  ? _.partial(audioStore.pushInstantAudio, question.audio)
                  : undefined
              }
              questionText={questionText}
              patternIndex={this.patternIndex}
              backgroundIndex={this.backgroundIndex}
            />
          </BodyContainer>
          <Recorder
            navigation={navigation}
            maxRecordTime={CONTENT_RECORD_TIME}
            onInitRecord={() =>
              this.setState({ recording: false, recorded: false })
            }
            onStartRecord={() =>
              this.setState({ recording: true, recorded: false })
            }
            onEndRecord={() =>
              this.setState({ recording: false, recorded: true })
            }
            showBarButtons={false}
            defaultShowBodyContainer={true}
            isPostActive={recorded}
            barRightComponentType="TIME"
          />
        </Container>
        <BottomNotch backgroundColor="rgb(242, 242, 242)" />
      </>
    );
  }

  private goBack = () => {
    const { navigation } = this.props;
    const { recording, recorded } = this.state;

    if (!recording && !recorded) {
      return navigation.goBack(null);
    }

    navigateButtonModalScreen(navigation, {
      type: "DEFAULT",
      content: `녹음화면을 나가시겠습니까?\n나가시게되면 녹음했던 내용은\n삭제됩니다`,
      leftText: "취소",
      rightText: "나가기",
      onRightPress: () => {
        navigation.goBack(null);
        navigation.goBack(null);
      }
    });
  };

  private onNextPress = () => {
    const { navigation, uploadStore } = this.props;
    const { recorded } = this.state;
    const questionId = navigation.getParam("questionId");
    const questionText = navigation.getParam("questionText");
    const question = this.question;

    if (!recorded) {
      return;
    }

    navigateContentEditScreen(navigation, {
      type: "FROM_RECORD",
      questionId,
      questionText: questionId ? questionText : "",
      patternIndex: _.get(
        question,
        ["default_image_pattern_idx"],
        this.patternIndex
      ),
      backgroundIndex: _.get(
        question,
        ["default_image_color_idx"],
        this.backgroundIndex
      ),
      defaultContent: uploadStore.title,
      defaultPhoto: uploadStore.image
    });
  };

  private get navigation() {
    return this.props.navigation;
  }

  private get question() {
    const { navigation, questionStore } = this.props;
    const questionId = navigation.getParam("questionId");
    const question = questionId
      ? questionStore.questions.get(questionId.toString())!
      : undefined;

    return question;
  }

  private get patternIndex() {
    return this.navigation.getParam("patternIndex") || DEFAULT_PATTERN_INDEX;
  }

  private get backgroundIndex() {
    return (
      this.navigation.getParam("backgroundIndex") || DEFAULT_BACKGROUND_INDEX
    );
  }
}

export function navigateRecordScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.navigate("RecordScreen", params);
}
