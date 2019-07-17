import React from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  PanResponderInstance
} from "react-native";
import styled from "styled-components/native";

import { images } from "assets/images";
import { Text } from "src/components/Text";
import { colors } from "src/styles/colors";
import { deviceWidth } from "src/utils/Dimensions";
import { toMSS } from "src/utils/Number";

interface IProps {
  currentTime: number;
  playableDuration: number;
  onSlidingStart?: () => any;
  onSlidingEnd: (percent: number) => any;
}

interface IState {
  isSliding: boolean;
}

const ProgressBar = styled.View`
  width: 100%;
  height: 66px;
  border-radius: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  margin-bottom: 25px;
  margin-horizontal: 24px;
`;

const PatternBackground = styled.Image.attrs({
  source: images.bgPlayPattern,
  resizeMode: "repeat"
})`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: transparent;
`;

const PlayedArea = styled(Animated.View)`
  position: absolute;
  height: 100%;
  left: 0;
  background-color: ${colors.blue300};
  z-index: 100;
  opacity: 0.75;
`;

const ProgressBarPositionListener = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
  z-index: 100;
`;

const LeftTime = styled(Text).attrs({ type: "bold" })`
  font-size: 13px;
  color: ${colors.white};
  margin-left: 16px;
  z-index: 100;
`;

const RightTime = styled(Text).attrs({ type: "bold" })`
  font-size: 13px;
  color: ${colors.white};
  margin-right: 16px;
  z-index: 100;
`;

export class PlayerSlider extends React.Component<IProps, IState> {
  public progressBarWidth = deviceWidth - 48;
  public progressBarXStart = 24;
  public progressBarXEnd = deviceWidth - 24;
  public responder: PanResponderInstance;
  public playTimeAnimation = new Animated.Value(0);

  public state = {
    isSliding: false
  };

  constructor(props: IProps) {
    super(props);

    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderStart: (e, gesture) => {
        this.playTimeAnimation.setValue(gesture.x0);
        this.setState({ isSliding: true });
      },
      onPanResponderMove: Animated.event([
        null,
        { moveX: this.playTimeAnimation }
      ]),
      onPanResponderEnd: () => {
        const releasePercent =
          (((this.playTimeAnimation as any)._value - this.progressBarXStart) /
            this.progressBarWidth) *
          100;

        props.onSlidingEnd(releasePercent);
        this.setState({ isSliding: false });
      }
    });
  }

  public render() {
    const { currentTime, playableDuration } = this.props;
    const { isSliding } = this.state;

    const percent = this.playTimeAnimation.interpolate({
      inputRange: [this.progressBarXStart, this.progressBarXEnd],
      outputRange: ["0%", "100%"],
      extrapolate: "clamp"
    });

    return (
      <ProgressBar onLayout={this.onLayout}>
        <PlayedArea
          style={{
            width: isSliding ? percent : `${this.currentPercent}%`
          }}
        />
        <LeftTime>{toMSS(currentTime)}</LeftTime>
        <RightTime>{toMSS(playableDuration)}</RightTime>
        <PatternBackground />
        <ProgressBarPositionListener {...this.responder.panHandlers} />
      </ProgressBar>
    );
  }

  private get currentPercent() {
    const { currentTime, playableDuration } = this.props;
    return (currentTime / playableDuration) * 100;
  }

  private onLayout = (event: LayoutChangeEvent) => {
    const { width, x } = event.nativeEvent.layout;
    this.progressBarWidth = width;
    this.progressBarXStart = x;
    this.progressBarXEnd = x + width;
  };
}
