import _ from "lodash";
import React from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import styled from "styled-components/native";

import { AudioReplyCardContent } from "src/components/cards/AudioReplyCardContent";
import { TextReplyCardContent } from "src/components/cards/TextReplyCardContent";
import { colors } from "src/styles/colors";
import { deviceWidth } from "src/utils/Dimensions";
import { IReplyButtonsProps, ReplyButtonsCard } from "./ReplyButtonsCard";

interface IProps extends IReplyButtonsProps {
  reply: ITextReply | IAudioReply;
  isPlaying?: boolean;
  scrollEnabled?: boolean;
  swipeBackOnButtonPress?: boolean;
  onPress?: () => any;
  onAvatarPress?: () => any;
  onNamePress?: () => any;
  onPlayPress?: (audio: string) => any;
  onLinkPress?: (url: string) => any;
  onUserTagPress?: () => any;
  onTagPress?: (tag: string) => any;
  onMomentumScrollEnd?: ScrollViewProps["onMomentumScrollEnd"];
}

const Wrapper = styled.View`
  width: ${deviceWidth};
  min-height: 62px;
`;

const Container = styled.ScrollView.attrs({
  horizontal: true,
  pagingEnabled: true,
  showsHorizontalScrollIndicator: false
})`
  width: ${deviceWidth};
  background-color: ${colors.white};
`;

export class ReplyCard extends React.Component<IProps> {
  public scrollViewRef = React.createRef<ScrollView>();

  public render() {
    const { scrollEnabled, onMomentumScrollEnd } = this.props;
    return (
      <Wrapper>
        <Container
          ref={this.scrollViewRef}
          scrollEnabled={scrollEnabled}
          onMomentumScrollEnd={onMomentumScrollEnd}
        >
          {this.Content}
          {this.Buttons}
        </Container>
      </Wrapper>
    );
  }

  private get Content() {
    const {
      reply,
      isPlaying,
      onPress,
      onAvatarPress,
      onNamePress,
      onPlayPress,
      onLinkPress,
      onTagPress,
      onUserTagPress
    } = this.props;

    if (reply.type === "text") {
      return (
        <TextReplyCardContent
          reply={reply}
          onPress={onPress}
          onAvatarPress={onAvatarPress}
          onNamePress={onNamePress}
          onLinkPress={onLinkPress}
          onTagPress={onTagPress}
          onUserTagPress={onUserTagPress}
        />
      );
    } else {
      return (
        <AudioReplyCardContent
          reply={reply}
          isPlaying={isPlaying}
          onPress={onPress}
          onAvatarPress={onAvatarPress}
          onPlayPress={
            onPlayPress ? _.partial(onPlayPress, reply.audio) : undefined
          }
          onNamePress={onNamePress}
          onUserTagPress={onUserTagPress}
        />
      );
    }
  }

  private get Buttons() {
    const {
      isMyReply,
      onTextPress,
      onAudioPress,
      onDeletePress,
      onReportPress
    } = this.props;

    return (
      <ReplyButtonsCard
        isMyReply={isMyReply}
        onTextPress={this.withSwipeBack(onTextPress)}
        onAudioPress={this.withSwipeBack(onAudioPress)}
        onDeletePress={this.withSwipeBack(onDeletePress)}
        onReportPress={this.withSwipeBack(onReportPress)}
      />
    );
  }

  private withSwipeBack = (callback?: () => any) => () => {
    const { swipeBackOnButtonPress } = this.props;

    if (swipeBackOnButtonPress) {
      this.swipeBack(true);
    }

    if (callback) {
      callback();
    }
  };

  private swipeBack = (animated = false) => {
    _.invoke(this.scrollViewRef.current, ["root", "scrollTo"], {
      x: 0,
      animated
    });
  };
}
