import _ from "lodash";
import { inject, observer } from "mobx-react";
import React, { ComponentClass } from "react";
import { FlatList, FlatListProps, ListRenderItem } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { Button } from "src/components/buttons/Button";
import { QuestionCard } from "src/components/cards/QuestionCard";
import { Text } from "src/components/Text";
import { withAudioPlayer } from "src/hocs/withAudioPlayer";
import { navigateRecordScreen } from "src/screens/RecordScreen";
import { IAudioStore } from "src/stores/AudioStore";
import {
  IDefaultQuestion,
  IQuestionStore,
  IQuestionWithStyle
} from "src/stores/QuestionStore";
import { IRootStore } from "src/stores/RootStore";
import { colors, getRandomBackgroundIndex } from "src/styles/colors";
import { getRandomPatternIndex } from "src/utils/ContentPattern";
import { deviceWidth } from "src/utils/Dimensions";
import { shadow } from "src/utils/Shadow";

interface IInjectProps {
  audioStore: IAudioStore;
  questionStore: IQuestionStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any>;
}

interface IState {
  defaultQuestion: IDefaultQuestion | null;
}

const Container = styled.View`
  width: 100%;
  flex: 1;
  background-color: #ebebeb;
`;

const FreeSpeakingButton = styled(Button)`
  width: ${deviceWidth - 92};
  height: 54px;
  border-radius: 34px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-top: 20px;
  margin-bottom: 12px;
  padding: 0 22px;
  background-color: ${colors.white};
  ${shadow({ opacity: 0.09 })}
`;

const ButtonText = styled(Text).attrs({ type: "bold" })`
  font-size: 15px;
  color: ${colors.black};
`;

const RecordIcon = styled.View`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: ${colors.red100};

  margin-left: 10px;
  margin-right: 7px;
`;

const ButtonRecordText = styled(Text).attrs({ type: "bold" })`
  font-size: 14px;
  color: ${colors.red100};
`;

const QuestionList = styled<ComponentClass<FlatListProps<IQuestionWithStyle>>>(
  FlatList
).attrs({
  contentContainerStyle: {
    paddingBottom: 54
  }
})`
  width: 100%;
  flex: 1;
`;

const QuestionItem = styled(QuestionCard)`
  margin: 6px 0;
  width: ${deviceWidth - 32};
  align-self: center;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    audioStore: store.audioStore,
    questionStore: store.questionStore
  })
)
@withAudioPlayer
@observer
export class QuestionScreen extends React.Component<IProps, IState> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "#EBEBEB"
    }
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      defaultQuestion: null
    };
  }

  public async componentDidMount() {
    const { questionStore } = this.props;
    questionStore.fetchQuestions();
    await questionStore.fetchDefaultQuestions();
    const defaultQuestionsArray = Array.from(
      questionStore.defaultQuestions.values()
    );
    const defaultQuestionsCount = defaultQuestionsArray.length;
    const randomDefaultQuestion =
      defaultQuestionsArray[_.random(0, defaultQuestionsCount - 1)];
    this.setState({ defaultQuestion: randomDefaultQuestion });
  }

  public render() {
    const { questionStore } = this.props;
    const { defaultQuestion } = this.state;
    const data = Array.from(questionStore.questions.values()) || [];
    return (
      <>
        <FreeSpeakingButton onPress={this.onFreeQuestionPress}>
          <ButtonText>{defaultQuestion ? defaultQuestion.text : ""}</ButtonText>
          <RecordIcon />
          <ButtonRecordText>녹음하기</ButtonRecordText>
        </FreeSpeakingButton>
        <Container>
          <QuestionList
            data={data}
            renderItem={this.renderQuestionItem}
            keyExtractor={item => item.id.toString()}
          />
        </Container>
      </>
    );
  }

  private renderQuestionItem: ListRenderItem<IQuestionWithStyle> = ({
    item
  }) => {
    const { audioStore } = this.props;
    return (
      <QuestionItem
        question={item}
        onPress={_.partial(this.onQuestionPress, item)}
        onPlayPress={_.partial(this.onQuestionPlayPress, item)}
      />
    );
  };

  private onQuestionPlayPress = (question: IQuestionWithStyle) => {
    const { audioStore, questionStore } = this.props;
    if (!question.audio) {
      return;
    }

    audioStore.pushInstantAudio(question.audio);
    questionStore.countQuestionPlayPress(question.id);
  };

  private onFreeQuestionPress = () => {
    const { navigation, questionStore } = this.props;
    const { defaultQuestion } = this.state;

    if (!defaultQuestion) {
      return;
    }

    questionStore.countDefaultQuestionPress(defaultQuestion.id);

    navigateRecordScreen(navigation, {
      questionText: defaultQuestion.text,
      patternIndex: getRandomPatternIndex(),
      backgroundIndex: getRandomBackgroundIndex()
    });
  };

  private onQuestionPress = (question: IQuestionWithStyle) => {
    const { navigation } = this.props;
    navigateRecordScreen(navigation, {
      questionId: question.id,
      questionText: question.text
    });
    return;
  };
}

export function navigateQuestionScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.navigate("QuestionScreen");
}
