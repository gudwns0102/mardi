import _ from "lodash";
import { inject, observer } from "mobx-react";
import React from "react";
import { Keyboard, View } from "react-native";
import {
  audioPath,
  audioPathToFormUri,
  REPLY_RECORD_TIME
} from "src/utils/Audio";
import styled from "styled-components/native";

import { images } from "assets/images";
import { NavigationScreenProp } from "react-navigation";
import { postReportsAPI } from "src/apis";
import { deleteMagazineContentReply } from "src/apis/magazines/deleteMagazineContentReply";
import { getMagazineContentReplies } from "src/apis/magazines/getMagazineContentReplies";
import { postMagazineContentAudioReply } from "src/apis/magazines/postMagazineContentAudioReply";
import { postMagazineContentTextReply } from "src/apis/magazines/postMagazineContentTextReply";
import { BottomNotch } from "src/components/BottomNotch";
import { IconButton } from "src/components/buttons/IconButton";
import { KeyboardSpacer } from "src/components/KeyboardSpacer";
import { MagazineReplyList } from "src/components/lists/MagazineReplyList";
import { PlainHeader } from "src/components/PlainHeader";
import { Recorder } from "src/components/Recorder";
import { Text } from "src/components/Text";
import { Bold } from "src/components/texts/Bold";
import { injectLoading } from "src/decorators/injectLoading";
import { IAudioStore } from "src/stores/AudioStore";
import { IContentStore } from "src/stores/ContentStore";
import { IMagazineStore } from "src/stores/MagazineStore";
import { IReplyStore } from "src/stores/ReplyStore";
import { IRootStore } from "src/stores/RootStore";
import { IToastStore } from "src/stores/ToastStore";
import { IUserStore } from "src/stores/UserStore";
import { colors } from "src/styles/colors";
import { isIos } from "src/utils/Platform";
import { shadow } from "src/utils/Shadow";
import { navigateButtonModalScreen } from "./ButtonModalScreen";
import { navigateUserPageScreen } from "./UserPageScreen";

interface IInjectProps {
  audioStore: IAudioStore;
  contentStore: IContentStore;
  userStore: IUserStore;
  replyStore: IReplyStore;
  toastStore: IToastStore;
  magazineStore: IMagazineStore;
}

interface IParams {
  magazineId: number;
  magazineContentId: number;
  mode: ReplyType;
  showRecorder: boolean;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

interface IState {
  mode: ReplyType;
  text: string;
  recordingTime: number;
  recorded: boolean;
  hidden: boolean;
  tagged_user?: ITaggedUser;
  replies: IReply[];
}

const BackButton = styled(IconButton)`
  width: 24px;
  height: 24px;
`;

const LockIcon = styled(IconButton)<{ active: boolean }>`
  position: absolute;
  width: 24px;
  height: 24px;
  left: 17px;
  bottom: 12px;
`;

const BarContainer = styled.View<{ mode: ReplyType }>`
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding-vertical: ${isIos() ? "10px" : "0px"};
  padding-left: 12px;
  padding-right: 16px;
  background-color: ${colors.white};

  ${shadow({ opacity: 0.18 })}
`;

const ReplyModeButton = styled(IconButton)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${colors.blue300};
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const TextReplyInput = styled.TextInput.attrs({
  placeholder: "댓글을 입력하세요",
  placeholderTextColor: colors.gray250,
  autoCorrect: false
})`
  flex: 1;
  max-height: 200px;
  color: ${colors.black};
  margin-left: 5px;
  margin-right: 15px;
`;

const PostButton = styled.TouchableOpacity``;

const Post = styled(Bold)<{ active: boolean }>`
  font-size: 14px;
  color: ${props => (props.active ? colors.blue300 : colors.gray400)};
`;

const HeaderText = styled(Bold)``;

const TaggedUserText = styled(Text)`
  color: ${colors.blue300};
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    audioStore: store.audioStore,
    contentStore: store.contentStore,
    userStore: store.userStore,
    replyStore: store.replyStore,
    toastStore: store.toastStore,
    magazineStore: store.magazineStore
  })
)
@observer
export class MagazineReplyScreen extends React.Component<IProps, IState> {
  public replyListRef = React.createRef<any>();
  public recorderRef = React.createRef<any>();

  constructor(props: IProps) {
    super(props);

    this.state = {
      mode: this.defaultMode,
      text: "",
      recordingTime: 0,
      recorded: false,
      hidden: false,
      replies: []
    };
  }

  public async componentDidMount() {
    const { mode } = this.state;

    Keyboard.addListener("keyboardDidShow", this.scrollToTop);

    if (mode === "audio" && this.showRecorderAtFirst) {
      this.showRecorder();
    }

    const { results } = await getMagazineContentReplies({
      magazineId: this.magazineId,
      magazineContentId: this.magazineContentId
    });

    this.setState({ replies: results });
  }

  public async componentWillUnmount() {
    Keyboard.removeListener("keyboardDidShow", this.scrollToTop);
  }

  public render() {
    const { navigation, audioStore } = this.props;
    const { mode, text, hidden, tagged_user, recorded, replies } = this.state;
    const isAudioMode = mode === "audio";

    return (
      <React.Fragment>
        <PlainHeader>
          <BackButton source={images.btnCommonBack} onPress={this.goBack} />
          <HeaderText>댓글</HeaderText>
          <React.Fragment />
        </PlainHeader>
        <View style={{ flex: 1 }}>
          <MagazineReplyList
            ref={this.replyListRef}
            data={replies}
            onAvatarPress={this.onAvatarPress}
            onTextPress={this.startTextReplyMode}
            onAudioPress={this.startAudioReplyMode}
            onDeletePress={this.deleteReply}
            onReportPress={this.reportReply}
            onScrollBeginDrag={this.hideRecorder}
          />
          {/* <ReplyList
            onRef={this.replyListRef}
            replyBundle={this.replyBundle}
            contentId={this.contentId}
            scrollEnabled={true}
            swipeBackOnButtonPress={true}
            onTextPress={this.startTextReplyMode}
            onAudioPress={this.startAudioReplyMode}
            onScrollBeginDrag={this.hideRecorder}
          /> */}
          <LockIcon
            active={hidden}
            source={hidden ? images.lockBlue : images.lock}
            onPress={() => this.setState({ hidden: !hidden })}
          />
        </View>
        {!isAudioMode && (
          <BarContainer mode={mode}>
            <ReplyModeButton
              onPress={this.toggleMode}
              source={images.btnCommentInputVoice}
            />
            {tagged_user ? (
              <TaggedUserText>@{tagged_user.username}</TaggedUserText>
            ) : null}
            <TextReplyInput
              value={text}
              onChangeText={this.onChangeText}
              multiline={true}
              autoFocus={true}
            />

            <PostButton onPress={this.onPostPress}>
              <Post active={this.canPostReply}>등록</Post>
            </PostButton>
          </BarContainer>
        )}
        {isAudioMode && (
          <Recorder
            ref={this.recorderRef}
            navigation={navigation}
            maxRecordTime={REPLY_RECORD_TIME}
            onInitRecord={() => {
              this.setState({ recorded: false });
            }}
            onStartRecord={() => {
              audioStore.stopAudio();
            }}
            onEndRecord={() => {
              this.setState({ recorded: true });
            }}
            showBarButtons={true}
            onBarModePress={this.toggleMode}
            onBarPostPress={this.onPostPress}
            isPostActive={this.canPostReply}
            defaultShowBodyContainer={false}
            enableMinimize={true}
            barRightComponentType={recorded ? "POST" : "TIME"}
          />
        )}
        <BottomNotch
          backgroundColor={mode === "text" ? colors.white : colors.gray200}
        />
        <KeyboardSpacer />
      </React.Fragment>
    );
  }

  private get defaultMode() {
    return this.props.navigation.getParam("mode");
  }

  private get showRecorderAtFirst() {
    return this.props.navigation.getParam("showRecorder");
  }

  @injectLoading
  private onPostPress = async () => {
    const { mode, text, hidden, tagged_user } = this.state;

    if (!this.canPostReply) {
      return false;
    }

    if (mode === "text") {
      try {
        const reply = await postMagazineContentTextReply({
          magazineId: this.magazineId,
          magazineContentId: this.magazineContentId,
          type: "text",
          text,
          hidden,
          tagged_user: _.get(tagged_user, ["uuid"], undefined)
        });

        this.onPostPressSuccess(reply);
      } catch (error) {
        this.onPostPressFail();
      }
    } else if (mode === "audio") {
      try {
        const audioForm = new FormData();
        const extension = audioPath.split(".").pop();
        audioForm.append("type", "audio");
        audioForm.append("audio", {
          uri: audioPathToFormUri(audioPath),
          name: `audio.${extension}`,
          type: `audio/${extension}`
        } as any);

        if (tagged_user) {
          audioForm.append("tagged_user", tagged_user);
        }

        if (hidden) {
          audioForm.append("hidden", hidden as any);
        }

        const reply = await postMagazineContentAudioReply({
          magazineId: this.magazineId,
          magazineContentId: this.magazineContentId,
          audioForm
        });

        this.onPostPressSuccess(reply);
      } catch (error) {
        this.onPostPressFail();
      }
    }
  };

  private onPostPressSuccess = (reply: IReply) => {
    const { toastStore } = this.props;
    this.setState(prevState => ({
      text: "",
      recorded: false,
      recordingTime: 0,
      tagged_user: undefined,
      replies: [...prevState.replies, reply]
    }));
    setTimeout(() => {
      this.scrollToEnd();
      this.initRecorder();
      this.hideRecorder();
    }, 100);
    toastStore.openToast({
      content: "댓글이 등록되었습니다.",
      type: "INFO"
    });

    if (this.magazineContent) {
      this.magazineContent.increaseReplyCount();
    }
  };

  private onPostPressFail = () => {
    const { toastStore } = this.props;
    toastStore.openToast({
      content: "댓글 등록에 실패했습니다.",
      type: "ERROR"
    });
  };

  private toggleMode = () => {
    const { mode } = this.state;
    const nextMode = mode === "audio" ? "text" : "audio";
    this.setState({ mode: nextMode, tagged_user: undefined }, () => {
      if (nextMode === "audio") {
        this.showRecorder();
      }
    });
  };

  private onAvatarPress = (reply: IReply) => {
    navigateUserPageScreen(this.props.navigation, { uuid: reply.user.uuid });
  };

  private startTextReplyMode = (reply: IReply) => {
    this.setState({
      mode: "text",
      tagged_user: { uuid: reply.user.uuid, username: reply.user.username }
    });
  };

  private startAudioReplyMode = (reply: IReply) => {
    this.setState(
      {
        mode: "audio",
        tagged_user: { uuid: reply.user.uuid, username: reply.user.username }
      },
      this.showRecorder
    );
  };

  private deleteReply = async (reply: IReply) => {
    const { replies } = this.state;

    await deleteMagazineContentReply({
      magazineId: this.magazineId,
      magazineContentId: this.magazineContentId,
      replyId: reply.id
    });

    const index = replies.findIndex($reply => $reply.id === reply.id);

    if (index !== -1) {
      const newReplies = [...replies];
      newReplies.splice(index, 1);
      this.setState({
        replies: [...newReplies]
      });

      if (this.magazineContent) {
        this.magazineContent.decreaseReplyCount();
      }
    }
  };

  private reportReply = async (reply: IReply) => {
    const {
      navigation,
      replyStore,
      userStore: { client }
    } = this.props;

    if (!client) {
      return;
    }

    const { uuid } = client;

    navigateButtonModalScreen(navigation, {
      type: "ERROR",
      content: "댓글을 신고하시겠습니까?",
      rightText: "예",
      onRightPress: () => {
        postReportsAPI({
          type: "magazine_content_reply",
          target_id: reply.id,
          user: uuid,
          content: "신고"
        });
        navigation.goBack(null);
      }
    });
  };

  private onChangeText = (text: string) => {
    this.setState({ text });
  };

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };

  private initRecorder = () => {
    _.invoke(this.recorderRef.current, ["initRecord"]);
  };

  private showRecorder = () => {
    _.invoke(this.recorderRef.current, ["showBodyContainer"]);
  };

  private hideRecorder = () => {
    _.invoke(this.recorderRef.current, ["hideBodyContainer"]);
  };

  private scrollToTop = () => {
    _.invoke(this.replyListRef.current, ["scrollToOffset"], {
      offset: 0
    });
  };

  private scrollToEnd = () => {
    _.invoke(this.replyListRef.current, ["scrollToEnd"], {
      animated: true
    });
  };

  private get canPostReply() {
    const { text, mode, recorded } = this.state;
    const textReplyActive = text.length > 0;
    const audioReplyActive = recorded;

    const active = mode === "text" ? textReplyActive : audioReplyActive;
    return active;
  }

  public get magazineId() {
    return this.props.navigation.getParam("magazineId");
  }

  public get magazineContentId() {
    return this.props.navigation.getParam("magazineContentId");
  }

  public get magazine() {
    return this.props.magazineStore.magazines.get(this.magazineId.toString());
  }

  public get magazineContent() {
    if (this.magazine) {
      return (
        this.magazine.contents.find(
          content => content.id === this.magazineContentId
        ) || null
      );
    }

    return null;
  }
}

export const navigateMagazineReplyScreen = (
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) => {
  navigation.navigate("MagazineReplyScreen", params);
};
