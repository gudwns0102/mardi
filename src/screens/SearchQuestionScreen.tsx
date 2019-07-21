import _ from "lodash";
import { inject, observer } from "mobx-react";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";
import uuid from "uuid";

import { images } from "assets/images";
import { BackButton } from "src/components/buttons/BackButton";
import { Button } from "src/components/buttons/Button";
import { ContentLayoutSelector } from "src/components/ContentLayoutSelector";
import { ContentList } from "src/components/lists/ContentList";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { withAudioPlayer } from "src/hocs/withAudioPlayer";
import { navigateListenDetailScreen } from "src/screens/ListenDetailScreen";
import { navigateRecordScreen } from "src/screens/RecordScreen";
import { IAudioStore } from "src/stores/AudioStore";
import { IContentBundle } from "src/stores/ContentBundle";
import { IContentStore } from "src/stores/ContentStore";
import { IRootStore } from "src/stores/RootStore";
import { colors } from "src/styles/colors";

interface IInjectProps {
  audioStore: IAudioStore;
  contentStore: IContentStore;
}

interface IParams {
  questionId: IQuestion["id"];
  questionText: IQuestion["text"];
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

interface IState {
  contentLayoutType: ContentLayoutType;
}

const RecordButtonContainer = styled(Button)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 0 15px 0 8px;
  border-radius: 22px;
  background-color: ${colors.white};
`;

const RedCircle = styled.View`
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: rgb(255, 10, 10);
  margin-right: 15px;
`;

const RecordButtonText = styled(Text).attrs({ type: "bold" })`
  font-size: 14px;
  color: rgb(255, 10, 10);
`;

const BodyContainer = styled.View`
  width: 100%;
  flex: 1;
  background-color: rgb(235, 235, 235);
`;

const BackgroundImage = styled.Image`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  resize-mode: repeat;
`;

const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: { paddingTop: 21 }
})`
  width: 100%;
  flex: 1;
`;

const QuestionTextContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  padding: 0 52px;
  margin-bottom: 30px;
`;

const QuestionText = styled(Text).attrs({ type: "bold" })`
  font-size: 18px;
  color: rgb(69, 69, 69);
`;

const AudioButtonsRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0 60px;
  margin-bottom: 36px;
`;

const AudioButton = styled(Button).attrs({
  textProps: {
    type: "bold",
    style: {
      color: colors.white,
      fontSize: 14
    }
  }
})`
  width: 121px;
  height: 36px;
  border-radius: 12px;
  background-color: rgb(25, 86, 212);
`;

const GrayAudioButton = styled(AudioButton)`
  background-color: rgb(155, 155, 155);
  margin-left: 16px;
`;

const StyledContentLayoutSelector = styled(ContentLayoutSelector)`
  margin: 0px 16px 2px;
  background-color: rgba(255, 255, 255, 0.6);
`;

const EmptyView = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
  padding-top: 145px;
`;

const EmptyText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: rgb(25, 86, 212);
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    audioStore: store.audioStore,
    contentStore: store.contentStore
  })
)
@withAudioPlayer
@observer
export class SearchQuestionScreen extends React.Component<IProps, IState> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "rgba(247, 247, 247, 0.8)"
    },
  };
  public contentBundleId: string;
  public contentBundle: IContentBundle;

  constructor(props: IProps) {
    super(props);

    this.contentBundleId = uuid();
    this.contentBundle = props.contentStore.createContentBundle(
      this.contentBundleId
    );

    this.state = {
      contentLayoutType: "CARD"
    };
  }

  public componentDidMount() {
    const { navigation } = this.props;
    this.contentBundle.initializeContents({
      question: navigation.getParam("questionId")
    });
  }

  public render() {
    const { contentLayoutType } = this.state;

    return (
      <>
        <PlainHeader>
          <BackButton onPress={this.goBack} />
          <React.Fragment />
          <RecordButtonContainer onPress={this.onQuestionPress}>
            <RedCircle />
            <RecordButtonText>이 주제 녹음하기</RecordButtonText>
          </RecordButtonContainer>
        </PlainHeader>
        <BodyContainer>
          <BackgroundImage source={images.pattern4} />
          <ScrollView>
            <QuestionTextContainer>
              <QuestionText>{this.questionText}</QuestionText>
            </QuestionTextContainer>
            <AudioButtonsRow>
              <AudioButton onPress={this.onSequentialPlay}>
                전체 재생
              </AudioButton>
              <GrayAudioButton onPress={this.onRandomPlay}>
                랜덤 재생
              </GrayAudioButton>
            </AudioButtonsRow>
            <StyledContentLayoutSelector
              numContents={this.contentBundle.count}
              onCardViewPress={_.partial(this.onContentLayoutPress, "CARD")}
              onListViewPress={_.partial(this.onContentLayoutPress, "LIST")}
              type={contentLayoutType}
            />
            <ContentList
              type={contentLayoutType}
              contentBundle={this.contentBundle}
              onCardPress={this.onCardPress}
              ListEmptyComponent={
                this.contentBundle.hasNoResult ? (
                  <EmptyView>
                    <EmptyText>녹음된 마디가 없습니다</EmptyText>
                  </EmptyView>
                ) : null
              }
            />
          </ScrollView>
        </BodyContainer>
      </>
    );
  }

  private get navigation() {
    return this.props.navigation;
  }

  private get questionId() {
    return this.navigation.getParam("questionId");
  }

  private get questionText() {
    return this.navigation.getParam("questionText");
  }

  private onSequentialPlay = () => {
    const { audioStore } = this.props;
    audioStore.clearAudios();
    setTimeout(
      () => audioStore.pushAudios(this.contentBundle.contentArray),
      100
    );
  };

  private onRandomPlay = () => {
    const { audioStore } = this.props;
    audioStore.clearAudios();
    setTimeout(
      () => audioStore.pushAudios(_.shuffle(this.contentBundle.contentArray)),
      100
    );
  };

  private onCardPress = (item: IContent) => {
    navigateListenDetailScreen(this.navigation, { contentId: item.id });
  };

  private onQuestionPress = () => {
    navigateRecordScreen(this.navigation, {
      questionId: this.questionId,
      questionText: this.questionText
    });
  };

  private onContentLayoutPress = (contentLayoutType: ContentLayoutType) => {
    this.setState({ contentLayoutType });
  };

  private onRecordPress = () => {};

  private goBack = () => {
    this.navigation.goBack(null);
  };
}

export function navigateSearchQuestionScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.navigate("SearchQuestionScreen", params);
}
