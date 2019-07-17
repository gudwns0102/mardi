import _ from "lodash";
import { inject, observer } from "mobx-react";
import React from "react";
import { Share, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";
import uuid from "uuid";

import { images } from "assets/images";
import { BackButton } from "src/components/buttons/BackButton";
import { Button } from "src/components/buttons/Button";
import { IconButton } from "src/components/buttons/IconButton";
import { ReplyList } from "src/components/lists/ReplyList";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { HedaerText } from "src/components/texts/HeaderText";
import { environment } from "src/config/environment";
import { injectLoading } from "src/decorators/injectLoading";
import { withAudioPlayer } from "src/hocs/withAudioPlayer";
import { navigateActionSheetModalScreen } from "src/screens/ActionSheetModalScreen";
import { navigateButtonModalScreen } from "src/screens/ButtonModalScreen";
import { navigateContentEditScreen } from "src/screens/ContentEditScreen";
import { navigateListenScreen } from "src/screens/ListenScreen";
import { navigateReplyScreen } from "src/screens/ReplyScreen";
import {
  navigateMypageScreen,
  navigateUserPageScreen
} from "src/screens/UserPageScreen";
import { IAudioStore } from "src/stores/AudioStore";
import { IContentBundle } from "src/stores/ContentBundle";
import { IContentStore } from "src/stores/ContentStore";
import { IReplyBundle } from "src/stores/ReplyBundle";
import { IReplyStore } from "src/stores/ReplyStore";
import { IRootStore } from "src/stores/RootStore";
import { IToastStore } from "src/stores/ToastStore";
import { IUserStore } from "src/stores/UserStore";
import { colors } from "src/styles/colors";
import { deviceHeight } from "src/utils/Dimensions";
import { ContentList } from "src/components/lists/ContentList";

interface IInjectProps {
  audioStore: IAudioStore;
  contentStore: IContentStore;
  replyStore: IReplyStore;
  userStore: IUserStore;
  toastStore: IToastStore;
}

interface IParams {
  contentId: IContent["id"];
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

const Container = styled.ScrollView`
  flex: 1;
  background-color: #ebebeb;
`;

const Icon = styled(IconButton)<{ isLastItem?: boolean }>`
  width: 24px;
  height: 24px;
  margin-right: ${props => (props.isLastItem ? 0 : 17)};
`;
const ShareIcon = styled(Icon).attrs({ source: images.btnCommonShare })`
  margin-right: 16px;
`;
const DotsIcon = styled(Icon).attrs({ source: images.btnCommonMore })``;

const HeaderRightButtonWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FooterContainer = styled.View`
  flex: 1;
  padding: 0 20px;
  background-color: white;
`;

const FooterButtonRow = styled.View`
  width: 100%;
  flex-direction: row;
  padding: 15px 0;
`;

const FooterButton = styled(Button)`
  background-color: transparent;
  flex: 1;
  height: 24px;
`;

const FooterButtonText = styled(Text)`
  color: ${colors.gray450};
`;

const CharIcon = styled.Image.attrs({ source: images.char })`
  width: 24px;
  margin-right: 4px;
`;

const MikeIcon = styled.Image.attrs({ source: images.speakGray })`
  width: 24px;
  margin-right: 4px;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    audioStore: store.audioStore,
    contentStore: store.contentStore,
    replyStore: store.replyStore,
    userStore: store.userStore,
    toastStore: store.toastStore
  })
)
@withAudioPlayer
@observer
export class ListenDetailScreen extends React.Component<IProps, any> {
  public static options: IScreenOptions = {
    statusBarProps: {
      translucent: false,
      backgroundColor: "#EBEBEB"
    }
  };
  public contentBundleId: string;
  public replyBundleId: string;
  public contentBundle: IContentBundle;
  public replyBundle: IReplyBundle;

  constructor(props: IProps) {
    super(props);

    this.contentBundleId = uuid();
    this.contentBundle = props.contentStore.createContentBundle(
      this.contentBundleId
    );

    this.replyBundleId = props.replyStore.createBundle(this.contentId);
    this.replyBundle = props.replyStore.replyBundles.get(this.replyBundleId)!;
  }

  public async componentDidMount() {
    const { navigation, toastStore } = this.props;
    try {
      await Promise.all([
        this.contentBundle.initializeContent(this.contentId),
        this.replyBundle.initialize()
      ]);
    } catch (error) {
      navigation.goBack(null);
      toastStore.openToast({
        type: "ERROR",
        content: error.message,
        marginTop: 0
      });
    }
  }

  public componentWillUnmount() {
    const { contentStore, replyStore } = this.props;
    contentStore.clearContentBundle(this.contentBundleId);
    replyStore.clearBundle(this.replyBundleId);
  }

  public render() {
    const content = this.content;

    if (!content) {
      return <View />;
    }

    const replies = this.replyBundle.replyArray;

    return (
      <>
        <PlainHeader>
          <BackButton onPress={this.goBack} />
          <HedaerText>한마디</HedaerText>
          <HeaderRightButtonWrapper>
            <ShareIcon onPress={this.onSharePress} />
            <DotsIcon isLastItem={true} onPress={this.onDotsPress} />
          </HeaderRightButtonWrapper>
        </PlainHeader>
        <Container>
          <ContentList 
            contentBundle={this.contentBundle}
            onEndReached={undefined}
          />
          <FooterContainer>
            <FooterButtonRow>
              <FooterButton
                onPress={_.partial(this.onReplyPress, "audio", true)}
              >
                <MikeIcon />
                <FooterButtonText>음성 댓글달기</FooterButtonText>
              </FooterButton>
              <FooterButton
                onPress={_.partial(this.onReplyPress, "text", false)}
              >
                <CharIcon />
                <FooterButtonText>문자 댓글달기</FooterButtonText>
              </FooterButton>
            </FooterButtonRow>
          </FooterContainer>
          {replies && (
            <ReplyList
              style={{ minHeight: deviceHeight - 400 }}
              replyBundle={this.replyBundle}
              content={this.content}
              contentId={content.id}
              scrollEnabled={false}
              onPress={_.partial(this.onReplyPress, "audio", false)}
            />
          )}
        </Container>
      </>
    );
  }

  private get navigation() {
    return this.props.navigation;
  }

  private get contentId() {
    return this.navigation.getParam("contentId");
  }

  private get content() {
    return this.contentBundle.contents.get(this.contentId.toString());
  }

  private onSharePress = () => {
    const content = this.content;
    if (!content) {
      return;
    }

    Share.share({
      title: content.title,
      message: environment.share(content.id)
    });
  };

  @injectLoading
  private onDotsPress = () => {
    const { navigation, userStore } = this.props;
    const content = this.content;
    if (!content) {
      return;
    }
    const isClientContent = userStore.clientId === content.user.uuid;

    if (isClientContent) {
      navigateActionSheetModalScreen(navigation, {
        buttons: [
          {
            content: "수정하기",
            buttonType: "INFO",
            onPress: this.onEditPress
          },
          {
            content: "삭제하기",
            buttonType: "ERROR",
            onPress: this.onDeletePress
          }
        ]
      });
      return;
    } else {
      navigateActionSheetModalScreen(navigation, {
        buttons: [
          {
            content: "숨기기",
            buttonType: "ERROR",
            onPress: this.onHidePress
          },
          {
            content: "신고하기",
            buttonType: "ERROR",
            onPress: this.onReportPress
          }
        ]
      });
    }
  };

  private onReplyPress = (mode: ReplyType, showRecorder: boolean) => {
    const { navigation } = this.props;
    const contentId = navigation.getParam("contentId");
    navigateReplyScreen(navigation, {
      contentId,
      mode,
      showRecorder
    });
  };

  private onPlayPress = () => {
    const { audioStore } = this.props;
    const content = this.content;

    if (!content) {
      return;
    }

    audioStore.pushAudio(content);
  };

  private onEditPress = async () => {
    const { navigation } = this.props;
    const content = this.content;
    navigation.goBack(null);
    setTimeout(() => navigateContentEditScreen(navigation, {
      type: "FROM_CONTENT_DETAIL",
      questionId: _.get(content, ["question", "id"], undefined),
      questionText: _.get(content, ["question", "text"], ""),
      defaultContent: content!.title,
      defaultPhoto: content!.image,
      contentId: content!.id,
      patternIndex: content!.default_image_pattern_idx,
      backgroundIndex: content!.default_image_color_idx
    }), 100);
  };

  private onDeletePress = async () => {
    const { navigation, contentStore, toastStore } = this.props;
    const content = this.content;

    if (!content) {
      return;
    }

    navigateButtonModalScreen(navigation, {
      type: "ERROR",
      content: "이 게시물을 삭제 하시겠습니까?",
      leftText: "아니요",
      rightText: "삭제하기",
      onRightPress: async () => {
        try {
          await contentStore.deleteContent(content.id);
          toastStore.openToast({
            type: "INFO",
            content: "삭제되었습니다."
          });

          navigation.goBack(null);
          navigation.goBack(null);
          navigation.goBack(null);
          navigateMypageScreen(navigation);
        } catch (error) {
          toastStore.openToast({
            type: "ERROR",
            content: "컨텐츠를 삭제하지 못했습니다."
          });
          navigation.goBack(null);
          navigation.goBack(null);
        }
      }
    });
  };

  private onHidePress = () => {
    const { navigation, contentStore, toastStore } = this.props;
    const content = this.content;

    if (!content) {
      return;
    }

    navigateButtonModalScreen(navigation, {
      type: "ERROR",
      content: "이 게시물을 숨기시겠습니까?",
      leftText: "아니요",
      rightText: "숨기기",
      onRightPress: async () => {
        try {
          await contentStore.blockContent(content.id);
          toastStore.openToast({
            type: "INFO",
            content: "컨텐츠가 블록되었습니다."
          });
          navigateListenScreen(navigation);
        } catch (error) {
          toastStore.openToast({
            type: "ERROR",
            content: "컨텐츠 블록에 실패하였습니다."
          });
          navigation.goBack(null);
        }
      }
    });
  };

  private onReportPress = () => {
    const { navigation, contentStore, toastStore } = this.props;
    const content = this.content;

    if (!content) {
      return;
    }

    navigateButtonModalScreen(navigation, {
      type: "ERROR",
      content: "이 게시물을 신고 하시겠습니까?",
      leftText: "아니요",
      rightText: "신고하기",
      onRightPress: async () => {
        try {
          await contentStore.reportContent(content.id);
          toastStore.openToast({
            type: "INFO",
            content: "컨텐츠를 신고하였습니다."
          });

          navigation.goBack(null);
          navigation.goBack(null);
        } catch (error) {
          toastStore.openToast({
            type: "ERROR",
            content: "컨텐츠 신고에 실패하였습니다."
          });
          navigation.goBack(null);
          return;
        }
      }
    });
  };

  private navigateUserProfile = ($uuid: IUser["uuid"]) => {
    const { navigation, userStore } = this.props;
    const client = userStore.client;

    if (!client) {
      return;
    }

    navigateUserPageScreen(navigation, { uuid: $uuid });
  };

  private navigateSearchQuestion = () => {
    const content = this.content;
    if (!content || !content.question) {
      return;
    }

    // navigateSearchQuestionScreen(this.props.navigation, {
    //   questionId: content.question.id,
    //   questionText: content.question.text
    // });
  };

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };
}

export function navigateListenDetailScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.push("ListenDetailScreen", params);
}
