import _ from "lodash";
import React from "react";
import { AudioRecorder } from "react-native-audio";
import Video from "react-native-video";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { IconButton } from "src/components/buttons/IconButton";
import { RecordButton } from "src/components/buttons/RecordButton";
import { ReplyModeButton } from "src/components/buttons/ReplyModeButton";
import { Bold } from "src/components/texts/Bold";
import { TimeProgressBar } from "src/components/TimeProgressBar";
import { isProduction } from "src/config/environment";
import { navigateButtonModalScreen } from "src/screens/ButtonModalScreen";
import { getStore } from "src/stores/RootStore";
import { colors } from "src/styles/colors";
import { audioPath, clearAudioFile } from "src/utils/Audio";
import { toMSS } from "src/utils/Number";
import { isIos } from "src/utils/Platform";
import { shadow } from "src/utils/Shadow";

export type RecordState = "READY" | "COUNT" | "RECORDING" | "FINISH";
export type BarRightComponentType = "TIME" | "POST" | "NONE";

export interface IRecorderProps {
  navigation: NavigationScreenProp<any, any>;
  maxRecordTime: number;
  onProgress?: ({ currentTime }: { currentTime: number }) => any;
  onInitRecord?: () => any;
  onStartRecord?: () => any;
  onEndRecord?: () => any;
  showBarButtons: boolean;
  showBarLeftButton?: boolean;
  onBarModePress?: () => any;
  onBarPostPress?: () => any;
  isPostActive?: boolean;
  defaultShowBodyContainer: boolean;
  enableMinimize?: boolean;
  barRightComponentType?: BarRightComponentType;
}

interface IState {
  recordState: RecordState;
  count: number;
  playing: boolean;
  currentTime: number;
  playTime: number;
  showBodyContainer: boolean;
}

const GRANTED = isIos() ? "granted" : true;

const MAX_COUNT = isProduction() ? 3 : 1;

const MINIMUM_RECORDING_TIME = isProduction() ? 2 : 0;

const guideTextMap = new Map<RecordState, (...args: any[]) => string>()
  .set("READY", () => "위 버튼을 누르면 녹음이 시작됩니다")
  .set("COUNT", count => `${count}초 후 녹음시작`)
  .set("RECORDING", () => "버튼을 눌러 녹음중지")
  .set("FINISH", () => "녹음내용 확인하기");

const Container = styled.View`
  width: 100%;
  ${shadow({ opacity: 0.18, shadowOffset: { x: 0, y: -1 } })}
`;

const BarContainer = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  width: 100%;
  height: 52px;
  flex-direction: row;
  padding: 16px 12px;
  background-color: ${colors.white};
  align-items: center;
`;

const PostButton = styled.TouchableOpacity.attrs({ activeOpacity: 1 })``;
const Post = styled(Bold)<{ active: boolean }>`
  font-size: 14px;
  width: 48px;
  text-align: center;
  color: ${props => (props.active ? colors.blue300 : colors.gray400)};
`;

const RecordContainer = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  width: 100%;
  height: 212px;
  align-items: center;
  padding-top: 39px;
  background-color: rgb(242, 242, 242);
`;

const RecordingTimeText = styled(Bold)`
  height: 20px;
  color: rgb(155, 155, 155);
  font-size: 14px;
  margin-bottom: 11px;
`;

const RecorderDeleteRow = styled.View`
  width: 100%;
  height: 88px;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 10px;
`;

const DeleteButton = styled(IconButton)`
  position: absolute;
  width: 44px;
  height: 44px;
  right: 40px;
  align-self: center;
`;

const GuideText = styled(Bold)`
  font-size: 15px;
  height: 25px;
  line-height: 25px;
  color: rgba(0, 0, 0, 0.2);
  width: 100%;
  text-align: center;
`;

export class Recorder extends React.Component<IRecorderProps, IState> {
  public countInterval: any;
  public audioRef = React.createRef<Video>();

  constructor(props: IRecorderProps) {
    super(props);

    this.state = {
      recordState: "READY",
      count: MAX_COUNT,
      playing: false,
      currentTime: 0,
      playTime: 0,
      showBodyContainer: props.defaultShowBodyContainer
    };
  }

  public async componentDidMount() {
    const status = await AudioRecorder.checkAuthorizationStatus();
    if (status !== GRANTED) {
      await AudioRecorder.requestAuthorization();
    }

    this.initRecord();
  }

  public componentWillUnmount() {
    const { recordState } = this.state;
    if (recordState === "RECORDING") {
      AudioRecorder.stopRecording();
    }
    AudioRecorder.onProgress = () => null;
    clearAudioFile();
  }

  public render() {
    const {
      maxRecordTime,
      showBarButtons,
      onBarModePress,
      onBarPostPress,
      isPostActive,
      barRightComponentType = "NONE"
    } = this.props;
    const {
      recordState,
      count,
      playing,
      currentTime,
      playTime,
      showBodyContainer
    } = this.state;
    const isRecordFinish = recordState === "FINISH";
    const remainSeconds = Math.max(0, maxRecordTime - currentTime);
    const percent = (currentTime / maxRecordTime) * 100;

    return (
      <Container>
        <BarContainer onPress={this.toggleBodyContainer}>
          {showBarButtons && (
            <ReplyModeButton
              source={images.btnCommentInputText}
              onPress={onBarModePress}
            />
          )}
          <TimeProgressBar
            percent={percent}
            style={
              showBarButtons
                ? { width: "100%", marginLeft: 15, marginRight: 9 }
                : { width: "100%", marginRight: 9 }
            }
            content={showBodyContainer ? "" : "음성댓글을 녹음해보세요."}
          />
          {this.BarRightComponent}
        </BarContainer>
        {showBodyContainer ? (
          <RecordContainer>
            <RecordingTimeText>
              {recordState === "FINISH" && playing
                ? toMSS(playTime)
                : toMSS(currentTime)}
            </RecordingTimeText>
            <RecorderDeleteRow>
              <RecordButton
                state={recordState}
                onPress={this.onRecordPress}
                count={count}
                playing={playing}
              />
              <DeleteButton
                source={isRecordFinish ? images.deleteRed : images.delete}
                disabled={!isRecordFinish}
                onPress={this.onDeletePress}
              />
            </RecorderDeleteRow>
            <GuideText>
              {guideTextMap.get(recordState)!(this.state.count)}
            </GuideText>
          </RecordContainer>
        ) : null}
        {recordState === "FINISH" && (
          <Video
            style={{ display: "none" }}
            ref={this.audioRef}
            paused={!this.state.playing}
            source={{ uri: audioPath }}
            onSeek={() => this.setState({ playing: false, playTime: 0 })}
            onEnd={() => {
              _.invoke(this.audioRef.current, ["seek"], 0);
            }}
            onProgress={e => {
              this.setState({ playTime: e.currentTime });
            }}
          />
        )}
      </Container>
    );
  }

  private get BarRightComponent() {
    const {
      barRightComponentType = "NONE",
      onBarPostPress,
      maxRecordTime
    } = this.props;
    const { currentTime } = this.state;
    const remainSeconds = Math.max(0, maxRecordTime - currentTime);

    const barRightComponentMap: {
      [key in BarRightComponentType]: JSX.Element
    } = {
      NONE: <Post active={false} />,
      POST: (
        <PostButton onPress={onBarPostPress}>
          <Post active={true}>등록</Post>
        </PostButton>
      ),
      TIME: (
        <PostButton onPress={onBarPostPress}>
          <Post active={false}>{toMSS(remainSeconds)}</Post>
        </PostButton>
      )
    };

    return barRightComponentMap[barRightComponentType];
  }

  private onRecordPress = () => {
    const { recordState } = this.state;

    const actionMap: { [key in RecordState]: any } = {
      READY: this.startCount,
      COUNT: _.identity,
      RECORDING: this.endRecord,
      FINISH: this.toggleAudio
    };

    return actionMap[recordState]();
  };

  private initRecord = () => {
    const { recordState } = this.state;
    if (recordState === "RECORDING") {
      AudioRecorder.stopRecording();
    }

    this.setState({
      recordState: "READY",
      count: MAX_COUNT,
      playing: false,
      currentTime: 0,
      playTime: 0
    });

    AudioRecorder.onProgress = ({ currentTime }: { currentTime: number }) => {
      const { maxRecordTime } = this.props;
      _.invoke(this.props, ["onProgress"], { currentTime });
      this.setState({ currentTime });
      if (currentTime >= maxRecordTime) {
        this.endRecord();
        return;
      }
    };

    _.invoke(this.props, ["onInitRecord"], []);
  };

  private startCount = () => {
    const { audioStore } = getStore();
    audioStore.stopAudio();
    audioStore.clearInstantAudio();
    this.setState({ recordState: "COUNT", count: MAX_COUNT });
    this.countInterval = setInterval(() => {
      const { count } = this.state;
      if (count === 1) {
        clearInterval(this.countInterval);
        this.startRecord();
        return;
      }

      this.setState(prevState => ({ count: prevState.count - 1 }));
    }, 1000);
  };

  private startRecord = () => {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      OutputFormat: "aac_adts"
    });
    AudioRecorder.startRecording();
    this.setState({ recordState: "RECORDING" });
    _.invoke(this.props, ["onStartRecord"], []);
  };

  private endRecord = () => {
    const { currentTime } = this.state;
    if (currentTime > MINIMUM_RECORDING_TIME) {
      AudioRecorder.stopRecording();
      this.setState({ recordState: "FINISH" });
      _.invoke(this.props, ["onEndRecord"], []);
    }
  };

  private toggleAudio = () => {
    const { playing } = this.state;
    this.setState({ playing: !playing });
  };

  private onDeletePress = () => {
    const { navigation } = this.props;
    const { toastStore } = getStore();
    navigateButtonModalScreen(navigation, {
      type: "ERROR",
      content: "녹음 내용을 삭제하시겠습니까?",
      leftText: "취소",
      rightText: "삭제하기",
      onLeftPress: () => {
        navigation.goBack(null);
      },
      onRightPress: () => {
        navigation.goBack(null);
        toastStore.openToast({
          type: "INFO",
          content: "녹음 내용을 삭제했습니다."
        });
        this.initRecord();
      }
    });
  };

  private toggleBodyContainer = () => {
    const { enableMinimize } = this.props;

    if (enableMinimize) {
      this.setState(prevState => ({
        showBodyContainer: !prevState.showBodyContainer
      }));
    }
  };

  private showBodyContainer = () => {
    const { enableMinimize } = this.props;

    if (enableMinimize) {
      this.setState({ showBodyContainer: true });
    }
  };

  private hideBodyContainer = () => {
    const { enableMinimize } = this.props;

    if (enableMinimize) {
      this.setState({ showBodyContainer: false });
    }
  };
}
