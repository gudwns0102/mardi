import _ from "lodash";
import { inject, observer } from "mobx-react";
import React from "react";
import { Keyboard, View } from "react-native";
import { audioPath, REPLY_RECORD_TIME } from "src/utils/Audio";
import styled from "styled-components/native";

import { images } from "assets/images";
import { NavigationScreenProp } from "react-navigation";
import { BottomNotch } from "src/components/BottomNotch";
import { IconButton } from "src/components/buttons/IconButton";
import { KeyboardSpacer } from "src/components/KeyboardSpacer";
import { ReplyList } from "src/components/lists/ReplyList";
import { PlainHeader } from "src/components/PlainHeader";
import { Recorder } from "src/components/Recorder";
import { Text } from "src/components/Text";
import { Bold } from "src/components/texts/Bold";
import { injectLoading } from "src/decorators/injectLoading";
import { IAudioStore } from "src/stores/AudioStore";
import { IContentStore } from "src/stores/ContentStore";
import { IReplyBundle } from "src/stores/ReplyBundle";
import { IReplyStore } from "src/stores/ReplyStore";
import { IRootStore } from "src/stores/RootStore";
import { IToastStore } from "src/stores/ToastStore";
import { IUserStore } from "src/stores/UserStore";
import { colors } from "src/styles/colors";
import { isIos } from "src/utils/Platform";
import { shadow } from "src/utils/Shadow";

interface IInjectProps {
  audioStore: IAudioStore;
  contentStore: IContentStore;
  userStore: IUserStore;
  replyStore: IReplyStore;
  toastStore: IToastStore;
}

interface IParams {
  contentId: IContent["id"];
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
    toastStore: store.toastStore
  })
)
@observer
export class ReplyScreen extends React.Component<IProps, IState> {
  public replyListRef = React.createRef<any>();
  public recorderRef = React.createRef<any>();
  public replyBundleId: string;
  public replyBundle: IReplyBundle;

  constructor(props: IProps) {
    super(props);

    this.replyBundleId = props.replyStore.createBundle(this.contentId);
    this.replyBundle = props.replyStore.replyBundles.get(this.replyBundleId)!;

    this.state = {
      mode: this.defaultMode,
      text: "",
      recordingTime: 0,
      recorded: false,
      hidden: false
    };
  }

  public async componentDidMount() {
    const { mode } = this.state;

    Keyboard.addListener("keyboardDidShow", this.scrollToTop);

    if (mode === "audio" && this.showRecorderAtFirst) {
      this.showRecorder();
    }

    this.replyBundle.initialize();
  }

  public async componentWillUnmount() {
    Keyboard.removeListener("keyboardDidShow", this.scrollToTop);
    this.props.replyStore.clearBundle(this.replyBundleId);
  }

  public render() {
    const { navigation, audioStore } = this.props;
    const { mode, text, hidden, tagged_user, recorded } = this.state;
    const isAudioMode = mode === "audio";

    return (
      <React.Fragment>
        <PlainHeader>
          <BackButton source={images.btnCommonBack} onPress={this.goBack} />
          <HeaderText>댓글</HeaderText>
          <React.Fragment />
        </PlainHeader>
        <View style={{ flex: 1 }}>
          <ReplyList
            onRef={this.replyListRef}
            replyBundle={this.replyBundle}
            contentId={this.contentId}
            scrollEnabled={true}
            swipeBackOnButtonPress={true}
            onTextPress={this.startTextReplyMode}
            onAudioPress={this.startAudioReplyMode}
            onScrollBeginDrag={this.hideRecorder}
          />
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
            {this.PostButton}
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

  public get PostButton() {
    return (
      <PostButton onPress={this.onPostPress}>
        <Post active={this.canPostReply}>등록</Post>
      </PostButton>
    );
  }

  private get navigation() {
    return this.props.navigation;
  }

  private get contentId() {
    return this.navigation.getParam("contentId");
  }

  private get defaultMode() {
    return this.navigation.getParam("mode");
  }

  private get showRecorderAtFirst() {
    return this.navigation.getParam("showRecorder");
  }

  @injectLoading
  private onPostPress = async () => {
    const { replyStore } = this.props;
    const { mode, text, hidden, tagged_user } = this.state;

    if (!this.canPostReply) {
      return false;
    }

    if (mode === "text") {
      const success = await replyStore.postTextReply(this.contentId, {
        type: "text",
        text,
        hidden,
        tagged_user: _.get(tagged_user, ["uuid"], undefined)
      });

      if (success) {
        this.onPostPressSuccess();
      } else {
        this.onPostPressFail();
      }
    } else if (mode === "audio") {
      const success = await replyStore.postAudioReply(this.contentId, {
        uri: audioPath,
        hidden,
        tagged_user: _.get(tagged_user, ["uuid"], undefined)
      });

      if (success) {
        this.onPostPressSuccess();
      } else {
        this.onPostPressFail();
      }
    }
  };

  private onPostPressSuccess = () => {
    const { toastStore } = this.props;
    this.setState({
      text: "",
      recorded: false,
      recordingTime: 0,
      tagged_user: undefined
    });
    setTimeout(() => {
      this.scrollToEnd();
      this.initRecorder();
      this.hideRecorder();
    }, 0);
    toastStore.openToast({
      content: "댓글이 등록되었습니다.",
      type: "INFO"
    });
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
    _.invoke(this.replyListRef.current, ["root", "scrollToOffset"], {
      offset: 0
    });
  };

  private scrollToEnd = () => {
    _.invoke(this.replyListRef.current, ["root", "scrollToEnd"], {
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
}

export const navigateReplyScreen = (
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) => {
  navigation.navigate("ReplyScreen", params);
};
